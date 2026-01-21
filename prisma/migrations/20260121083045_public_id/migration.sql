/*
  Warnings:

  - You are about to drop the column `privateId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `EventImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "privateId",
ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventImage" ADD COLUMN     "publicId" TEXT NOT NULL;
