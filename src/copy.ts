import { Message, MessageRender } from "./types";

export const countdown = (msec: number): string => {
    // format 2 hours, 34 minutes, 48 seconds as: 02:34:48
    return new Date(msec).toISOString().substr(11, 8);
}

export const render = (message: Message): MessageRender => {

    const {
        messageCode,
        inProgress,
        yoursDone,
        yoursInProgress,
        timeRemaining,
        previousSentence,
        previousPictureUrl,
        gameId,
        playerId,
    } = message;
    const timeString = timeRemaining && countdown(timeRemaining);
    switch (messageCode) {
        case "help": return {
            title: 'how to play',
            description:
                "Eat Poop You Cat is a game where players take turns writing sentences " +
                "and drawing pictures. The first player writes a sentence, the second player " +
                "draws a picture of that sentence, the third player writes a sentence of that " +
                "picture, and so on. At the end of the game, it gets posted to #epyc where players " +
                "can admire the art, the writing, and how the concept mutated. Type `/play` to play.",
            imageUrl: 'https://i.imgur.com/ipoiOMF.jpeg',
        };
        case "status": return {
            title: "current status",
            description: `Games in progress: ${inProgress}. Yours: ${yoursDone} done, ${yoursInProgress} in progress.`,
        };
        case "playButPending": return {
            title: "submit to me",
            description: "You already have a pending turn! Type `/submit` to submit it.",
        };
        case "playSentenceInitiating": return {
            title: "write for me",
            description: `You're starting off Game #${gameId}! You have ${timeString} to write a sentence.`,
        };
        case "playPicture": return {
            title: "draw for me",
            description: `You have ${timeString} to draw a picture of this sentence: "${previousSentence}"`,
        };
        case "playSentence": return {
            title: "write for me",
            description: `You have ${timeString} to write a sentence of this picture:`,
            imageUrl: previousPictureUrl,
        };
        case "submitButNo": return {
            title: "try `/play`",
            description: "You don't have a pending turn! Type `/play` to start one.",
        };
        case "submitPicture": return {
            title: "its beautiful",
            description: `You submitted a picture! I'll message you when Game #${gameId} is done.`,
        };
        case "submitSentence": return {
            title: "very clever",
            description: `You submitted a sentence! I'll message you when Game #${gameId} is done.`,
        };
        case "submitPictureButSentence": return {
            title: "submit to me",
            description: "You submitted a picture, but your turn is to write a sentence!",
        };
        case "submitPictureButEmpty": return {
            title: "submit to me",
            description: "You submitted a picture, but it was empty!",
        };
        case "submitSentenceButPicture": return {
            title: "submit to me",
            description: "You submitted a sentence, but your turn is to draw a picture!",
        };
        case "submitSentenceButEmpty": return {
            title: "submit to me",
            description: "You submitted a sentence, but it was empty!",
        };
        case "timeoutTurn": return {
            playerId: playerId,
            title: "timeout",
            description: `Your turn in Game #${gameId} timed out!`,
        };
        case "timeoutGame": return {
            title: "timeout",
            description: `Game #${gameId} timed out! It's done!`,
        };
        default:
            throw new Error(`Unknown messageCode: ${messageCode}`);
    }
}