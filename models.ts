import { PrismaClient, Game, Turn, Player } from '@prisma/client'

const prisma = new PrismaClient()

export const createOrFindPlayer = async (discordId: string): Promise<Player> => {
    return prisma.player.upsert({
        where: { discordId: discordId },
        update: {},
        create: { discordId: discordId },
    });
}

export const findPendingTurn = async (player: Player): Promise<Turn & { game: Game } | null> => {
    return prisma.turn.findFirst({
        where: {
            done: false,
            player: player,
        },
        include: {
            game: true,
        },
    });
}

export const findAvailableGame = async (player: Player): Promise<Game | null> => {
    return prisma.game.findFirst({
        where: {
            done: false,
            turns: {
                none: {
                    player: player,
                },
            },
        },
    });
}

export const createNewGame = async (): Promise<Game> => {
    return prisma.game.create({ data: {} });
}

export const createNewTurn = async (game: Game, player: Player): Promise<Turn> => {
    return prisma.turn.create({
        data: {
            game: {
                connect: {
                    id: game.id,
                },
            },
            player: {
                connect: {
                    id: player.id,
                },
            },
        },
    });
}

export const getPreviousTurn = async (game: Game): Promise<Turn | null> => {
    return prisma.turn.findFirst({
        where: {
            game: game,
            done: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
