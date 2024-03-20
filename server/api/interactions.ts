import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default eventHandler((async (event) => {
    const interactions = await prisma.interactions.findMany();

    if (!interactions) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Interactions not found',
        });
    }

    return interactions;
}))
