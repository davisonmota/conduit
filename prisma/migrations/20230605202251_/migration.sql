/*
  Warnings:

  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
