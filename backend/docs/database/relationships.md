# Database relationships

This document describes the main database tables and their relationships for the SkillWise backend. Use this as a quick reference when updating migrations or writing queries.

Note: column names shown are illustrative and should match the actual migrations in `backend/src/database/migrations`.

## Primary tables

- users (id PK)
- goals (id PK)
- challenges (id PK)
- submissions (id PK)
- progress (id PK)
- peer_reviews (id PK)
- ai_feedback (id PK)
- leaderboard (id PK)

## Relationships (high level)

- users -> goals
  - One user can have many goals.
  - `goals.user_id` REFERENCES `users.id` ON DELETE CASCADE

- users -> submissions
  - One user can make many submissions.
  - `submissions.user_id` REFERENCES `users.id` ON DELETE SET NULL (or CASCADE depending on business rules)

- users -> progress
  - One user can have many progress entries (for different goals).
  - `progress.user_id` REFERENCES `users.id` ON DELETE CASCADE

- goals -> progress
  - One goal can have many progress entries (multiple updates over time), or one progress per user/goal depending on design.
  - `progress.goal_id` REFERENCES `goals.id` ON DELETE CASCADE

- challenges -> submissions
  - One challenge can have many submissions.
  - `submissions.challenge_id` REFERENCES `challenges.id` ON DELETE CASCADE

- submissions -> peer_reviews
  - One submission can receive many peer reviews.
  - `peer_reviews.submission_id` REFERENCES `submissions.id` ON DELETE CASCADE

- submissions -> ai_feedback
  - One submission may have 0..1 AI feedback records.
  - `ai_feedback.submission_id` REFERENCES `submissions.id` ON DELETE CASCADE

- users -> peer_reviews (as reviewer)
  - `peer_reviews.reviewer_id` REFERENCES `users.id` ON DELETE SET NULL (or RESTRICT)

- leaderboard
  - Leaderboard entries typically reference `users.id` and store an aggregated `score`.
  - `leaderboard.user_id` REFERENCES `users.id` ON DELETE CASCADE

## Many-to-many and auxiliary tables

- If you track challenge participants or enrollments, use a join table:
  - `challenge_participants` (`id`, `challenge_id`, `user_id`, `joined_at`)
  - `challenge_participants.challenge_id` REFERENCES `challenges.id`
  - `challenge_participants.user_id` REFERENCES `users.id`

- For tags/categories, use join tables such as `goal_tags` or `challenge_tags`.

## Indexing recommendations

- Add indexes on foreign key columns for faster joins, e.g. `goals.user_id`, `submissions.challenge_id`, `progress.goal_id`.
- Consider composite unique indexes where appropriate (e.g. `progress` unique on `(user_id, goal_id)` if only one progress row per user/goal is allowed).

## Cascade and delete behavior notes

- Prefer `ON DELETE CASCADE` for child rows that should be removed when a parent is removed (e.g., goals -> progress, challenges -> submissions, submissions -> peer_reviews).
- Use `ON DELETE SET NULL` or `RESTRICT` for references where you want to preserve child records or avoid accidental deletes (e.g., historical submissions when a user is removed).

## Example ER snippet (ASCII)

users (1) ---< (N) goals
users (1) ---< (N) submissions >--- (1) challenges
submissions (1) ---< (N) peer_reviews
goals (1) ---< (N) progress

## Next steps

- Sync this doc with concrete column names and constraints from the migration files in `backend/src/database/migrations`.
- Add a visual ER diagram (e.g., generated with draw.io or dbdiagram.io) and store it in `docs/`.
