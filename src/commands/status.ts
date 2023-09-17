import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("status")
  .setDescription("Server and personal stats.");

const exampleEmbed = new EmbedBuilder()
	// .setColor(0x0099FF)
	.setTitle('Eat Poop You Cat!')
	// .setURL('https://discord.js.org/')
	// .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription("Status Decription TK TODO")
	// .setThumbnail('https://i.imgur.com/AfFp7pu.png')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	// .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });


export async function execute(interaction: CommandInteraction) {
  // return interaction.reply("The first player writes a sentence, the second player draws a picture of that sentence, the third player writes a sentence of that picture, and so on. At the end of the game, it gets posted to #epyc where players can admire the art, the writing, and how the concept mutated. Type `/play` or `/status`.");
  return interaction.reply({ 
    embeds: [exampleEmbed],
    ephemeral: true, 
  });
}
