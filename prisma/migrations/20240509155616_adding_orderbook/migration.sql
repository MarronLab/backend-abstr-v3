/*
  Warnings:

  - Added the required column `price` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `side` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `orderBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orderBook" ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "side" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
