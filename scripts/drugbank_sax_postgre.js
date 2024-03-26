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
	port: parseInt(process.env.DB_PORT),
});

const stream = createReadStream('../data/drugbank_filtered.xml', {
	encoding: 'utf8',
});

stream.on('error', (err) => {
	console.error('Error reading file:', err);
});

const parser = sax.createStream(true); // strict mode

let currentElement = '';
let currentDrug = null;
const drugs = [];

parser.on('error', (err) => {
	console.error('SAX parsing error:', err);
});

parser.on('opentag', (node) => {
	currentElement = node.name;
	if (currentElement === 'DRUG') {
		currentDrug = {};
	}
});

parser.on('closetag', (tagName) => {
	if (tagName === 'DRUG') {
		drugs.push(currentDrug);
		currentDrug = null;
	}
});

parser.on('text', (text) => {
	if (currentDrug) {
		switch (currentElement) {
			case 'DRUGBANK-ID':
				currentDrug.drugbankId = text;
				break;
			case 'NAME':
				currentDrug.name = text;
				break;
			case 'DESCRIPTION':
				currentDrug.description = text;
				break;
			case 'ATC-CODE':
				if (!currentDrug.atcCodes) {
					currentDrug.atcCodes = [];
				}
				currentDrug.atcCodes.push(text);
				break;
			case 'FOOD-INTERACTION':
				if (!currentDrug.foodInteractions) {
					currentDrug.foodInteractions = [];
				}
				currentDrug.foodInteractions.push(text);
				break;
			case 'DRUG-INTERACTION':
				if (!currentDrug.drugInteractions) {
					currentDrug.drugInteractions = [];
				}
				currentDrug.drugInteractions.push({
					drugbankId: text,
					name: '',
					description: '',
				});
				break;
		}
	}
});

parser.on('end', async () => {
	await processDrugs(drugs);
});

async function processDrugs(drugs) {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		for (const drug of drugs) {
			const insertQuery = `
                INSERT INTO drugbank_drugs_2 (drugbank_id, name, description, atc_codes, food_interactions, drug_interactions)
                VALUES ($1, $2, $3, $4, $5, $6)
			`;
			await client.query(insertQuery, [
				drug.drugbankId,
				drug.name,
				drug.description,
				drug.atcCodes ? drug.atcCodes.join(';') : null,
				drug.foodInteractions ? drug.foodInteractions.join(';') : null,
				drug.drugInteractions
					? JSON.stringify(drug.drugInteractions)
					: null,
			]);
		}

		await client.query('COMMIT');
		console.log('Data inserted successfully.');
	} catch (err) {
		console.error('Error inserting data:', err.message);
		await client.query('ROLLBACK');
	} finally {
		client.release();
		await pool.end();
	}
}

stream.pipe(parser);
