import { readFile } from 'fs';
import { parseString } from 'xml2js';
import pkg from 'pg';

const { Pool } = pkg; // eslint-disable-line

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
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

		const interactions = result.DrugInteractions.Interaction.map(
			(interaction) => {
				const drugs = interaction.DrugGroup.map((drugGroup) => ({
					drug_name: drugGroup.Drug.map((drug) => drug.DrugName[0]),
					atc: drugGroup.Drug.map((drug) =>
						drug.Atc
							? drug.Atc[0]
								? drug.Atc[0].$.V
								: null
							: null,
					),
				}));

				return {
					severity: interaction.Severity[0].$.DN,
					severity_value: interaction.Severity[0].$.V,
					situation_criterion: interaction.SituationCriterion
						? interaction.SituationCriterion[0]
						: null,
					clinical_consequence: interaction.ClinicalConsequence[0],
					instructions: interaction.Instructions
						? interaction.Instructions[0]
						: null,
					drugs,
				};
			},
		);

		try {
			const client = await pool.connect();
			await client.query('BEGIN');

			for (const interaction of interactions) {
				const insertInteractionQuery = `
                    INSERT INTO interactions (severity, severity_value, situation_criterion, clinical_consequence,
                                              instructions)
                    VALUES ($1, $2, $3, $4, $5) RETURNING id;
				`;
				const interactionValues = [
					interaction.severity,
					interaction.severity_value,
					interaction.situation_criterion,
					interaction.clinical_consequence,
					interaction.instructions,
				];

				const { rows } = await client.query(
					insertInteractionQuery,
					interactionValues,
				);
				const interactionId = rows[0].id;

				for (const drugGroup of interaction.drugs) {
					for (let i = 0; i < drugGroup.drug_name.length; i++) {
						const insertDrugQuery = `
                            INSERT INTO drugs (interaction_id, drug_name, atc)
                            VALUES ($1, $2, $3);
						`;
						const drugValues = [
							interactionId,
							drugGroup.drug_name[i],
							drugGroup.atc[i],
						];
						await client.query(insertDrugQuery, drugValues);
					}
				}
			}

			await client.query('COMMIT');
			console.log('Data inserted successfully.'); // eslint-disable-line no-console
			client.release();
		} catch (err) {
			console.error('Error inserting data:', err); // eslint-disable-line no-console
			await client.query('ROLLBACK');
		} finally {
			pool.end();
		}
	});
});
