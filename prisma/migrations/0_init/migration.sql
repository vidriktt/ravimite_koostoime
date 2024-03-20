-- CreateTable
CREATE TABLE "drugs" (
    "id" SERIAL NOT NULL,
    "interaction_id" INTEGER,
    "drug_name" VARCHAR(255),
    "atc" VARCHAR(255),

    CONSTRAINT "drugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" SERIAL NOT NULL,
    "severity_value" INTEGER,
    "severity" VARCHAR(255),
    "situation_criterion" TEXT,
    "clinical_consequence" TEXT,
    "instructions" TEXT,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "drugs" ADD CONSTRAINT "drugs_interaction_id_fkey" FOREIGN KEY ("interaction_id") REFERENCES "interactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

