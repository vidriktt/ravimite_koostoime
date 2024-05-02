import { createClient } from '@supabase/supabase-js';
import csv from 'csv-parser';
import axios from 'axios';
// @ts-ignore
import PDFParser from 'pdf-parse';

interface Row {
	'ATC kood': string;
	'Toimeaine nimetus': string;
	PIL: string;
}

const supabase = createClient(
	process.env.SUPABASE_URL as string,
	process.env.SUPABASE_KEY as string,
);

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

async function processDrug(
	atcCode: string,
	drugName: string,
): Promise<{ url: string; text: string } | undefined> {
	try {
		const { data: pakendidUrl } = supabase.storage
			.from('pakendid')
			.getPublicUrl('pakendid.csv');

		const response = await axios.get(pakendidUrl.publicUrl, {
			responseType: 'stream',
		});

		const matchingRow = await new Promise<Row | undefined>(
			(resolve, reject) => {
				response.data
					.pipe(csv({ separator: ';' }))
					.on('data', (row: Row) => {
						const rowIncludes: boolean =
							(atcCode &&
								row['ATC kood'].toLowerCase() ===
									(atcCode as string).toLowerCase()) ||
							(!atcCode &&
								row['Toimeaine nimetus'].toLowerCase() ===
									(drugName as string).toLowerCase());

						if (rowIncludes && row.PIL) {
							resolve(row);
						}
					})
					.on('end', () => resolve(undefined))
					.on('error', (err: Error) => reject(err));
			},
		);

		if (!matchingRow) {
			// eslint-disable-next-line no-console
			console.error(
				'No matching row with valid "pakendi infoleht" found for:',
				{ atcCode, drugName },
			);
			return undefined;
		}

		if (matchingRow.PIL.trim().startsWith('PIL_')) {
			return {
				url: `https://ravimiregister.ee/Data/PIL/${matchingRow.PIL}`,
				text: await fetchAndExtractText(matchingRow.PIL),
			};
		} else {
			return {
				url: matchingRow.PIL,
				text: '',
			};
		}
	} catch (error) {
		console.error('Error processing data:', error); // eslint-disable-line no-console
		return undefined;
	}
}

export default eventHandler(
	async (event): Promise<{ url: string; text: string } | undefined> => {
		const {
			atcCodes,
			drugNames,
		}: { atcCodes: string[]; drugNames: string[] } = getQuery(event);

		for (let i = 0; i < atcCodes?.length; i++) {
			const result = await processDrug(atcCodes[i], drugNames[i]);

			if (result) {
				if (result.text) {
					return result;
				}

				if (i === atcCodes.length - 1) {
					return result;
				}
			}
		}

		return undefined;
	},
);
