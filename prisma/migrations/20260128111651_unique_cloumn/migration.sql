/*
  Warnings:

  - A unique constraint covering the columns `[email,hashedToken,purpose]` on the table `mailToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "mailToken_email_hashedToken_key";

-- CreateIndex
CREATE UNIQUE INDEX "mailToken_email_hashedToken_purpose_key" ON "mailToken"("email", "hashedToken", "purpose");
