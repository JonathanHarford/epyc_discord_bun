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
    console.log(`Turn ${turn.id} has expired...`)
    await db.deleteTurn(turn); // And delete them
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