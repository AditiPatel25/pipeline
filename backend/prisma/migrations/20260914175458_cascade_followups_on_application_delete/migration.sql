-- DropForeignKey
ALTER TABLE "FollowUp" DROP CONSTRAINT "FollowUp_applicationId_fkey";

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
