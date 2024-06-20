-- CreateTable
CREATE TABLE "orderMetadata" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "orderMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orderMetadata_orderId_key" ON "orderMetadata"("orderId");
