-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "descriptionCs" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "descriptionUk" TEXT;
