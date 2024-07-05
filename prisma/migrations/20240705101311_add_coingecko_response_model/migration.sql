-- CreateEnum
CREATE TYPE "CoinGeckoResponseType" AS ENUM ('MARKET_DATA');

-- CreateTable
CREATE TABLE "coingecko_response" (
    "id" TEXT NOT NULL,
    "type" "CoinGeckoResponseType" NOT NULL,
    "data" JSONB[],
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "coingecko_response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coingecko_response_type_key" ON "coingecko_response"("type");
