/*
  Warnings:

  - You are about to drop the column `scheduledAt` on the `FollowUp` table. All the data in the column will be lost.
  - Made the column `title` on table `FollowUp` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FollowUp" DROP COLUMN "scheduledAt",
ALTER COLUMN "title" SET NOT NULL;
