/*
  Warnings:

  - You are about to drop the column `Status` on the `StudySession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudySession" DROP COLUMN "Status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PROGRESS';
