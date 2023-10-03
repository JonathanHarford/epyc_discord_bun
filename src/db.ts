import { PrismaClient } from '@prisma/client';
import {
    DiscordUserId,
    Player,
    PlayerId,
    // Turn,
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
    return prisma.player.findUnique({ where: { id: playerId }, });
}

export const fetchGame = async (gameId: number): Promise<Game | null> => {
    return prisma.game.findUnique({
        where: { id: gameId },
        include: { turns: { include: { media: true } } },
    }) as Promise<Game>;
}

export const findPendingGame = async (player: Player): Promise<Game | null> => {
    return prisma.game.findFirst({
        where: {
            done: false,
            turns: {
                some: {
                    player: player,
                    done: false,
                },
            },
        },
        include: { turns: { include: { media: true } } },
    }) as Promise<Game>;
}

export const findAvailableGame = async (player: Player): Promise<Game | null> => {
    console.log(`Finding available game for player ${player.id}...`);
    return prisma.game.findFirst({
        where: {
            done: false,
            turns: {
                every: { done: true },
                none: { player: player },
            },
        },
        include: { turns: { include: { media: true } } },
    }) as Promise<Game>;
}

export const createNewGame = async (discordGuildId: string, discordChannelId: string): Promise<Game> => {
    console.log(`Creating new game...`);
    return prisma.game.create({
        data: {
            discordGuildId,
            discordChannelId,
        },
        include: { turns: { include: { media: true } } },
    });
}

export const createNewTurn = async (game: Game, player: Player, sentenceTurn: boolean): Promise<Game> => {
    await prisma.turn.create({
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
    });
    return fetchGame(game.id) as Promise<Game>;
}

export const finishSentenceTurn = async (turnId: number, sentence: string): Promise<Game> => {
    const t = await prisma.turn.update({
        where: {
            id: turnId,
        },
        data: {
            sentence: sentence,
            done: true
        }
    });
    return fetchGame(t.gameId) as Promise<Game>;
}

export const finishPictureTurn = async (turnId: number, contentInput: MediaInput): Promise<Game> => {
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
    const t = await prisma.turn.update({
        where: { id: turnId, },
        data: { done: true }
    });

    return fetchGame(t.gameId) as Promise<Game>;
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
}): Promise<Game[]> => {
    const { pictureCutoff, sentenceCutoff } = config;
    console.log(`Finding pending picture turns that haven't been updated since ${new Date(pictureCutoff)} and pending sentence turns since ${new Date(sentenceCutoff)}`)
return prisma.game.findMany({
        where: {
            done: false,
            turns: {
                some: {
                    done: false,
                    OR: [{
                        sentenceTurn: false,
                        updatedAt: {
                            lt: new Date(pictureCutoff),
                        },
                    }, {
                        sentenceTurn: true,
                        updatedAt: {
                            lt: new Date(sentenceCutoff),
                        },
                    }]
                },
            }
        },
        include: { turns: { include: { media: true } } },
    });

}

export const fetchTimedoutPendingGames = async (gameCutoff: number): Promise<Game[]> => {
    const games = prisma.game.findMany({
        where: {
            done: false,
            updatedAt: {
                lt: new Date(gameCutoff),
            },
        },
        include: { turns: { include: { media: true } } },
    });
    return games;
}

export const deleteTurn = async (game: Game) => {
    console.log(`Deleting turn ${game.turns[game.turns.length - 1].id}...`);
    await prisma.turn.delete({
        where: {
            id: game.turns[game.turns.length - 1].id,
        },
    });
}

export const updateGameStatus = async (game: Game, status: { done: boolean }): Promise<Game> => {
    return prisma.game.update({
        where: {
            id: game.id,
        },
        data: status,
        include: { turns: { include: { media: true } } },
    });
}

export const deleteGame = async (game: Game) => {
    // Find all turns associated with the game (even though there should only be one)
    const turns = await prisma.turn.findMany({
        where: { gameId: game.id, },
        include: { media: true, },
    });

    // Delete all media associated with the turns (even though it should be a sentence turn)
    for (const turn of turns) {
        if (turn.media) {
            await prisma.media.delete({ where: { id: turn.media.id, }, });
        }
    }

    await prisma.turn.deleteMany({ where: { gameId: game.id, }, });
    await prisma.game.delete({ where: { id: game.id, }, });
}