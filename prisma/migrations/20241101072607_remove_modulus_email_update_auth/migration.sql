/*
  Warnings:

  - You are about to drop the column `modulusCustomerEmail` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "modulusCustomerEmail",
ADD COLUMN     "userEmail" TEXT;
