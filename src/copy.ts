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
        imageUrl,
        gameId,
        discordUserId,
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
            imageUrl: 'https://imgur.com/Jmf0SBd.jpg',
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
            description: `You're starting off Game #${gameId}! You have ${timeString} to \`/submit\` an initiating sentence for the next player to draw. It should be drawable, but not ***too*** literal.`,
        };
        case "playPicture": return {
            title: "draw for me",
            description: `You have ${timeString} to \`/submit\` a picture of this sentence: **${sentence}** Some tips: 

            * ***Avoid words***, letters, and numbers!

            * If you're taking a picture of your art on paper, ***light it well*** (no shadows!).

            * You can make your pictures however you like! Sculpting, collage, painting, 3D renders, and animations  are encouraged.

            * Whether photo or generated on a computer, please crop to just the picture."`,
        };
        case "playSentence": return {
            title: "write for me",
            description: `You have ${timeString} to \`/submit\` a sentence of the attached picture. Some tips:

            * Be descriptive -- as disturbing or ribald as you like! 

            * ***Decode a narrative!*** Is that a man sitting in a box, or Chuck the faceless yogi meditating in his cell? 
            
            * Interpretive beats literal. Include something undrawable!`,
            imageUrl: imageUrl,
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
            return imageUrl ? {
                description: `<@${discordUserId}> drew:`,
                imageUrl: imageUrl,
            } : { description: `<@${discordUserId}> wrote "${sentence}"` };
        case "timeoutGameEnd": return {
                description: `Thanks for playing!`,
        };
        default:
            throw new Error(`Unknown messageCode: ${messageCode}`);
    }
}