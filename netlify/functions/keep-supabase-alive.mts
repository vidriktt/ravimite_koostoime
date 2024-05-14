import { Handler, Context } from "@netlify/functions";
import axios from 'axios';

const handler: Handler = async (req: Request, context: Context) => {
	try {
		const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/`, {
			headers: {
				apikey: process.env.SUPABASE_KEY
			}
		});
		
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Supabase is alive!' }),
		};
	} catch (error) {
		console.error('Error keeping Supabase alive:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Error keeping Supabase alive' }),
		};
	}
};

export { handler };
