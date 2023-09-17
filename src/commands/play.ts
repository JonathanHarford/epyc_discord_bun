import { CommandInteraction, SlashCommandBuilder, MessagePayload, MessageTarget } from "discord.js";
import { createOrFindPlayer, findAvailableGame, createNewGame, createNewTurn, findPendingTurn, getPreviousTurn } from "../db";
import { config } from "../config";
import { countdown } from "../../utils";
import { Media } from '../db';


export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Initiate a turn in a game of Eat Poop You Cat.");

export async function execute(interaction: CommandInteraction) {
  const user = interaction.user;
  const player = await createOrFindPlayer(user.id);
  let game;

  // Check if the player has a pending turn
  let pendingTurn = await findPendingTurn(player);
  if (pendingTurn) {

    console.log("Found a pending turn...");
    game = pendingTurn.game;
    const previousTurn = await getPreviousTurn(pendingTurn.game);
    if (!previousTurn) {
      console.log("...it's an initiating sentence.");
      const timeRemaining = pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT  * 60 * 1000 - Date.now();
      return interaction.reply(`You still have ${countdown(timeRemaining)} to \`/submit\` an initiating sentence.`);
    } else if (previousTurn.sentenceTurn) {
      console.log("...it's a sentence.");
      const timeRemaining = pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT  * 60 * 1000 - Date.now();
      return interaction.reply(`You still have ${countdown(timeRemaining)} to \`/submit\` a sentence or two that describes this: ${previousTurn.picture}.}`);
    } else {
      console.log("...it's a picture.");
      const timeRemaining = pendingTurn.createdAt.getTime() + config.PICTURE_TIMEOUT  * 60 * 1000 - Date.now();
      return interaction.reply(`You still have ${countdown(timeRemaining)} to \`/submit\` a picture that illustrates, "${previousTurn.sentence}".`);
    }
  }

  // Otherwise, check if there is an available game
  game = await findAvailableGame(player);
  if (game) {
    pendingTurn = await createNewTurn(game, player);
    console.log("Found an available game and created a turn...");
    const previousTurn = await getPreviousTurn(game);

    if (!previousTurn) {
      console.log("...it's an initiating sentence.");
      const timeRemaining = pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT  * 60 * 1000 - Date.now();
      return interaction.reply(`ERROR!!! You have ${countdown(timeRemaining)} to \`/submit\` an initiating sentence.`);
    } else if (previousTurn.sentenceTurn) {
      console.log("...it's a sentence.");
      const timeRemaining = pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT  * 60 * 1000 - Date.now();
      return interaction.reply(`You have ${countdown(timeRemaining)} to \`/submit\` a sentence or two that describes this: ${previousTurn.picture}.}`);
    } else {
      console.log("...it's a picture.");
      const timeRemaining = pendingTurn.createdAt.getTime() + config.PICTURE_TIMEOUT  * 60 * 1000 - Date.now();
      return interaction.reply(`You have ${countdown(timeRemaining)} to \`/submit\` a picture that illustrates, "${previousTurn.sentence}".`);
    }
  }

  // Otherwise, create a new game
  game = await createNewGame(interaction.guildId!, interaction.channelId!);
  pendingTurn = await createNewTurn(game, player);
  const timeRemaining = pendingTurn.createdAt.getTime() + config.SENTENCE_TIMEOUT  * 60 * 1000 - Date.now();
  console.log("Created a new game and turn.");
  return interaction.reply(`You are starting Game #${game.id}. You have ${countdown(timeRemaining)} to \`/submit\` an initiating sentence.`);
}