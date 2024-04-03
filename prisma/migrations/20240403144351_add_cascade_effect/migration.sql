-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_notes_id_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_user_id_fkey";

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_notes_id_fkey" FOREIGN KEY ("notes_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
