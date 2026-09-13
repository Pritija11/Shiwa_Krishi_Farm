-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "SubscriptionDuration" AS ENUM ('ONGOING', 'ONE_MONTH', 'THREE_MONTHS', 'SIX_MONTHS');

-- AlterEnum
ALTER TYPE "SubscriptionFrequency" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "MilkSubscription" ADD COLUMN     "deliveryDays" "DayOfWeek"[] DEFAULT ARRAY[]::"DayOfWeek"[],
ADD COLUMN     "duration" "SubscriptionDuration" NOT NULL DEFAULT 'ONGOING',
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "productId" TEXT;

-- CreateIndex
CREATE INDEX "MilkSubscription_productId_idx" ON "MilkSubscription"("productId");

-- AddForeignKey
ALTER TABLE "MilkSubscription" ADD CONSTRAINT "MilkSubscription_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
