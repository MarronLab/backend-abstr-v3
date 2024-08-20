/*
  Warnings:

  - You are about to drop the column `orderId` on the `orderBook` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `orderBook` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `orderBook` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderID]` on the table `orderBook` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[modulusCustomerEmail]` on the table `orderBook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currencyPair` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `limitPrice` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modulusCustomerEmail` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderID` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remaining` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusType` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stopPrice` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeInForce` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trailingAmount` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `side` to the `orderBook` table without a default value. This is not possible if the table is not empty.
  - Made the column `size` on table `orderBook` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TimeInForceType" AS ENUM ('TIF_NONE', 'TIF_GTC', 'TIF_DAY', 'TIF_IOC', 'TIF_FOK');

-- CreateEnum
CREATE TYPE "SideType" AS ENUM ('SIDE_NONE', 'SIDE_BUY', 'SIDE_SELL');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('ORDER_TYPE_NONE', 'ORDER_TYPE_MARKET', 'ORDER_TYPE_LIMIT', 'ORDER_TYPE_STOP_MARKET', 'ORDER_TYPE_STOP_LIMIT', 'ORDER_TYPE_TRAILING_STOP_LIMIT', 'ORDER_TYPE_TRAILING_STOP_MARKET');

-- CreateEnum
CREATE TYPE "OrderStatusType" AS ENUM ('ORDER_STATUS_NONE', 'ORDER_STATUS_ACCEPTED', 'ORDER_STATUS_PARTIALLY_FILLED', 'ORDER_STATUS_FILLED', 'ORDER_STATUS_CANCELLED', 'ORDER_STATUS_REJECTED', 'ORDER_STATUS_EXPIRED', 'ORDER_STATUS_ORDER_STATUS_END', 'ORDER_STATUS_CANCEL_ACCEPTED', 'ORDER_STATUS_CANCEL_REJECTED', 'ORDER_STATUS_STOP_ACTIVATED');

-- DropIndex
DROP INDEX "orderBook_orderId_key";

-- AlterTable
ALTER TABLE "orderBook" DROP COLUMN "orderId",
DROP COLUMN "price",
DROP COLUMN "userId",
ADD COLUMN     "currencyPair" TEXT NOT NULL,
ADD COLUMN     "limitPrice" INTEGER NOT NULL,
ADD COLUMN     "modulusCustomerEmail" TEXT NOT NULL,
ADD COLUMN     "orderID" INTEGER NOT NULL,
ADD COLUMN     "remaining" INTEGER NOT NULL,
ADD COLUMN     "statusType" "OrderStatusType" NOT NULL,
ADD COLUMN     "stopPrice" INTEGER NOT NULL,
ADD COLUMN     "timeInForce" "TimeInForceType" NOT NULL,
ADD COLUMN     "trailingAmount" INTEGER NOT NULL,
ADD COLUMN     "type" "OrderType" NOT NULL,
DROP COLUMN "side",
ADD COLUMN     "side" "SideType" NOT NULL,
ALTER COLUMN "size" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orderBook_orderID_key" ON "orderBook"("orderID");

-- CreateIndex
CREATE UNIQUE INDEX "orderBook_modulusCustomerEmail_key" ON "orderBook"("modulusCustomerEmail");

-- AddForeignKey
ALTER TABLE "orderBook" ADD CONSTRAINT "orderBook_modulusCustomerEmail_fkey" FOREIGN KEY ("modulusCustomerEmail") REFERENCES "user"("modulusCustomerEmail") ON DELETE RESTRICT ON UPDATE CASCADE;
