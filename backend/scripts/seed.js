#!/usr/bin/env node
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://skillwise_user:skillwise_pass@localhost:5432/skillwise_db',
});

async function seedDatabase () {
  try {
    console.log('Starting database seeding...');

    // Clear existing data (optional)
    await pool.query(`
      TRUNCATE TABLE user_achievements, achievements, leaderboard, user_statistics, progress_events,
      peer_reviews, ai_feedback, submissions, challenges, goals, refresh_tokens, users
      RESTART IDENTITY CASCADE;
    `);

    // Users
    console.log('Seeding users...');
    await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
      VALUES 
      ('alice@example.com', 'hashedpassword123', 'Alice', 'Johnson', 'student', true),
      ('bob@example.com', 'hashedpassword456', 'Bob', 'Smith', 'instructor', true),
      ('carol@example.com', 'hashedpassword789', 'Carol', 'Lee', 'student', true);
    `);

    // Goals
    console.log('Seeding goals...');
    await pool.query(`
      INSERT INTO goals (user_id, title, description, category, difficulty_level, points_reward)
      VALUES
      (1, 'Learn JavaScript Basics', 'Complete the JS beginner track', 'Programming', 'easy', 100),
      (2, 'Master PostgreSQL', 'Finish SQL practice challenges', 'Database', 'medium', 200);
    `);

    // Challenges
    console.log('Seeding challenges...');
    await pool.query(`
      INSERT INTO challenges (title, description, instructions, category, difficulty_level, points_reward)
      VALUES
      ('Variables 101', 'Learn to declare variables in JavaScript', 'Complete all exercises', 'Programming', 'easy', 50),
      ('SQL Joins Practice', 'Work with inner and outer joins', 'Write correct SQL queries', 'Database', 'medium', 80);
    `);

    // Achievements
    console.log('Seeding achievements...');
    await pool.query(`
      INSERT INTO achievements (name, description, category, points_reward, rarity, criteria)
      VALUES
      ('First Steps', 'Complete your first challenge', 'Milestone', 50, 'common', '{"type":"challenge_completed","count":1}'),
      ('Goal Getter', 'Complete your first goal', 'Milestone', 100, 'common', '{"type":"goal_completed","count":1}');
    `);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
