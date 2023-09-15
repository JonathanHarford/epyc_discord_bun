import { CommandInteraction, SlashCommandBuilder, MessagePayload, MessageTarget } from "discord.js";
import { createOrFindPlayer, findPendingTurn, getPreviousTurn, finishTurn } from "../models";

export const data = new SlashCommandBuilder()
    .setName("submit")
    .setDescription("Initiate a turn in a game of Eat Poop You Cat.")
    .addStringOption(option => option.setName("sentence").setDescription("The sentence you want to submit."))
    .addAttachmentOption(option => option.setName("picture").setDescription("The picture you want to submit."));

export async function execute(interaction: CommandInteraction) {
    const user = interaction.user;
    const player = await createOrFindPlayer(user.id);

    // Check if the player has a pending turn
    let pendingTurn = await findPendingTurn(player);

    // If they don't, dissuade them
    if (!pendingTurn) {
        return interaction.reply(`I'm not waiting on a turn from you!`);
    }
    const game = pendingTurn.game;
    // If the pending turn is a sentence and they sent a picture, correct them
    if (pendingTurn.sentenceTurn)  {
        if (interaction.options.get("picture")) {
            return interaction.reply(`You're supposed to submit a sentence!`);
        }
        const sentence = interaction.options.get("sentence")?.value as string;
        if (!sentence) {
            return interaction.reply(`You're supposed to submit a sentence!`);
        }
        // Update the turn
        await finishTurn(pendingTurn, sentence);
    }

    if (!pendingTurn.sentenceTurn) {
  
        // If the pending turn is a picture and they sent a sentence, correct them
        if (!pendingTurn.sentenceTurn && interaction.options.get("sentence")) {
            return interaction.reply(`You're supposed to submit a picture!`);
        }
        const picture = interaction.options.get("picture")?.value as string;
        if (!picture) {
            return interaction.reply(`You're supposed to submit a picture!`);
        }
        // Update the turn
        await finishTurn(pendingTurn, picture);
    }
    return interaction.reply(`Thanks, I'll let you know when Game #${pendingTurn.game.id} is complete.`);
}