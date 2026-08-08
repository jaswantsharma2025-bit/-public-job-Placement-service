/*
  Warnings:

  - You are about to drop the column `serviceCategory` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `skillCategory` on the `WorkerProfile` table. All the data in the column will be lost.
  - Added the required column `subCategoryId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('NO_FORMAL_EDUCATION', 'PRIMARY', 'SECONDARY', 'HIGHER_SECONDARY', 'DIPLOMA', 'GRADUATE', 'POST_GRADUATE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "serviceCategory",
ADD COLUMN     "isPaidByCustomer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidByCustomerAt" TIMESTAMP(3),
ADD COLUMN     "subCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkerProfile" DROP COLUMN "skillCategory",
ADD COLUMN     "aboutYourself" TEXT,
ADD COLUMN     "availableTimings" TEXT,
ADD COLUMN     "canRelocate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "education" "EducationLevel",
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "emergencyContactNumber" TEXT,
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "languagesKnown" TEXT[],
ADD COLUMN     "maritalStatus" "MaritalStatus",
ADD COLUMN     "motherName" TEXT,
ADD COLUMN     "preferredWorkingRadius" INTEGER,
ADD COLUMN     "previousCompanies" TEXT,
ADD COLUMN     "profilePhotoUrl" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- DropEnum
DROP TYPE "SkillCategory";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerSkill" (
    "id" TEXT NOT NULL,
    "workerProfileId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkerSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformPaymentInfo" (
    "id" TEXT NOT NULL,
    "upiId" TEXT NOT NULL,
    "upiName" TEXT NOT NULL,
    "qrImageUrl" TEXT,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformPaymentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerWallet" (
    "id" TEXT NOT NULL,
    "workerProfileId" TEXT NOT NULL,
    "pendingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "settledBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lifetimeEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkerWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "bookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "settledBy" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_slug_key" ON "SubCategory"("slug");

-- CreateIndex
CREATE INDEX "SubCategory_categoryId_idx" ON "SubCategory"("categoryId");

-- CreateIndex
CREATE INDEX "WorkerSkill_workerProfileId_idx" ON "WorkerSkill"("workerProfileId");

-- CreateIndex
CREATE INDEX "WorkerSkill_subCategoryId_idx" ON "WorkerSkill"("subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkerSkill_workerProfileId_subCategoryId_key" ON "WorkerSkill"("workerProfileId", "subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkerWallet_workerProfileId_key" ON "WorkerWallet"("workerProfileId");

-- CreateIndex
CREATE INDEX "WalletTransaction_walletId_idx" ON "WalletTransaction"("walletId");

-- CreateIndex
CREATE INDEX "Settlement_walletId_idx" ON "Settlement"("walletId");

-- CreateIndex
CREATE INDEX "Booking_subCategoryId_idx" ON "Booking"("subCategoryId");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerSkill" ADD CONSTRAINT "WorkerSkill_workerProfileId_fkey" FOREIGN KEY ("workerProfileId") REFERENCES "WorkerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerSkill" ADD CONSTRAINT "WorkerSkill_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerWallet" ADD CONSTRAINT "WorkerWallet_workerProfileId_fkey" FOREIGN KEY ("workerProfileId") REFERENCES "WorkerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "WorkerWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "WorkerWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
