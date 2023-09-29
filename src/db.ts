import { PrismaClient } from '@prisma/client';
import { Turn } from '@prisma/client';
import {
    DiscordUserId,
    Player,
    PlayerId,
    
    TurnWithGame,
    Game,
    MediaInput
} from './types';

const prisma = new PrismaClient()

export const createOrFindPlayer = async (discordUserId: DiscordUserId): Promise<Player> => {
    return prisma.player.upsert({
        where: { discordUserId: discordUserId },
        update: {},
        create: { discordUserId: discordUserId },
    });
}

export const fetchPlayer = async (playerId: PlayerId): Promise<Player | null> => {
    return prisma.player.findUnique({
        where: { id: playerId },
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
            player: true,
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
            player: true,
        },
    });
}

export const finishPictureTurn = async (turnId: number, contentInput: MediaInput): Promise<TurnWithGame> => {
    const media = await prisma.media.create({
        data: {
            turn: {
                connect: {
                    id: turnId,
                },
            },
            url: contentInput.url,
            contentType: contentInput.contentType,
            content: contentInput.content,
        },
    });

    // Update the turn to be "done" and include the media item
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

export const fetchTimedoutPendingTurns = async (config: {
    pictureCutoff: number,
    sentenceCutoff: number,
}): Promise<TurnWithGame[]> => {
    const { pictureCutoff, sentenceCutoff } = config;
    console.log(`Fetching picture turns that haven't been updated since ${new Date(pictureCutoff)} and sentence turns since ${new Date(sentenceCutoff)}`)
    return prisma.turn.findMany({
        where: {
            done: false,
            OR: [{   
                sentenceTurn: false,
                updatedAt: {
                    lt: new Date(pictureCutoff),
                },
            },
            {
                sentenceTurn: true,
                updatedAt: {
                    lt: new Date(sentenceCutoff),
                },
            }]
        },
        include: {
            game: true,
        },
    });
}

export const fetchTimedoutPendingGames = async (gameCutoff: number): Promise<Game[]> => {
    return prisma.game.findMany({
        where: {
            done: false,
            updatedAt: {
                lt: new Date(gameCutoff),
            },
        },
        include: {
            turns: true,
        }
    });
}

export const deleteTurn = async (turn: TurnWithGame): Promise<Turn> => {
    return await prisma.turn.delete({
        where: {
            id: turn.id,
        },
    });
}

export const updateGameStatus = async (game: Game, status: { done: boolean }): Promise<void> => {
    await prisma.game.update({
        where: {
            id: game.id,
        },
        data: status,
    });
}