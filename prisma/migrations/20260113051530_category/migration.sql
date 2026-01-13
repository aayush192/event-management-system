-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('CONFERENCE', 'WORKSHOP', 'MEETUP', 'WEBINAR', 'SEMINAR', 'SOCIAL', 'SPORTS', 'MUSIC', 'OTHER');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "category" "EventCategory" NOT NULL DEFAULT 'OTHER';
