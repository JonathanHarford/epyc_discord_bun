import { CommandInteraction, SlashCommandBuilder, MessagePayload, MessageTarget } from "discord.js";
import { createOrFindPlayer, findPendingTurn, getPreviousTurn, finishSentenceTurn, finishMediaTurn } from "../db";

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
        console.log("No pending turn found...");
        return interaction.reply(`I'm not waiting on a turn from you!`);
    }
    const game = pendingTurn.game;
    if (pendingTurn.sentenceTurn)  {
        console.log("Found a pending sentence turn...");

        // If the pending turn is a sentence and they sent a picture, correct them
        const picture = interaction.options?.get("picture")?.attachment;
        console.log(interaction); 
        if (picture) {
            return interaction.reply(`You're supposed to submit a sentence!`);
        }
        // If the sentence is empty, correct them
        const sentence = interaction.options?.get("sentence")?.value as string;
        if (!sentence) {
            return interaction.reply(`You're supposed to submit a sentence!`);
        }
        // Update the turn
        await finishSentenceTurn(pendingTurn, sentence);
    }

    if (!pendingTurn.sentenceTurn) {
        console.log("Found a pending picture turn...");
        
        // If the pending turn is a picture and they sent a sentence, correct them
        if (interaction.options.get("sentence")) {
            return interaction.reply(`You're supposed to submit a picture!`);
        }
        const attachment = interaction.options?.get("picture")?.attachment;
        if (!attachment) {
            return interaction.reply(`You're supposed to submit a picture!`);
        }
        // Get binary data from attachment.url
        const binaryData = await fetch(attachment.url).then(res => res.arrayBuffer());
        // Update the turn
        await finishMediaTurn(pendingTurn, {
            url: attachment.url,
            contentType: attachment.contentType,
            contentInput: binaryData,
        });
    }
    return interaction.reply(`Thanks, I'll let you know when Game #${pendingTurn.game.id} is complete.`);
}