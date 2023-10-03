import { createOrFindPlayer, findPendingGame, finishSentenceTurn, finishPictureTurn } from "../db";
import { Interaction, Message } from '../types';

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
    let game = await findPendingGame(player);
    const pendingTurn = game?.turns[game.turns.length - 1];

    // If they don't, dissuade them
    if (!pendingTurn) return { messageCode: 'submitButNo' };

    if (pendingTurn.sentenceTurn) {
        console.log(`Pending turn ${pendingTurn.id} is a sentence...`)

        // If the pending turn is a sentence and they sent a picture, correct them
        if (picture) return { messageCode: "submitSentenceButPicture" };

        // If the sentence is empty, correct them
        else if (!sentence) return { messageCode: "submitSentenceButEmpty" };

        // Update the turn
        else {
            console.log("Submitting sentence...")
            await finishSentenceTurn(pendingTurn.id, sentence);
            return {
                messageCode: "submitSentence",
                gameId: game!.id,
            }
        }

    }

    else if (!pendingTurn.sentenceTurn) {
        console.log(`Pending turn ${pendingTurn.id} is a picture...`)
        // If the pending turn is a picture and they sent a sentence, correct them
        if (sentence) return { messageCode: "submitPictureButSentence" };

        else if (!picture || !picture.url || !picture.contentType) {
            return { messageCode: "submitPictureButEmpty" };
        } else {
            // Update the turn
            console.log("Submitting picture...")
            await finishPictureTurn(
                pendingTurn.id,
                {
                    url: picture.url,
                    contentType: picture.contentType,
                    content: await fetch(picture.url)
                        .then(response => response.arrayBuffer())
                        .then(arrayBuffer => Buffer.from(arrayBuffer)),
                });

            return {
                messageCode: "submitPicture",
                gameId: game!.id,
            }
        }
    }
    else throw new Error("ERROR! There is no sentence or media attached to this turn.");


}