import { PrismaClient, Game as pcGame, Turn as pcTurn, Player as pcPlayer, Media as pcMedia} from '@prisma/client'

const prisma = new PrismaClient()

export type TurnWithGame = pcTurn & { game: Game, media?: Media };
export type Game = pcGame;
export type Player = pcPlayer;
export type Media = pcMedia;

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

export const finishSentenceTurn = async (turn: TurnWithGame, sentence: string): Promise<TurnWithGame> => {
    return prisma.turn.update({
        where: {
            id: turn.id,
        },
        data: {
            sentence: sentence,
            done: true
        },
        include: {
            game: true,
        },
    });
}

export const finishMediaTurn = async (turn: TurnWithGame, contentInput: Media): Promise<TurnWithGame> => {
    const media = await prisma.media.create({
        data: {
            Turn: {
                connect: {
                    id: turn.id,
                },
            },
            url: contentInput.url,
            contentType: contentInput.contentType,
            content: contentInput.content,
        },
    });
    return prisma.turn.update({
        where: {
            id: turn.id,
        },
        data: {
            media: {
                connect: {
                  id: media.id,
                },
              },
            done: true
        },
        include: {
            game: true,
            media: true,
        },
    }) as Promise<TurnWithGame>;
}
