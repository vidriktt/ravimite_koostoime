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

	const uniqueInteractions = new Map();

	for (const interactionId of interactionIds) {
		const interaction = await prisma.interactions.findUnique({
			where: {
				id: interactionId.id,
			},
			include: {
				drugs: {
					where: {
						toimeaine: {
							in: queryDrugs,
						},
					},
				},
			},
		});

		if (interaction) {
			const interactionKey = JSON.stringify({
				severity: interaction.severity,
				severity_value: interaction.severity_value,
				situation_criterion: interaction.situation_criterion,
				clinical_consequence: interaction.clinical_consequence,
				instructions: interaction.instructions,
			});

			if (!uniqueInteractions.has(interactionKey)) {
				uniqueInteractions.set(interactionKey, interaction);
			}
		}
	}

	const interactions = Array.from(uniqueInteractions.values());

	if (!interactions || interactions.length === 0) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Interactions not found',
		});
	}

	return interactions;
});
