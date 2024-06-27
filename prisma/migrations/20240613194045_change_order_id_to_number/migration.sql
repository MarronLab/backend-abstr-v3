/*
  Warnings:

  - Changed the type of `orderId` on the `orderMetadata` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "orderMetadata" DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orderMetadata_orderId_key" ON "orderMetadata"("orderId");
