/*
  Warnings:

  - You are about to drop the `orderMetadata` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `orderId` on the `orderBook` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `metadata` on the `orderBook` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "orderBook" DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER NOT NULL,
DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSONB NOT NULL;

-- DropTable
DROP TABLE "orderMetadata";

-- CreateIndex
CREATE UNIQUE INDEX "orderBook_orderId_key" ON "orderBook"("orderId");
