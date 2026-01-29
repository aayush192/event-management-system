/*
  Warnings:

  - A unique constraint covering the columns `[email,hashedToken]` on the table `mailToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mailToken_email_hashedToken_key" ON "mailToken"("email", "hashedToken");
