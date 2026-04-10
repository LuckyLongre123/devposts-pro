/*
  Warnings:

  - You are about to drop the column `Email` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `Message` on the `Message` table. All the data in the column will be lost.
  - Added the required column `email` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "Email",
DROP COLUMN "Message",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "thumbnailUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aiTokens" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "lastAiCall" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';

-- CreateIndex
CREATE INDEX "Message_email_idx" ON "Message"("email");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
