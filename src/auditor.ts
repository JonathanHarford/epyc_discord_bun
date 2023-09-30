import * as db from "./db";
import { TurnWithGame, Game, Message, MessageCode } from "./types";
import { config } from "./config";

export const findTurnsTimedout = async (): Promise<TurnWithGame[]> => {
    const now = Date.now();
    return await db.fetchTimedoutPendingTurns({
        pictureCutoff: now - config.PICTURE_TIMEOUT * 1000,
        sentenceCutoff: now - config.SENTENCE_TIMEOUT * 1000,
    });
}

export const expireTurn = async (turn: TurnWithGame): Promise<Message> => {
    const turns = await db.getOtherTurns(turn);
    const isOnlyTurn = turns.length === 1;
    const turnType = isOnlyTurn ? 'sentenceInitiate' :
        (turn.sentenceTurn ? 'sentence' : 'picture');
    console.log(`Turn ${turn.id} (${turnType}) has expired...`);

    if (isOnlyTurn) {
        console.log(`...and it was the only turn on game ${turn.gameId}, so that gets deleted too.`)
        await db.deleteGame(turn.game);
    } else await db.deleteTurn(turn);
    return {
        messageCode: 'timeoutTurn' as MessageCode,
        gameId: turn.gameId,
        playerId: turn.playerId,
    }
}

export const findGamesTimedout = async (): Promise<Game[]> => {
    const now = Date.now();
    return await db.fetchTimedoutPendingGames(
        now - config.GAME_TIMEOUT * 1000,
    );
}

export const expireGame = async (game: Game): Promise<Message> => {
    console.log(`Game ${game.id} has completed...`);
    db.updateGameStatus(game, { done: true });
    return {
        messageCode: 'timeoutGame' as MessageCode,
        channelId: game.discordChannelId,
    }
}