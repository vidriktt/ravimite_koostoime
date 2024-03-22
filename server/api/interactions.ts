import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default eventHandler(async (event) => {
	const queryDrugs = getQuery(event).drugs as Array<string>;

	const drugs = await prisma.drugs.findMany({
		select: {
			interaction_id: true,
		},
		where: {
			drug_name: {
				equals: queryDrugs[0],
				mode: 'insensitive',
			},
		},
	});

	if (!drugs) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Drug not found',
		});
	}

	const interactionIds = drugs.map((drug) => drug.interaction_id);

	let interactions = await prisma.interactions.findMany({
		where: {
			id: {
				in: interactionIds as Array<number>,
			},
		},
		include: {
			drugs: true,
		},
	});

	if (!interactions) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Interactions not found',
		});
	}

	interactions = interactions.filter((interaction) => {
		return interaction.drugs.some(
			(drug) => drug.drug_name === queryDrugs[1],
		);
	});

	return interactions;
});
