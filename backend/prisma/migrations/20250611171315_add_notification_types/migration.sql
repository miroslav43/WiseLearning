-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'TUTORING_REQUEST';
ALTER TYPE "NotificationType" ADD VALUE 'TUTORING_ACCEPTED';
ALTER TYPE "NotificationType" ADD VALUE 'TUTORING_REJECTED';
ALTER TYPE "NotificationType" ADD VALUE 'COURSE_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE 'COURSE_REJECTED';
