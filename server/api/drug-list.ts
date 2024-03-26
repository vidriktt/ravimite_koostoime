import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default eventHandler(async () => {
	const drugs = await prisma.drugs.groupBy({
		by: ['toimeaine'],
		// @ts-ignore
		select: {
			toimeaine: true,
		},
		where: {
			toimeaine: {
				not: null,
			},
		},
	});

	if (!drugs || drugs.length === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Drugs not found',
		});
	}

	return drugs.map((drug) => drug.toimeaine as string);
});
