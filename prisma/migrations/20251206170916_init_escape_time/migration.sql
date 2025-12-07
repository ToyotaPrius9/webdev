-- CreateTable
CREATE TABLE "EscapeTime" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSeconds" INTEGER NOT NULL,
    "studentId" TEXT,
    "route" TEXT,

    CONSTRAINT "EscapeTime_pkey" PRIMARY KEY ("id")
);
