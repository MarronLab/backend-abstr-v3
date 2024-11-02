/*
  Warnings:

  - You are about to drop the column `modulusCustomerEmail` on the `orderBook` table. All the data in the column will be lost.
  - You are about to drop the column `modulusCustomerEmail` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `modulusCustomerEmail` on the `userFavorite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,coinId]` on the table `userFavorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `userFavorite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orderBook" DROP CONSTRAINT "orderBook_modulusCustomerEmail_fkey";

-- DropForeignKey
ALTER TABLE "userFavorite" DROP CONSTRAINT "userFavorite_modulusCustomerEmail_fkey";

-- DropIndex
DROP INDEX "user_modulusCustomerEmail_key";

-- DropIndex
DROP INDEX "userFavorite_modulusCustomerEmail_coinId_key";

-- AlterTable
ALTER TABLE "orderBook" DROP COLUMN "modulusCustomerEmail",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "modulusCustomerEmail",
ADD COLUMN     "userEmail" TEXT;

-- AlterTable
ALTER TABLE "userFavorite" DROP COLUMN "modulusCustomerEmail",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "userFavorite_userId_coinId_key" ON "userFavorite"("userId", "coinId");

-- AddForeignKey
ALTER TABLE "orderBook" ADD CONSTRAINT "orderBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userFavorite" ADD CONSTRAINT "userFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
