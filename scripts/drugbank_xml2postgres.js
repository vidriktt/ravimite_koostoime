import { createReadStream } from 'fs';
import sax from 'sax';
import pkg from 'pg';
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

const xmlStream = createReadStream('../data/drugbank_filtered.xml', {
	encoding: 'utf8',
});
const saxStream = sax.createStream(true);

let parsingStarted = false;
let currentDrug = null;
let currentInteraction = null;
const tagStack = [];

saxStream.on('opentag', (node) => {
	if (node.name === 'drug' && !parsingStarted) {
		parsingStarted = true;
	}

	tagStack.push(node.name);

	if (parsingStarted && node.name === 'drug') {
		currentDrug = {
			drugbankId: '',
			name: '',
			description: '',
			atcCodes: [],
			drugInteractions: [],
			foodInteractions: [],
		};
	}

	if (parsingStarted && node.name === 'drug-interaction') {
		currentInteraction = {
			drugbankId: '',
			name: '',
			description: '',
		};
	}
});

saxStream.on('closetag', async (tagName) => {
	tagStack.pop();

	if (tagName === 'drug' && currentDrug) {
		await insertDrug(currentDrug);
		currentDrug = null;
	}

	if (tagName === 'drug-interaction' && currentDrug && currentInteraction) {
		currentDrug.drugInteractions.push(currentInteraction);
		currentInteraction = null;
	}
});

saxStream.on('text', (text) => {
	const currentTag = tagStack[tagStack.length - 1];
	if (parsingStarted && currentDrug && currentTag) {
		switch (currentTag) {
			case 'drugbank-id':
				if (currentInteraction) {
					currentInteraction.drugbankId = text.trim();
				} else {
					currentDrug.drugbankId = text.trim();
					// console.log('Processing drug:', currentDrug.drugbankId);
				}
				break;
			case 'name':
				if (currentInteraction) {
					currentInteraction.name = text.trim();
				} else {
					currentDrug.name = text.trim();
				}
				break;
			case 'description':
				if (currentInteraction) {
					currentInteraction.description = text.trim();
				} else {
					currentDrug.description = text.trim();
				}
				break;
			case 'atc-code':
				currentDrug.atcCodes.push(text.trim());
				break;
			case 'food-interaction':
				currentDrug.foodInteractions.push(text.trim());
				break;
		}
	}
});

saxStream.on('error', (err) => {
	console.error('Error parsing XML:', err);
});

xmlStream.pipe(saxStream);

async function insertDrug(drug) {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');

		const insertDrugQuery = `
            INSERT INTO drugbank_drugs (drugbank_id, name, description, atc_codes)
            VALUES ($1, $2, $3, $4)
                RETURNING id;
		`;
		const atcCodesValue = drug.atcCodes.length
			? `{${drug.atcCodes.filter((code) => code).join(',')}}`
			: null;
		const drugValues = [
			drug.drugbankId,
			drug.name,
			drug.description,
			atcCodesValue,
		];
		const { rows } = await client.query(insertDrugQuery, drugValues);
		const drugId = rows[0].id;

		for (const interaction of drug.drugInteractions) {
			const insertInteractionQuery = `
                INSERT INTO drugbank_drug_interactions (drug_id, drugbank_id, name, description)
                VALUES ($1, $2, $3, $4);
			`;
			const interactionValues = [
				drugId,
				interaction.drugbankId,
				interaction.name,
				interaction.description,
			];
			await client.query(insertInteractionQuery, interactionValues);
		}

		for (const foodInteraction of drug.foodInteractions) {
			const insertFoodInteractionQuery = `
                INSERT INTO drugbank_food_interactions (drug_id, interaction)
                VALUES ($1, $2);
			`;
			const foodInteractionValues = [drugId, foodInteraction];
			await client.query(
				insertFoodInteractionQuery,
				foodInteractionValues,
			);
		}

		await client.query('COMMIT');
		console.log('Data inserted successfully for drug:', drug.drugbankId);
	} catch (err) {
		console.error('Error inserting data for drug:', drug.drugbankId, err);
		await client.query('ROLLBACK');
	} finally {
		client.release();
	}
}
