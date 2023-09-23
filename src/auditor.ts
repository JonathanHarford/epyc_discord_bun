import * as db from "./db";
import { Message, MessageCode } from "./types";
import { config } from "./config";

export const audit = async (): Promise<Message[]> => {
    const now = Date.now();
    
    // If a pending turn has timed out, delete it from its game
    // and notify its player
    const timedoutTurns = await db.fetchTimedoutPendingTurns({
        pictureTimeout: config.PICTURE_TIMEOUT * 60 * 1000,
        sentenceTimeout: config.SENTENCE_TIMEOUT * 60 * 1000,
        now,
    });
    const timeoutTurnMessages = timedoutTurns.map(turn => {
        db.deleteTurn(turn);
        return {
            messageCode: 'timeoutTurn' as MessageCode,
            gameId: turn.gameId,
            playerId: turn.playerId,
        }
    });

    const timedoutGames = await db.fetchTimedoutPendingGames(
        config.GAME_TIMEOUT * 60 * 1000,
        now,
    );
    const timeoutGameMessages = timedoutGames.map(game => {
        db.updateGameStatus(game, {done: false});
        return {
            messageCode: 'timeoutGame' as MessageCode,
        }
    });

    return [...timeoutTurnMessages, ...timeoutGameMessages];
}
