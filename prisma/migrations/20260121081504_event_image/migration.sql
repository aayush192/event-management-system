/*
  Warnings:

  - You are about to drop the column `type` on the `EventImage` table. All the data in the column will be lost.
  - Added the required column `coverImage` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `phoneNo` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "coverImage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventImage" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "phoneNo" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- DropEnum
DROP TYPE "imageType";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
