-- CreateTable
CREATE TABLE "goals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100),
    "difficulty_level" VARCHAR(20) NOT NULL DEFAULT 'medium',
    "target_completion_date" TIMESTAMP(3),
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completion_date" TIMESTAMP(3),
    "progress_percentage" INTEGER NOT NULL DEFAULT 0,
    "points_reward" INTEGER NOT NULL DEFAULT 100,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
