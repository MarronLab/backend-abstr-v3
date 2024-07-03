/*
  Warnings:

  - A unique constraint covering the columns `[modulusCustomerID]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modulusCustomerID` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "modulusCustomerID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "userActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "success" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_modulusCustomerID_key" ON "user"("modulusCustomerID");

-- AddForeignKey
ALTER TABLE "userActivity" ADD CONSTRAINT "userActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
