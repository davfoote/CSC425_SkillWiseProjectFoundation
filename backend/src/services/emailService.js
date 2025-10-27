// src/services/emailService.js
const nodemailer = require('nodemailer');

let cachedTransporter = null;

/**
 * Build (and cache) a Nodemailer transporter from env.
 * Falls back to a safe "log-only" transport if SMTP isn't configured.
 */
function getTransporter () {
  if (cachedTransporter) return cachedTransporter;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    NODE_ENV,
  } = process.env;

  const hasSmtp =
    SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS;

  if (hasSmtp) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for 587/25
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } else {
    // Dev-safe fallback: don't throw, just log the email content
    cachedTransporter = {
      sendMail: async (options) => {
        const summary = {
          simulated: true,
          reason: 'SMTP not configured; logging email instead.',
          to: options.to,
          subject: options.subject,
        };
        // eslint-disable-next-line no-console
        console.warn('[EmailService] SMTP not configured. Email not sent.');
        // eslint-disable-next-line no-console
        console.warn('[Email Preview]', {
          ...summary,
          text: options.text,
          html: options.html,
        });
        return {
          messageId: `dev-preview-${Date.now()}`,
          accepted: [],
          rejected: [],
          envelope: { to: [options.to] },
          response: 'Logged only (no SMTP configured)',
        };
      },
    };

    if (NODE_ENV === 'production') {
      // In prod we should fail fast if SMTP is missing
      // but still allow the app to boot if you prefer.
      // Uncomment the next line to enforce strict prod behavior:
      // throw new Error('SMTP is not configured in production.');
    }
  }

  return cachedTransporter;
}

function fromAddress () {
  // Prefer the configured SMTP user, fallback to a neutral label
  const { SMTP_USER } = process.env;
  return SMTP_USER ? `"SkillWise" <${SMTP_USER}>` : 'SkillWise <no-reply@skillwise.local>';
}

/** ---------- Simple HTML templates ---------- */
function baseHtmlTemplate ({ title, body }) {
  return `
  <div style="font-family: Arial, sans-serif; line-height:1.55; color:#222; max-width:600px">
    <h2 style="margin:0 0 12px">${title}</h2>
    <div>${body}</div>
    <hr style="border:none;border-top:1px solid #eee; margin:24px 0" />
    <p style="font-size:12px; color:#777">This is an automated message from SkillWise.</p>
  </div>`;
}

function welcomeHtml ({ name }) {
  return baseHtmlTemplate({
    title: 'Welcome to SkillWise 🎉',
    body: `
      <p>Hi ${name || 'there'},</p>
      <p>Welcome aboard! You can start exploring challenges, set goals, and track your progress.</p>
      <p>Need help getting started? Reply to this email.</p>
    `,
  });
}

function resetHtml ({ token }) {
  const appUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetLink = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;
  return baseHtmlTemplate({
    title: 'Reset your password',
    body: `
      <p>We received a request to reset your password.</p>
      <p><a href="${resetLink}">Click here to reset your password</a>. If you didn’t request this, you can ignore this email.</p>
      <p>This link may expire after a short time for security.</p>
    `,
  });
}

function progressHtml ({ completed, points, streak }) {
  return baseHtmlTemplate({
    title: 'Your SkillWise progress update',
    body: `
      <p>Nice work! Here’s a quick snapshot:</p>
      <ul>
        <li>Challenges completed: <strong>${completed ?? 0}</strong></li>
        <li>Total points: <strong>${points ?? 0}</strong></li>
        <li>Current streak: <strong>${streak ?? 0}</strong> day(s)</li>
      </ul>
      <p>Keep it up!</p>
    `,
  });
}

function achievementHtml ({ name, description, points }) {
  return baseHtmlTemplate({
    title: `Achievement unlocked: ${name}`,
    body: `
      <p>You’ve earned a new achievement!</p>
      <p><strong>${name}</strong></p>
      <p>${description || ''}</p>
      ${points ? `<p>Points awarded: <strong>${points}</strong></p>` : ''}
    `,
  });
}

/** ---------- Public API ---------- */
const emailService = {
  async sendWelcomeEmail (userEmail, userName) {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: fromAddress(),
      to: userEmail,
      subject: 'Welcome to SkillWise',
      text: `Hi ${userName || 'there'}, welcome to SkillWise!`,
      html: welcomeHtml({ name: userName }),
    });
    return { messageId: info.messageId };
  },

  async sendPasswordResetEmail (userEmail, resetToken) {
    if (!resetToken) throw new Error('resetToken is required');
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: fromAddress(),
      to: userEmail,
      subject: 'Reset your SkillWise password',
      text: `Use this link to reset your password: ${resetToken}`,
      html: resetHtml({ token: resetToken }),
    });
    return { messageId: info.messageId };
  },

  async sendProgressUpdate (userEmail, progressData = {}) {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: fromAddress(),
      to: userEmail,
      subject: 'Your SkillWise progress update',
      text: `Progress: ${JSON.stringify(progressData)}`,
      html: progressHtml(progressData),
    });
    return { messageId: info.messageId };
  },

  async sendAchievementNotification (userEmail, achievement) {
    if (!achievement || !achievement.name) {
      throw new Error('achievement with a name is required');
    }
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: fromAddress(),
      to: userEmail,
      subject: `Achievement unlocked: ${achievement.name}`,
      text: `You unlocked "${achievement.name}". ${achievement.description || ''}`,
      html: achievementHtml({
        name: achievement.name,
        description: achievement.description,
        points: achievement.points_reward || achievement.points,
      }),
    });
    return { messageId: info.messageId };
  },
};

module.exports = emailService;
