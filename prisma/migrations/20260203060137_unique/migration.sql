/*
  Warnings:

  - A unique constraint covering the columns `[email,token,purpose]` on the table `mailToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "mailToken_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "mailToken_email_token_purpose_key" ON "mailToken"("email", "token", "purpose");
