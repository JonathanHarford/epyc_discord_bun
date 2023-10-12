import { Message, MessageRender } from "./types";

export const countdown = (msec: number): string => {
    // format 3 days, 2 hours, 34 minutes, 48 seconds as: 3d 2h 34m 48s
    let seconds = Math.floor(msec / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(' ');
}

export const render = (message: Message): MessageRender => {

    const {
        messageCode,
        inProgress,
        yoursDone,
        yoursInProgress,
        timeRemaining,
        sentence,
        pictureUrl,
        gameId,
        discordUsername,
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
            description: `You have ${timeString} to \`/submit\` a picture of this sentence: "${sentence}"`,
        };
        case "playSentence": return {
            title: "write for me",
            description: `You have ${timeString} to \`/submit\` a sentence of this picture:`,
            imageUrl: pictureUrl,
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
            playerId,
            title: "timeout",
            description: `Your turn in Game #${gameId} timed out!`,
        };
        case "timeoutGameIntro": return {
            title: "game done",
            description: `Game #${gameId} is done!`,
        };
        case "timeoutGameTurn":
            return pictureUrl ? {
                description: `${discordUsername} drew:`,
                imageUrl: pictureUrl,
            } : { description: `${discordUsername} wrote "${sentence}"` };
        case "timeoutGameEnd": return {
                description: `Thanks for playing!`,
        };
        default:
            throw new Error(`Unknown messageCode: ${messageCode}`);
    }
}