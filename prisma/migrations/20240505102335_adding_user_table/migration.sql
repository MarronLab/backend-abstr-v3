-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "safeAddress" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_safeAddress_key" ON "user"("safeAddress");

-- CreateIndex
CREATE UNIQUE INDEX "user_userAddress_key" ON "user"("userAddress");
