import * as db from "./db";
import { TurnWithGame, Game } from "./types";
import { config } from "./config";

export const auditTurns = async (): Promise<TurnWithGame[]> => {
    const now = Date.now();
    return await db.fetchTimedoutPendingTurns({
        pictureCutoff: now - config.PICTURE_TIMEOUT * 1000,
        sentenceCutoff: now - config.SENTENCE_TIMEOUT * 1000,
    });
}

export const auditGames = async (): Promise<Game[]> => {
    const now = Date.now();
    return await db.fetchTimedoutPendingGames(
        now - config.GAME_TIMEOUT * 1000,
    );
}
