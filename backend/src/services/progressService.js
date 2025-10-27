// src/services/progressService.js
const db = require('../database/connection');
const { AppError } = require('../middleware/errorHandler');

/**
 * Utilities
 */
const toInterval = (timeframe = '30d') => {
  // Accepts: '7d', '30d', '90d', 'week', 'month', 'quarter'
  const map = {
    '7d': '7 days',
    '30d': '30 days',
    '90d': '90 days',
    week: '7 days',
    month: '30 days',
    quarter: '90 days',
  };
  return map[timeframe] || '30 days';
};

const computeCurrentStreak = (dateList) => {
  // dateList: array of JS Date (distinct days), DESC order expected
  if (!dateList || dateList.length === 0) return 0;

  const toYMD = d => d.toISOString().slice(0, 10);
  const today = new Date();
  let expected = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  let streak = 0;

  // Build set of YYYY-MM-DD strings for O(1) lookup
  const days = new Set(dateList.map(toYMD));

  // If user has no activity today, streak starts from yesterday only if yesterday had activity.
  if (!days.has(toYMD(expected))) {
    // shift expected to yesterday
    expected.setUTCDate(expected.getUTCDate() - 1);
    if (!days.has(toYMD(expected))) return 0;
  }

  // Count consecutive days going backwards
  while (days.has(toYMD(expected))) {
    streak += 1;
    expected.setUTCDate(expected.getUTCDate() - 1);
  }
  return streak;
};

