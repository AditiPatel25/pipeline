-- CreateEnum
CREATE TYPE "WorkArrangement" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "employmentType" "EmploymentType",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "workArrangement" "WorkArrangement";
