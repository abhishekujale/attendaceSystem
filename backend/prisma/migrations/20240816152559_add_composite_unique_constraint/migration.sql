/*
  Warnings:

  - A unique constraint covering the columns `[eventId,emailId,prn]` on the table `StudentRaw` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StudentRaw_emailId_key";

-- DropIndex
DROP INDEX "StudentRaw_prn_key";

-- CreateIndex
CREATE UNIQUE INDEX "StudentRaw_eventId_emailId_prn_key" ON "StudentRaw"("eventId", "emailId", "prn");