const progressService = {
  /**
   * Calculate overall progress for a user by aggregating from progress_events and submissions.
   * Returns totals, averages, last activity, and a computed streak.
   */
  async calculateOverallProgress (userId) {
    if (!userId) throw new AppError('User ID is required', 400, 'INVALID_INPUT');

    try {
      // Points and events from progress_events
      const eventsAggQ = `
        SELECT
          COALESCE(SUM(points_earned), 0) AS total_points,
          COUNT(*) AS total_events,
          MAX(timestamp_occurred) AS last_activity
        FROM progress_events
        WHERE user_id = $1
      `;
      const eventsAgg = await db.query(eventsAggQ, [userId]);
      const { total_points, total_events, last_activity } = eventsAgg.rows[0];

      // Scores and completion from submissions
      const subsAggQ = `
        SELECT
          COUNT(*) FILTER (WHERE score IS NOT NULL) AS graded_attempts,
          COALESCE(ROUND(AVG(score)::numeric, 2), 0) AS average_score,
          COUNT(*) FILTER (WHERE score IS NOT NULL AND score >= 60) AS challenges_completed
        FROM submissions
        WHERE user_id = $1
      `;
      const subsAgg = await db.query(subsAggQ, [userId]);
      const { graded_attempts, average_score, challenges_completed } = subsAgg.rows[0];

      // Distinct event days (for streak)
      const daysQ = `
        SELECT DISTINCT DATE_TRUNC('day', timestamp_occurred) AS day
        FROM progress_events
        WHERE user_id = $1
        ORDER BY day DESC
      `;
      const daysRes = await db.query(daysQ, [userId]);
      const dayDates = daysRes.rows.map(r => new Date(r.day));
      const current_streak_days = computeCurrentStreak(dayDates);

      return {
        totalPoints: Number(total_points || 0),
        totalEvents: Number(total_events || 0),
        averageScore: Number(average_score || 0),
        gradedAttempts: Number(graded_attempts || 0),
        challengesCompleted: Number(challenges_completed || 0),
        lastActivityAt: last_activity,
        currentStreakDays: current_streak_days,
      };
    } catch (err) {
      throw new AppError(`Failed to calculate progress: ${err.message}`, 500, 'PROGRESS_AGG_ERROR');
    }
  },

  /**
   * Track a learning event.
   * eventData can include:
   *  - pointsEarned (number)
   *  - relatedGoalId, relatedChallengeId, relatedSubmissionId
   *  - sessionId
   *  - any custom payload (stored in event_data JSONB)
   */
  async trackEvent (userId, eventType, eventData = {}) {
    if (!userId || !eventType) {
      throw new AppError('userId and eventType are required', 400, 'INVALID_INPUT');
    }

    const {
      pointsEarned = 0,
      relatedGoalId = null,
      relatedChallengeId = null,
      relatedSubmissionId = null,
      sessionId = null,
      ...rest // any extra keys go into event_data
    } = eventData;

    try {
      const q = `
        INSERT INTO progress_events (
          user_id, event_type, event_data, points_earned,
          related_goal_id, related_challenge_id, related_submission_id,
          session_id, timestamp_occurred, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING *;
      `;
      const values = [
        userId,
        eventType,
        JSON.stringify(rest),
        pointsEarned,
        relatedGoalId,
        relatedChallengeId,
        relatedSubmissionId,
        sessionId,
      ];
      const { rows } = await db.query(q, values);
      return rows[0];
    } catch (err) {
      throw new AppError(`Failed to track event: ${err.message}`, 500, 'EVENT_CREATE_ERROR');
    }
  },

  /**
   * Generate analytics time series and breakdowns for a timeframe.
   * timeframe: '7d' | '30d' | '90d' | 'week' | 'month' | 'quarter'
   */
  async generateAnalytics (userId, timeframe = '30d') {
    if (!userId) throw new AppError('User ID is required', 400, 'INVALID_INPUT');

    const interval = toInterval(timeframe);

    try {
      // Time series of points and event counts
      const seriesQ = `
        SELECT
          DATE_TRUNC('day', timestamp_occurred) AS day,
          COALESCE(SUM(points_earned), 0) AS points,
          COUNT(*) AS events
        FROM progress_events
        WHERE user_id = $1
          AND timestamp_occurred >= NOW() - INTERVAL '${interval}'
        GROUP BY 1
        ORDER BY 1 ASC;
      `;
      const seriesRes = await db.query(seriesQ, [userId]);

      // Breakdown by event_type
      const typeQ = `
        SELECT
          event_type,
          COUNT(*) AS events,
          COALESCE(SUM(points_earned), 0) AS points
        FROM progress_events
        WHERE user_id = $1
          AND timestamp_occurred >= NOW() - INTERVAL '${interval}'
        GROUP BY event_type
        ORDER BY points DESC, events DESC;
      `;
      const typeRes = await db.query(typeQ, [userId]);

      // Top categories by related_challenge_id → challenges.category
      const catQ = `
        SELECT
          c.category,
          COUNT(*) AS events,
          COALESCE(SUM(pe.points_earned), 0) AS points
        FROM progress_events pe
        JOIN challenges c ON c.id = pe.related_challenge_id
        WHERE pe.user_id = $1
          AND pe.timestamp_occurred >= NOW() - INTERVAL '${interval}'
        GROUP BY c.category
        ORDER BY points DESC, events DESC
        LIMIT 10;
      `;
      const catRes = await db.query(catQ, [userId]);

      return {
        timeframe,
        series: seriesRes.rows.map(r => ({
          day: r.day,
          points: Number(r.points),
          events: Number(r.events),
        })),
        byEventType: typeRes.rows.map(r => ({
          eventType: r.event_type,
          events: Number(r.events),
          points: Number(r.points),
        })),
        topCategories: catRes.rows.map(r => ({
          category: r.category,
          events: Number(r.events),
          points: Number(r.points),
        })),
      };
    } catch (err) {
      throw new AppError(`Failed to generate analytics: ${err.message}`, 500, 'ANALYTICS_ERROR');
    }
  },

  /**
   * Check milestone completion based on simple thresholds.
   * You can later persist earned milestones into achievements/user_achievements if desired.
   */
  async checkMilestones (userId) {
    if (!userId) throw new AppError('User ID is required', 400, 'INVALID_INPUT');

    // Pull current aggregate stats
    const stats = await this.calculateOverallProgress(userId);
    const {
      totalPoints,
      totalEvents,
      challengesCompleted,
      currentStreakDays,
    } = stats;

    const milestones = [];

    // Example milestone rules (tweak freely)
    if (totalEvents >= 1) milestones.push({ key: 'first_steps', name: 'First Steps', description: 'Tracked your first learning activity.' });
    if (challengesCompleted >= 1) milestones.push({ key: 'first_win', name: 'First Win', description: 'Completed your first challenge.' });
    if (totalPoints >= 100) milestones.push({ key: 'century', name: 'Century Club', description: 'Earned 100+ points.' });
    if (totalPoints >= 500) milestones.push({ key: 'high_roller', name: 'High Roller', description: 'Earned 500+ points.' });
    if (currentStreakDays >= 3) milestones.push({ key: 'hot_streak', name: 'Hot Streak', description: 'Active 3+ days in a row.' });
    if (currentStreakDays >= 7) milestones.push({ key: 'weekly_warrior', name: 'Weekly Warrior', description: 'Active 7+ days in a row.' });

    return {
      stats,
      milestones,
    };
  },
};

module.exports = progressService;
