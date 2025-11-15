-- CreateTable
CREATE TABLE "challenges" (
    "id" SERIAL NOT NULL,
    "goal_id" INTEGER,
    "created_by" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "difficulty_level" VARCHAR(20) NOT NULL DEFAULT 'medium',
    "estimated_time_minutes" INTEGER,
    "points_reward" INTEGER NOT NULL DEFAULT 10,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "requires_peer_review" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[],
    "prerequisites" TEXT[],
    "learning_objectives" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
