/*
  Warnings:

  - Added the required column `purpose` to the `mailToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Purpose" AS ENUM ('RESET_PASSWORD', 'REGISTER_USER');

-- AlterTable
ALTER TABLE "mailToken" ADD COLUMN     "purpose" "Purpose" NOT NULL;
