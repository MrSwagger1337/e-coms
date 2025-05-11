/*
  Warnings:

  - Added the required column `titleAr` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionAr` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameAr` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "titleAr" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "descriptionAr" TEXT NOT NULL,
ADD COLUMN     "nameAr" TEXT NOT NULL;
