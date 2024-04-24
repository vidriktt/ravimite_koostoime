import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import axios from 'axios';
// @ts-ignore
import PDFParser from 'pdf-parse';

interface Row {
	'ATC kood': string;
	'Toimeaine nimetus': string;
	PIL: string;
}

async function fetchAndExtractText(path: string): Promise<string> {
	try {
		const response = await axios.get(
			`https://ravimiregister.ee/Data/PIL/${path}`,
			{
				responseType: 'arraybuffer',
			},
		);

		const data = response.data;
		const pdfData = await PDFParser(data);

		return extractTextBetweenHeadings(pdfData.text);
	} catch (error) {
		console.error('Error fetching PDF:', error); // eslint-disable-line no-console
		throw new Error('Failed to fetch and extract text from PDF');
	}
}

function extractTextBetweenHeadings(pdfText: string): string {
	const startHeading = '\nMuud ravimid';
	const endHeadings = [
		'koos toidu ja joogiga',
		'koos toidu, joogi ja alkoholiga',
		'koos joogi ja alkoholiga',
		'\nRasedus',
	];

	const startIndex = pdfText.indexOf(startHeading);
	let endIndex = -1;

	for (const endHeading of endHeadings) {
		const index = pdfText.indexOf(endHeading);
		if (index !== -1) {
			endIndex = index;
			break;
		}
	}

	if (startIndex !== -1 && endIndex !== -1) {
		let extractedText = pdfText
			.substring(
				pdfText.indexOf('\n', startIndex + startHeading.length) + 1,
				pdfText.lastIndexOf('\n', endIndex),
			)
			.trim();

		extractedText = extractedText.replace(/\n?\n?\s*\b\d+\b/g, '');

		return extractedText;
	} else {
		throw new Error('Headings not found');
	}
}

export default eventHandler(
	async (event): Promise<{ url: string; text: string } | undefined> => {
		const { atcCode, drugName } = getQuery(event);

		try {
			const ravimid = path.resolve('./data/pakendid.csv');

			const matchingRow = await new Promise<Row | undefined>(
				(resolve, reject) => {
					fs.createReadStream(ravimid, { encoding: 'utf-8' })
						.pipe(csv({ separator: ';' }))
						.on('data', (row: Row) => {
							const rowIncludes: boolean =
								(atcCode &&
									row['ATC kood'].toLowerCase() ===
										(atcCode as string).toLowerCase()) ||
								(!atcCode &&
									row['Toimeaine nimetus'].toLowerCase() ===
										(drugName as string).toLowerCase());

							if (
								rowIncludes &&
								row.PIL &&
								row.PIL.trim().startsWith('PIL_')
							) {
								resolve(row);
							}
						})
						.on('end', () => resolve(undefined))
						.on('error', (err) => reject(err));
				},
			);

			if (!matchingRow) {
				throw new Error(
					'No matching row with valid "pakendi infoleht" found',
				);
			}

			const text = await fetchAndExtractText(matchingRow.PIL);
			return {
				url: `https://ravimiregister.ee/Data/PIL/${matchingRow.PIL}`,
				text,
			};
		} catch (error) {
			console.error('Error processing data:', error); // eslint-disable-line no-console
			throw new Error('Failed to process data');
		}
	},
);
