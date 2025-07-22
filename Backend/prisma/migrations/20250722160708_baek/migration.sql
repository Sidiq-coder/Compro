/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `department` DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedBy`,
    DROP COLUMN `description`;

-- AlterTable
ALTER TABLE `division` DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedBy`,
    DROP COLUMN `description`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedBy`;
