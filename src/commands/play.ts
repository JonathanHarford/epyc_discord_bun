import { findPendingGame, createOrFindPlayer, findAvailableGame, createNewGame, createNewTurn} from "../db";
import { config } from "../config";
import { Interaction, Message, MessageCode } from '../types';

export const data = {
  name: "play",
  description: "Initiate a turn in a game of Eat Poop You Cat.",
}

export const execute = async (interaction: Interaction): Promise<Message> => {
  const player = await createOrFindPlayer(interaction.userId);
  // Check if the player has a pending turn
  if (await findPendingGame(player)) {
    return { messageCode: 'playButPending', }
  }
  let game = await findAvailableGame(player) || await createNewGame(interaction.serverId!, interaction.channelId!);
  const gameId = game.id;
  const previousTurn = game.turns[game.turns.length - 1];
  game = await createNewTurn(game, player, previousTurn ? !previousTurn.sentenceTurn : true);
  const pendingTurn = game.turns[game.turns.length - 1];
  const now = Date.now();
  if (!previousTurn) {
    console.log(`Created game ${gameId} and initiating turn ${pendingTurn.id}...`);
    return {
      messageCode: 'playSentenceInitiating',
      gameId,
      timeRemaining: pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT * 1000 - now,
    }
  } else if (pendingTurn.sentenceTurn) {
    console.log(`Found an available game ${gameId} and created a sentence turn ${pendingTurn.id}...`);
    return {
      messageCode: 'playSentence',
      gameId,
      timeRemaining: pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT * 1000 - now,
      pictureUrl: previousTurn.media!.url,
    }

  } else if (previousTurn.sentence) {
    console.log(`Found an available game ${gameId} and created a picture turn ${pendingTurn.id}...`);
    return {
      messageCode: 'playPicture',
      gameId,
      timeRemaining: pendingTurn.createdAt.getTime() + config.PICTURE_TIMEOUT * 1000 - now,
      sentence: previousTurn.sentence,
    }
  } else {
    throw new Error("ERROR! There is no sentence or media attached to the preceding turn.");
  }

}
