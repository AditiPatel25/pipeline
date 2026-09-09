-- CreateEnum
CREATE TYPE "ResumeSource" AS ENUM ('SAVED', 'ANOTHER');

-- AlterTable
ALTER TABLE "ResumeMatch" ADD COLUMN     "resumeName" TEXT,
ADD COLUMN     "resumeSource" "ResumeSource" NOT NULL DEFAULT 'SAVED';
