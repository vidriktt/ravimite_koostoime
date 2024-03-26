import { PrismaClient } from '@prisma/client';

interface InteractionId {
	id: number;
}

const prisma = new PrismaClient();

export default eventHandler(async (event) => {
	const queryDrugs = getQuery(event).drugs as Array<string>;

	const interactionIds: InteractionId[] = (await prisma.$queryRaw<number[]>`
    SELECT DISTINCT interaction.id
    FROM interactions interaction
    JOIN drugs drug1 ON interaction.id = drug1.interaction_id
    JOIN drugs drug2 ON drug1.interaction_id = drug2.interaction_id
    WHERE drug1.toimeaine = ${queryDrugs[0]} AND drug2.toimeaine = ${queryDrugs[1]}
`) as unknown as InteractionId[];

	if (!interactionIds || interactionIds.length === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Interactions not found',
		});
	}

	const interactionIdsArray = interactionIds.map(
		(interactionId) => interactionId.id,
	);

	const interactions = await prisma.interactions.findMany({
		where: {
			id: {
				in: interactionIdsArray,
			},
		},
		include: {
			drugs: true,
		},
	});

	if (!interactions || interactions.length === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Interactions not found',
		});
	}

	return interactions;
});
