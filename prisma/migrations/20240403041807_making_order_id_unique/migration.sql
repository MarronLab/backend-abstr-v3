/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `orderBook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orderBook_orderId_key" ON "orderBook"("orderId");
