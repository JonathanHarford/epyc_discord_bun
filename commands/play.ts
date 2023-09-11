import { CommandInteraction, SlashCommandBuilder, MessagePayload, MessageTarget } from "discord.js";
import { createOrFindPlayer, findAvailableGame, createNewGame, createNewTurn, findPendingTurn, getPreviousTurn } from "../models";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Initiate a turn in a game of Eat Poop You Can.");

export async function execute(interaction: CommandInteraction) {
  const user = interaction.user;

  const player = await createOrFindPlayer(user.id);

  const pendingTurn = await findPendingTurn(player);
  if (pendingTurn) {
    const previousTurn = await getPreviousTurn(pendingTurn.game); // Why does the linter think game might not be defined?
    if (!previousTurn) {
      return interaction.reply(`You still need to provide an initiating sentence.`);
    } else if (previousTurn.sentenceTurn) {
      return interaction.reply(`You still need to provide a sentence.`);
    } else {
      return interaction.reply(`You still need to provide a picture.`);
    }
  }
  let game = await findAvailableGame(player) || await createNewGame();

  // Create a turn for the player
  console.log("Creating a new turn")
  const newTurn = await createNewTurn(game, player);
  return interaction.reply(`Created a new turn ${newTurn.id}.`);

}