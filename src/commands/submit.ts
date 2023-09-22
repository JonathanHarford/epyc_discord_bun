import { createOrFindPlayer, findPendingTurn, getPreviousTurn, finishSentenceTurn, finishMediaTurn } from "../db";
import { Interaction, Message, MessageRender, MessageCode, ChatService } from '../types';

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

export const execute = async (interaction: Interaction): Promise<Message> => {
    const { userId, sentence, picture } = interaction;
    const player = await createOrFindPlayer(userId);
    // Check if the player has a pending turn
    let pendingTurn = await findPendingTurn(player);
    let messageCode: MessageCode;
    // If they don't, dissuade them
    if (!pendingTurn) return { messageCode: 'submitButNo' };
    
    let gameId;
    if (pendingTurn.sentenceTurn) {

        // If the pending turn is a sentence and they sent a picture, correct them
        if (picture) messageCode = "submitSentenceButPicture";

        // If the sentence is empty, correct them
        else if (!sentence) messageCode = "submitSentenceButEmpty";

        // Update the turn
        else {
            gameId = pendingTurn.game.id;
            messageCode = "submitSentence";
            await finishSentenceTurn(pendingTurn.id, sentence);
        }
    }

    else if (!pendingTurn.sentenceTurn) {

        // If the pending turn is a picture and they sent a sentence, correct them
        if (sentence) messageCode = "submitPictureButSentence";

        else if (!picture) messageCode = "submitPictureButEmpty";

        // Update the turn
        else {
            gameId = pendingTurn.game.id;
            messageCode = "submitPicture";
            await finishMediaTurn(pendingTurn.id, picture);
        }
    }
    else throw new Error("ERROR! There is no sentence or media attached to this turn.");

    return {
        messageCode,
        gameId,
    };
}