import axios from 'axios';

const apiKey: string = process.env.GOOGLE_CLOUD_API_KEY || '';
const translationCache: Record<string, string> = {};

const MAX_CACHE_KEY_LENGTH = 50;
const MAX_CACHE_SIZE = 100;

const generateCacheKey = (text: string, source: string, target: string) =>
	`${text
		.replace(/\s/g, '')
		.substring(0, MAX_CACHE_KEY_LENGTH)}-${source}-${target}`;

export default eventHandler(async (event) => {
	const { text, source, target } = getQuery(event);
	const cacheKey = generateCacheKey(
		text as string,
		source as string,
		target as string,
	);

	if (translationCache[cacheKey]) {
		return translationCache[cacheKey];
	}

	try {
		const response = await axios.post<any>(
			`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
			{
				q: text,
				source,
				target,
			},
		);

		const translatedText =
			response.data.data.translations[0].translatedText;

		translationCache[cacheKey] = translatedText;

		if (Object.keys(translationCache).length > MAX_CACHE_SIZE) {
			delete translationCache[Object.keys(translationCache)[0]];
		}

		return translatedText;
	} catch (error) {
		console.error('Translation error:', error); // eslint-disable-line no-console
		throw new Error('Translation error');
	}
});
