import { PrismaClient, Game as pcGame, Turn as pcTurn, Player as pcPlayer, Media as pcMedia} from '@prisma/client'
import { MediaInput } from './types';

const prisma = new PrismaClient()

export type TurnWithGame = pcTurn & { game: Game, media?: Media };
export type Game = pcGame;
export type Player = pcPlayer;
export type Media = pcMedia;

export const createOrFindPlayer = async (discordUserId: string): Promise<Player> => {
    return prisma.player.upsert({
        where: { discordUserId: discordUserId },
        update: {},
        create: { discordUserId: discordUserId },
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

export const createNewTurn = async (game: Game, player: Player, sentenceTurn: boolean): Promise<TurnWithGame> => {
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
            sentenceTurn,
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

export const finishSentenceTurn = async (turnId: number, sentence: string): Promise<TurnWithGame> => {
    return prisma.turn.update({
        where: {
            id: turnId,
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

export const finishPictureTurn = async (turnId: number, contentInput: MediaInput): Promise<TurnWithGame> => {
    const media = await prisma.media.create({
        data: {
            Turn: {
                connect: {
                    id: turnId,
                },
            },
            url: contentInput.url,
            contentType: contentInput.contentType,
            content: contentInput.content,
        },
    });
    return prisma.turn.update({
        where: {
            id: turnId,
        },
        data: {
            done: true
        },
        include: {
            game: true,
            media: true,
        },
    }) as Promise<TurnWithGame>;
}

export const getStats = async (player: Player): Promise<{ inProgress: number, yoursDone: number, yoursInProgress: number }> => {
    const inProgress = await prisma.game.count({
        where: {
            done: false,
        },
    });
    const yoursDone = await prisma.game.count({
        where: {
            done: true,
            turns: {
                every: { done: true },
                some: { player: player },
            },
        },
    });
    const yoursInProgress = await prisma.game.count({
        where: {
            done: false,
            turns: {
                some: { player: player },
            },
        },
    });
    return { inProgress, yoursDone, yoursInProgress };
}