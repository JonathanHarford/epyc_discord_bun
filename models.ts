import { PrismaClient, Game, Turn, Player } from '@prisma/client'

const prisma = new PrismaClient()

type TurnWithGame = Turn & { game: Game };

export const createOrFindPlayer = async (discordId: string): Promise<Player> => {
    return prisma.player.upsert({
        where: { discordId: discordId },
        update: {},
        create: { discordId: discordId },
    });
}

export const findPendingTurn = async (player: Player): Promise<TurnWithGame | null> => {
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
                every: { done: true },
                none: { player: player },
            },
        },
    });
}

export const createNewGame = async (discordGuildId: string, discordChannelId: string): Promise<Game> => {
    return prisma.game.create({ data: { discordGuildId, discordChannelId } });
}

export const createNewTurn = async (game: Game, player: Player): Promise<TurnWithGame> => {
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
        include: {
            game: true,
        },
    });
}

export const getPreviousTurn = async (game: Game): Promise<TurnWithGame | null> => {
    return prisma.turn.findFirst({
        where: {
            game: game,
            done: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            game: true,
        },
    });
}

export const finishTurn = async (turn: TurnWithGame, content: string): Promise<TurnWithGame> => {
    let data;
    if (turn.sentenceTurn) {
        data = {
            sentence: content,
            done: true
        };
    } else {
        data = {
            picture: content,
            done: true
        }
    }
    return prisma.turn.update({
        where: {
            id: turn.id,
        },
        data: data,
        include: {
            game: true,
        },
    });
}
