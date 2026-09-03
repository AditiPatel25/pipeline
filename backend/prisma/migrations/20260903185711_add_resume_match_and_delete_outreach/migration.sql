/*
  Warnings:

  - You are about to drop the `Outreach` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `matchScore` to the `ResumeMatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suggestions` to the `ResumeMatch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Outreach" DROP CONSTRAINT "Outreach_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Outreach" DROP CONSTRAINT "Outreach_userId_fkey";

-- AlterTable
ALTER TABLE "ResumeMatch" ADD COLUMN     "matchScore" INTEGER NOT NULL,
ADD COLUMN     "suggestions" JSONB NOT NULL;

-- DropTable
DROP TABLE "Outreach";

-- DropEnum
DROP TYPE "OutreachSource";
