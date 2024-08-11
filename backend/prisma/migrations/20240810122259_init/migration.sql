/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "StudentRaw" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "emailId" TEXT NOT NULL,
    "prn" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "present" BOOLEAN NOT NULL,

    CONSTRAINT "StudentRaw_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentRaw_emailId_key" ON "StudentRaw"("emailId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentRaw_prn_key" ON "StudentRaw"("prn");

-- AddForeignKey
ALTER TABLE "StudentRaw" ADD CONSTRAINT "StudentRaw_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
