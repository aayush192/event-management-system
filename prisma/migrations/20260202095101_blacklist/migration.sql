-- CreateTable
CREATE TABLE "blackList" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blackList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blackList_token_key" ON "blackList"("token");

-- CreateIndex
CREATE INDEX "Event_eventdate_idx" ON "Event"("eventdate");
