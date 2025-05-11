-- AlterTable
ALTER TABLE "Banner" ALTER COLUMN "titleAr" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "descriptionAr" DROP NOT NULL,
ALTER COLUMN "nameAr" DROP NOT NULL;
