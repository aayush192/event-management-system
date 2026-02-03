/*
  Warnings:

  - You are about to drop the column `encryptedMail` on the `mailToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `mailToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `mailToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `mailToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "mailToken_email_encryptedMail_purpose_key";

-- AlterTable
ALTER TABLE "mailToken" DROP COLUMN "encryptedMail",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "mailToken_token_key" ON "mailToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "mailToken_email_key" ON "mailToken"("email");
