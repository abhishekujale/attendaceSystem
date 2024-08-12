-- DropForeignKey
ALTER TABLE "StudentRaw" DROP CONSTRAINT "StudentRaw_eventId_fkey";

-- AddForeignKey
ALTER TABLE "StudentRaw" ADD CONSTRAINT "StudentRaw_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
