-- CreateTable
CREATE TABLE "orderBook" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "orderBook_pkey" PRIMARY KEY ("id")
);
