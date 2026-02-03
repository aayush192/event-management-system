/*
  Warnings:

  - You are about to drop the column `hashedToken` on the `mailToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,encryptedMail,purpose]` on the table `mailToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `encryptedMail` to the `mailToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `mailToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "mailToken_email_hashedToken_purpose_key";

-- AlterTable
ALTER TABLE "mailToken" DROP COLUMN "hashedToken",
ADD COLUMN     "encryptedMail" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "mailToken_email_encryptedMail_purpose_key" ON "mailToken"("email", "encryptedMail", "purpose");
