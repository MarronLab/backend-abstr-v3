/*
  Warnings:

  - A unique constraint covering the columns `[modulusCustomerID]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modulusCustomerID` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "userActivity" DROP CONSTRAINT "userActivity_userId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "modulusCustomerID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "userActivity" ADD COLUMN     "idAddress" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_modulusCustomerID_key" ON "user"("modulusCustomerID");

-- AddForeignKey
ALTER TABLE "userActivity" ADD CONSTRAINT "userActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
