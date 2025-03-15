/*
  Warnings:

  - The values [PROGRESS,COMPLETED,PAUSED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('progress', 'completed', 'paused');
ALTER TABLE "StudySession" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "StudySession" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "StudySession" ALTER COLUMN "status" SET DEFAULT 'progress';
COMMIT;

-- AlterTable
ALTER TABLE "StudySession" ALTER COLUMN "status" SET DEFAULT 'progress';
