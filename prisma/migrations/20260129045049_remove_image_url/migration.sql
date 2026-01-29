/*
  Warnings:

  - You are about to drop the column `coverImageUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `EventImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "coverImageUrl";

-- AlterTable
ALTER TABLE "EventImage" DROP COLUMN "imageUrl";
