/*
  Warnings:

  - You are about to drop the column `createdAt` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `division` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `article` ADD COLUMN `attachmentUrl` VARCHAR(191) NULL,
    ADD COLUMN `externalLink` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    ADD COLUMN `thumbnailUrl` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `createdAt`,
    DROP COLUMN `createdBy`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `updatedBy`;

-- AlterTable
ALTER TABLE `division` DROP COLUMN `createdAt`,
    DROP COLUMN `createdBy`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `updatedBy`;
