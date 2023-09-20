import { CommandInteraction } from "discord.js";
import { createOrFindPlayer, findAvailableGame, createNewGame, createNewTurn, findPendingTurn, getPreviousTurn } from "../db";
import { config } from "../config";
import { countdown } from "../../utils";
import { Media } from '../db';
import { Interaction, Message, MessageRender, ChatService } from '../types';


export const data = {
  name: "play",
  description: "Initiate a turn in a game of Eat Poop You Cat.",
}

export const execute = async (interaction: Interaction): Promise<MessageRender> => {
  let title = "Eat Poop You Cat!", description, imageUrl;
  const player = await createOrFindPlayer(interaction.userId);

  // Check if the player has a pending turn
  let pendingTurn = await findPendingTurn(player);
  const game = pendingTurn?.game || await findAvailableGame(player) || await createNewGame(interaction.serverId!, interaction.channelId!);

  pendingTurn = pendingTurn || await createNewTurn(game, player);

  console.log("Found an available game and created a turn...");
  const previousTurn = await getPreviousTurn(game);

  if (!previousTurn) {
    console.log("...it's an initiating sentence.");
    const timeRemaining = pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT * 60 * 1000 - Date.now();
    description = `You have ${countdown(timeRemaining)} to \`/submit\` an initiating sentence.`;
  } else if (pendingTurn.sentenceTurn) {
    console.log("...it's a sentence.");
    const timeRemaining = pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT * 60 * 1000 - Date.now();
    description = `You have ${countdown(timeRemaining)} to \`/submit\` a sentence or two that describes this:`;
    if (!previousTurn.media) {
      throw new Error("ERROR! There is no media attached to this turn.");
    }
    imageUrl = previousTurn.media.url;
  } else {
    console.log("...it's a picture.");
    const timeRemaining = pendingTurn.createdAt.getTime() + config.PICTURE_TIMEOUT * 60 * 1000 - Date.now();
    description = `You have ${countdown(timeRemaining)} to \`/submit\` a picture that illustrates, "${previousTurn.sentence}".`;
  }
  return { title, description, imageUrl }
}
