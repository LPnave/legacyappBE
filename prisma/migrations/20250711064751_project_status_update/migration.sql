/*
  Warnings:

  - The values [Draft,InProgress,Completed] on the enum `ProjectStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProjectStatus_new" AS ENUM ('Working', 'Review', 'Ready');
ALTER TABLE "Project" ALTER COLUMN "Status" TYPE "ProjectStatus_new" USING ("Status"::text::"ProjectStatus_new");
ALTER TYPE "ProjectStatus" RENAME TO "ProjectStatus_old";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";
DROP TYPE "ProjectStatus_old";
COMMIT;
