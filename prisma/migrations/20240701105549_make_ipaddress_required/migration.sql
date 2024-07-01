/*
  Warnings:

  - Made the column `idAddress` on table `userActivity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "userActivity" ALTER COLUMN "idAddress" SET NOT NULL;
