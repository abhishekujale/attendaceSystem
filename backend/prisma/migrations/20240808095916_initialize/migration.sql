-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "compony" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "round" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
