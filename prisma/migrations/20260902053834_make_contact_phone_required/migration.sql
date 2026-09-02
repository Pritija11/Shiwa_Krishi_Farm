/*
  Warnings:

  - Made the column `phone` on table `ContactMessage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ContactMessage" ALTER COLUMN "phone" SET NOT NULL;
