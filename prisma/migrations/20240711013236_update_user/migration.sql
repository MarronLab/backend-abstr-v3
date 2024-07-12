/*
  Warnings:

  - A unique constraint covering the columns `[modulusEmail]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicID]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modulusEmail` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicID` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "emailAnnouncements" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailNewsletter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailTradeUpdates" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "modulusEmail" TEXT NOT NULL,
ADD COLUMN     "publicID" TEXT NOT NULL,
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_modulusEmail_key" ON "user"("modulusEmail");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_publicID_key" ON "user"("publicID");
