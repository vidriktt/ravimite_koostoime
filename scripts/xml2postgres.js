import { createReadStream, readFile } from 'fs';
import { parseString } from 'xml2js';
import pkg from 'pg';
import csv from 'csv-parser';
import dotenv from 'dotenv';

const { Pool } = pkg; // eslint-disable-line
dotenv.config({ path: '../.env' }); // eslint-disable-line

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

const toimeained = {};

createReadStream('../data/atc.csv', { encoding: 'latin1' })
	.pipe(csv({ separator: ';' }))
	.on('data', (row) => {
		toimeained[row['ATC kood']] = row.Nimi;
	})
	.on('end', () => {
		console.log('CSV file successfully processed.'); // eslint-disable-line no-console
	});

readFile('../data/drug_interactions.xml', 'utf8', async (err, data) => {
	if (err) {
		console.error(err); // eslint-disable-line no-console
		return;
	}

	parseString(data, async (err, result) => {
		if (err) {
			console.error(err); // eslint-disable-line no-console
			return;
		}

		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			const interactions = result.DrugInteractions.Interaction.map(
				(interaction) => {
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

					return {
						severity: interaction.Severity[0].$.DN,
						severity_value: interaction.Severity[0].$.V,
						situation_criterion: interaction.SituationCriterion
							? interaction.SituationCriterion[0]
							: null,
						clinical_consequence:
							interaction.ClinicalConsequence[0],
						instructions: interaction.Instructions
							? interaction.Instructions[0]
							: null,
						drugGroups,
					};
				},
			);

			for (const interaction of interactions) {
				const insertInteractionQuery = `
                    INSERT INTO interactions (severity, severity_value, situation_criterion, clinical_consequence, instructions)
                    VALUES ($1, $2, $3, $4, $5) RETURNING id;
                `;
				const interactionValues = [
					interaction.severity,
					interaction.severity_value,
					interaction.situation_criterion,
					interaction.clinical_consequence,
					interaction.instructions,
				];

				const { rows: interactionRows } = await client.query(
					insertInteractionQuery,
					interactionValues,
				);
				const interactionId = interactionRows[0].id;

				for (const drugGroup of interaction.drugGroups) {
					const insertDrugGroupQuery = `
                        INSERT INTO interaction_drug_groups (interaction_id, drug_group, atc)
                        VALUES ($1, $2, $3) RETURNING id;
                    `;
					const drugGroupValues = [
						interactionId,
						drugGroup.drug_group,
						drugGroup.atc,
					];
					const { rows: drugGroupRows } = await client.query(
						insertDrugGroupQuery,
						drugGroupValues,
					);
					const drugGroupId = drugGroupRows[0].id;

					for (const drug of drugGroup.drugs) {
						const insertDrugQuery = `
                            INSERT INTO drugs (interaction_id, drug_group_id, drug_name, atc, toimeaine)
                            VALUES ($1, $2, $3, $4, $5);
                        `;
						const drugValues = [
							interactionId,
							drugGroupId,
							drug.drug_name,
							drug.atc,
							toimeained[drug.atc],
						];
						await client.query(insertDrugQuery, drugValues);
					}
				}
			}

			await client.query('COMMIT');
			console.log('Data inserted successfully.'); // eslint-disable-line no-console
		} catch (err) {
			console.error('Error inserting data:', err); // eslint-disable-line no-console
			await client.query('ROLLBACK');
		} finally {
			client.release();
			await pool.end();
		}
	});
});
