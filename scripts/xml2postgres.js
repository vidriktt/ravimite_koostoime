import { createReadStream, readFile } from 'fs';
import { parseString } from 'xml2js';
import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // eslint-disable-line

const prisma = new PrismaClient();

const toimeained = {};

createReadStream('../data/atc.csv', { encoding: 'latin1' })
	.pipe(csv({ separator: ';' }))
	.on('data', (row) => {
		toimeained[row['ATC kood']] = row.Nimi;
	})
	.on('end', () => {
		console.log('CSV file successfully processed.'); // eslint-disable-line no-console
	});

readFile('../data/drug_interactions.xml', 'utf8', (err, data) => {
	if (err) {
		console.error(err); // eslint-disable-line no-console
		return;
	}

	parseString(data, async (err, result) => {
		if (err) {
			console.error(err); // eslint-disable-line no-console
			return;
		}

		try {
			const chunkSize = 10;
			const interactions = result.DrugInteractions.Interaction;

			for (let i = 0; i < interactions.length; i += chunkSize) {
				const chunk = interactions.slice(i, i + chunkSize);

				await Promise.all(
					chunk.map(async (interaction) => {
						const drugGroups = interaction.DrugGroup.map(
							(group, index) => ({
								drug_group: index + 1,
								atc: group.Drug.map((drug) =>
									drug.Atc && drug.Atc[0]
										? drug.Atc[0].$.V
										: null,
								),
								drugs: group.Drug.map((drug) => ({
									drug_name: drug.DrugName[0],
									atc:
										drug.Atc && drug.Atc[0]
											? drug.Atc[0].$.V
											: null,
								})),
							}),
						);

						const insertedInteraction =
							await prisma.interactions.create({
								data: {
									severity: interaction.Severity[0].$.DN,
									severity_value: interaction.Severity[0].$.V,
									situation_criterion:
										interaction.SituationCriterion
											? interaction.SituationCriterion[0]
											: null,
									clinical_consequence:
										interaction.ClinicalConsequence[0],
									instructions: interaction.Instructions
										? interaction.Instructions[0]
										: null,
									interaction_drug_groups: {
										create: drugGroups.map((group) => ({
											drug_group: group.drug_group,
											atc: group.atc.join(','),
										})),
									},
								},
								include: {
									interaction_drug_groups: true,
								},
							});

						await prisma.drugs.createMany({
							data: drugGroups.flatMap((group) =>
								group.drugs.map((drug) => ({
									interaction_id: insertedInteraction.id,
									drug_group_id:
										insertedInteraction.interaction_drug_groups.find(
											(interactionGroup) =>
												interactionGroup.drug_group ===
												group.drug_group,
										).id,
									drug_name: drug.drug_name,
									atc: drug.atc,
									toimeaine: toimeained[drug.atc],
								})),
							),
						});

						// eslint-disable-next-line no-console
						console.log(
							`Inserted interaction with ID: ${insertedInteraction.id}`,
						);
					}),
				);
			}

			console.log('Data inserted successfully.'); // eslint-disable-line no-console
		} catch (error) {
			console.error('Transaction failed:', error); // eslint-disable-line no-console
		} finally {
			await prisma.$disconnect();
		}
	});
});
