/*
  Warnings:

  - You are about to drop the `Operation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OperationToRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OperationToRole" DROP CONSTRAINT "_OperationToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_OperationToRole" DROP CONSTRAINT "_OperationToRole_B_fkey";

-- DropTable
DROP TABLE "Operation";

-- DropTable
DROP TABLE "_OperationToRole";
