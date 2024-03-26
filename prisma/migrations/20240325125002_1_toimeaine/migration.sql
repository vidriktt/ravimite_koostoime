-- AlterTable
ALTER TABLE "drugs" ADD COLUMN     "toimeaine" VARCHAR;

-- CreateTable
CREATE TABLE "drugbank_drug_interactions" (
    "id" SERIAL NOT NULL,
    "drug_id" INTEGER NOT NULL,
    "drugbank_id" VARCHAR(255),
    "name" VARCHAR(255),
    "description" TEXT,

    CONSTRAINT "drugbank_drug_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drugbank_drugs" (
    "id" SERIAL NOT NULL,
    "drugbank_id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "atc_codes" TEXT[],

    CONSTRAINT "drugbank_drugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drugbank_food_interactions" (
    "id" SERIAL NOT NULL,
    "drug_id" INTEGER NOT NULL,
    "interaction" TEXT,

    CONSTRAINT "drugbank_food_interactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "drugbank_drug_interactions" ADD CONSTRAINT "drugbank_drug_interactions_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "drugbank_drugs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "drugbank_food_interactions" ADD CONSTRAINT "drugbank_food_interactions_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "drugbank_drugs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
