/*
  Warnings:

  - You are about to drop the column `crearatedAt` on the `CV` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CV" DROP COLUMN "crearatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
