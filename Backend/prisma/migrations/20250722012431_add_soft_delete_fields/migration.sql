/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_deletedBy_fkey`;

-- DropIndex
DROP INDEX `User_deletedBy_fkey` ON `user`;

-- AlterTable
ALTER TABLE `article` DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedBy`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedBy`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `division` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `createdAt`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedBy`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedBy`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `createdAt`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedBy`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
