/*
  Warnings:

  - The `source` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ApplicationSource" AS ENUM ('LINKEDIN', 'INDEED', 'COMPANY_WEBSITE', 'REFERRAL', 'CAREER_FAIR', 'OTHER');

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "source",
ADD COLUMN     "source" "ApplicationSource";
