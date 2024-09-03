-- CreateTable
CREATE TABLE "userFavorite" (
    "id" TEXT NOT NULL,
    "modulusCustomerEmail" TEXT NOT NULL,
    "coinId" TEXT NOT NULL,

    CONSTRAINT "userFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userFavorite_modulusCustomerEmail_coinId_key" ON "userFavorite"("modulusCustomerEmail", "coinId");

-- AddForeignKey
ALTER TABLE "userFavorite" ADD CONSTRAINT "userFavorite_modulusCustomerEmail_fkey" FOREIGN KEY ("modulusCustomerEmail") REFERENCES "user"("modulusCustomerEmail") ON DELETE RESTRICT ON UPDATE CASCADE;
