import * as db from "./db";
import { Game, Message, MessageCode } from "./types";
import { config } from "./config";

// TODO: move to db?
export const findTurnsTimedout = async (): Promise<Game[]> => {
    const now = Date.now();
    return await db.fetchTimedoutPendingTurns({
        pictureCutoff: now - config.PICTURE_TIMEOUT * 1000,
        sentenceCutoff: now - config.SENTENCE_TIMEOUT * 1000,
    });
}

// TODO: move to db?
export const findGamesTimedout = async (): Promise<Game[]> => {
    const now = Date.now();
    return await db.fetchTimedoutPendingGames(
        now - config.GAME_TIMEOUT * 1000,
    );
}

export const expireTurn = async (game: Game): Promise<Message> => {
    const isOnlyTurn = game.turns.length === 1;
    const turn = game.turns[game.turns.length - 1];
    const turnType = isOnlyTurn ? 'sentenceInitiate' :
        (turn.sentenceTurn ? 'sentence' : 'picture');
    console.log(`Turn ${turn.id} (${turnType}) has expired...`);

    if (isOnlyTurn) {
        console.log(`...and it was the only turn on game ${turn.gameId}, so that gets deleted too.`)
        await db.deleteGame(game);
    } else await db.deleteTurn(game);
    return {
        messageCode: 'timeoutTurn' as MessageCode,
        gameId: turn.gameId,
        playerId: turn.playerId,
    }
}

export const finishGame = async (game: Game): Promise<Message[]> => {
    console.log(`Game ${game.id} has completed...`);
    db.updateGameStatus(game, { done: true });
    const messages = await Promise.all(game.turns.map(async (turn) => {
        const player = await db.fetchPlayer(turn.playerId);
        const content = turn.sentenceTurn ? {sentence: turn.sentence} : {pictureUrl: turn.media!.url};
        return {
            messageCode: 'timeoutGameTurn' as MessageCode,
            gameId: game.id,
            discordUsername: player!.discordUsername,
            ...content,
        } as Message;
    }));
    return [{
        messageCode: 'timeoutGameIntro' as MessageCode,
        gameId: game.id,
        channelId: game.discordChannelId,
    } as Message,
    ...messages,
    {
        messageCode: 'timeoutGameEnd' as MessageCode,
        startedAt: game.createdAt,
        endedAt: game.updatedAt,
    }];
}