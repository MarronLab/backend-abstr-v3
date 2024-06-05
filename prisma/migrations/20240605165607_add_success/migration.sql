/*
  Warnings:

  - Added the required column `success` to the `userActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userActivity" ADD COLUMN     "success" BOOLEAN NOT NULL,
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMP(6);
