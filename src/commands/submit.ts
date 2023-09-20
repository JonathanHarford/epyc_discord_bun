import { createOrFindPlayer, findPendingTurn, getPreviousTurn, finishSentenceTurn, finishMediaTurn } from "../db";
import { Interaction, Message, MessageRender, ChatService } from '../types';

export const data = {
    name: "submit",
    description: "Initiate a turn in a game of Eat Poop You Cat.",
    stringOption: {
        name: "sentence",
        description: "The sentence you want to submit."
    },
    attachmentOption: {
        name: "picture",
        description: "The picture you want to submit."
    }
}

export const execute = async (interaction: Interaction): Promise<MessageRender> => {
    const { userId, sentence, picture } = interaction;
    const player = await createOrFindPlayer(userId);
    // Check if the player has a pending turn
    let pendingTurn = await findPendingTurn(player);

    // If they don't, dissuade them
    if (!pendingTurn) {
        console.log("No pending turn found...");
        return { description: `I'm not waiting on a turn from you!` };
    }

    if (pendingTurn.sentenceTurn) {
        console.log("Found a pending sentence turn...");

        // If the pending turn is a sentence and they sent a picture, correct them
        if (picture) {
            console.log("...but they sent a picture!");
            return { description: `You're supposed to submit a sentence!` };
        }
        // If the sentence is empty, correct them
        if (!sentence) {
            console.log("...but they sent an empty sentence!");
            return { description: `You're supposed to submit a sentence!` };
        }
        // Update the turn
        await finishSentenceTurn(pendingTurn.id, sentence);
    }

    if (!pendingTurn.sentenceTurn) {
        console.log("Found a pending picture turn...");

        // If the pending turn is a picture and they sent a sentence, correct them
        if (sentence) {
            console.log("...but they sent a sentence!");
            return { description: `You're supposed to submit a picture!` };
        }
        if (!picture) {
            console.log("...but they didn't send a picture!");
            return { description: `You're supposed to submit a picture!` };
        }
        // Update the turn
        await finishMediaTurn(pendingTurn.id, picture);
    }

    return { description: `Thanks, I'll let you know when Game #${pendingTurn.game.id} is complete.` };
}