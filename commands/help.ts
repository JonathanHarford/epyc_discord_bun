import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("How to play Eat Poop You Cat.");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("The first player writes a sentence, the second player draws a picture of that sentence, the third player writes a sentence of that picture, and so on. At the end of the game, it gets posted to #epyc where players can admire the art, the writing, and how the concept mutated. Type `/play` or `/status`.");
}
