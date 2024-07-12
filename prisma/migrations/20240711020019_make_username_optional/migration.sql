/*
  Warnings:

  - You are about to drop the column `modulusEmail` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[modulusCustomerEmail]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modulusCustomerEmail` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_modulusEmail_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "modulusEmail",
ADD COLUMN     "modulusCustomerEmail" TEXT NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_modulusCustomerEmail_key" ON "user"("modulusCustomerEmail");
