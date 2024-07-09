/*
  Warnings:

  - You are about to drop the `coingecko_response` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "coingecko_response";

-- CreateTable
CREATE TABLE "coingeckoResponse" (
    "id" TEXT NOT NULL,
    "type" "CoinGeckoResponseType" NOT NULL,
    "data" JSONB[],
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "coingeckoResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coingeckoResponse_type_key" ON "coingeckoResponse"("type");
