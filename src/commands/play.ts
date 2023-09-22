import { CommandInteraction } from "discord.js";
import { createOrFindPlayer, findAvailableGame, createNewGame, createNewTurn, findPendingTurn, getPreviousTurn } from "../db";
import { config } from "../config";

import { Media } from '../db';
import { Interaction, Message, MessageRender, ChatService, MessageCode } from '../types';

const command = "play";

export const data = {
  name: "play",
  description: "Initiate a turn in a game of Eat Poop You Cat.",
}

export const execute = async (interaction: Interaction): Promise<Message> => {
  const player = await createOrFindPlayer(interaction.userId);
  let messageCode: MessageCode;
  // Check if the player has a pending turn
  if (await findPendingTurn(player)) {
    return { messageCode: 'playButPending', }
  }
  const game = await findAvailableGame(player) || await createNewGame(interaction.serverId!, interaction.channelId!);
  let pendingTurn = await createNewTurn(game, player);

  console.log("Found an available game and created a turn...");
  const previousTurn = await getPreviousTurn(game);

  if (!previousTurn) {
    return {
      messageCode: 'playSentenceInitiating',
      gameId: game.id,
      timeRemaining: pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT * 60 * 1000 - Date.now(),
    }
  } else if (pendingTurn.sentenceTurn && previousTurn.media) {
    return {
      messageCode: 'playSentence',
      timeRemaining: pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT * 60 * 1000 - Date.now(),
      previousPictureUrl: previousTurn.media.url,
    }

  } else if (previousTurn.sentence) {
    return {
      messageCode: 'playPicture',
      timeRemaining: pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT * 60 * 1000 - Date.now(),
      previousSentence: previousTurn.sentence,
    }
  } else {
    throw new Error("ERROR! There is no sentence or media attached to this turn.");
  }

}
