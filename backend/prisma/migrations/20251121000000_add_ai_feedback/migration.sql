-- Create submissions table
CREATE TABLE "submissions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "filename" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- Create ai_feedbacks table
CREATE TABLE "ai_feedbacks" (
    "id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "feedback" TEXT NOT NULL,
    "raw_response" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_feedbacks_pkey" PRIMARY KEY ("id")
);

-- Index for quick lookups
CREATE INDEX "ai_feedbacks_submission_id_idx" ON "ai_feedbacks"("submission_id");

-- Foreign key to submissions
ALTER TABLE "ai_feedbacks" ADD CONSTRAINT "ai_feedbacks_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
