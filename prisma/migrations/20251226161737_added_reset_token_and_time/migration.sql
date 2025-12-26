/*
  Warnings:

  - Made the column `bullMqJobId` on table `WalkSession` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- AlterTable
ALTER TABLE "WalkSession" ALTER COLUMN "bullMqJobId" SET NOT NULL;
