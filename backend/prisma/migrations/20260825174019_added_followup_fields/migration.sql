-- CreateEnum
CREATE TYPE "FollowUpType" AS ENUM ('ASSESSMENT', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'FOLLOW_UP_EMAIL', 'OTHER');

-- AlterTable
ALTER TABLE "FollowUp" ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" "FollowUpType" NOT NULL DEFAULT 'OTHER';
