-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
