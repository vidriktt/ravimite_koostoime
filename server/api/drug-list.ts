import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default eventHandler(async () => {
	const drugs = await prisma.drugs.groupBy({
		by: ['drug_name'],
		// @ts-ignore
		select: {
			drug_name: true,
		},
	});

	if (!drugs) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Drugs not found',
		});
	}

	return drugs.map((drug) => drug.drug_name as string);
});
