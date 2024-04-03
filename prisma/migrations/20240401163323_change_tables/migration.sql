/*
  Warnings:

  - Made the column `user_id` on table `notes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notes_id` on table `tags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `tags` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_notes_id_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_user_id_fkey";

-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "notes_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_notes_id_fkey" FOREIGN KEY ("notes_id") REFERENCES "notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
