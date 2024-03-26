/*
  Warnings:

  - You are about to alter the column `toimeaine` on the `drugs` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "drugs" ADD COLUMN     "drug_group_id" INTEGER,
ALTER COLUMN "atc" SET DATA TYPE TEXT,
ALTER COLUMN "toimeaine" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "interactions" ALTER COLUMN "severity_value" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "interaction_drug_groups" (
    "id" SERIAL NOT NULL,
    "interaction_id" INTEGER,
    "drug_group" INTEGER,
    "atc" TEXT,

    CONSTRAINT "interaction_drug_groups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "drugs" ADD CONSTRAINT "drugs_drug_group_id_fkey" FOREIGN KEY ("drug_group_id") REFERENCES "interaction_drug_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interaction_drug_groups" ADD CONSTRAINT "interaction_drug_groups_interaction_id_fkey" FOREIGN KEY ("interaction_id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
