/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Event` table. All the data in the column will be lost.
  - Added the required column `coverImageUrl` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privateId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "coverImage",
ADD COLUMN     "coverImageUrl" TEXT NOT NULL,
ADD COLUMN     "privateId" TEXT NOT NULL;
