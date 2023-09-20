import { expect, test } from "bun:test";
import { commands } from "../src/commands";
import { Game, Player } from '../src/db'
import { Message } from "../src/channels/discordChannel";


const channelId = "channel";
const serverId = "server";
const aliceDiscordId = "alice";
const bobDiscordId = "bob";
const carolDiscordId = "carol";
const dmitriDiscordId = "dmitri";
let alice, bob, carol, dmitri: Player;
let game1, game2, game3: Game;





// const executeSubmitPicture = async (options:
//     {
//         discordUserId: string,
//         picture: string,
//         reply?: (message: string | Message) => void,
//     }) => {
//     const { discordUserId, picture, reply } = options;
//     return executeCommand({
//         commandName: "submit",
//         user: { id: discordUserId },
//         picture: picture,
//         reply: reply || ((message) => {
//             expect(message).toStartWith(`Thanks, I'll let you know when Game`);
//         })
//     })
// };



const executeHelp = async (userId: string) => {
    const message = await commands.help.execute({ userId, channelId });
    expect(message.title).toEqual("How to play Eat Poop You Cat");
    expect(message.description).toStartWith("Eat Poop You Cat is a");
    expect(message.imageUrl).toEqual("https://i.imgur.com/ipoiOMF.jpeg");
    return message;
}

const executeStatus = async (options:
    {
        discordUserId: string,
        inProgress: number,
        yoursDone: number,
        yoursInProgress: number,
        timeString?: string,
    }) => {
    const { discordUserId, inProgress, yoursDone, yoursInProgress, timeString } = options;
    const message = await commands.status.execute({ userId: discordUserId, channelId });
    const { title, description, imageUrl } = message;
    // TODO: expectations!
    return message;
}

const executeSubmitSentence = async (options:
    {
        discordUserId: string,
        sentence: string,
        reply?: (message: Message) => void,
    }) => {
    let { discordUserId, sentence, reply } = options;
    const message = await commands.submit.execute({ userId: discordUserId, channelId, sentence });
    reply ||= ((message) => {
        expect(message.description).toStartWith(`Thanks, I'll let you know when Game`);
    })
    reply(message);
    return message;
}

const executePlay = async (options:
    {
        discordUserId: string,
        timeString: string,
        reply?: (message: Message) => void,
    }) => {
    let { discordUserId, timeString, reply } = options;
    reply ||= ((message) => {
        expect(message.description).toEndWith(`You have ${timeString} to \`/submit\` an initiating sentence.`);
    })
    const message = await commands.play.execute({
        userId: discordUserId,
        serverId,
        channelId
    });
    reply(message);
    return message;
};


test("A full game", async () => {
    await executeHelp(aliceDiscordId);

    await executeStatus({
        discordUserId: aliceDiscordId,
        inProgress: 0,
        yoursDone: 0,
        yoursInProgress: 0,
        timeString: "00:09:59"
    });

    await executeSubmitSentence({
        discordUserId: aliceDiscordId,
        sentence: "Alice's sentence",
        reply: (message) => {
            expect(message.description).toEqual("I'm not waiting on a turn from you!");
        }
    });

    await executePlay({
        discordUserId: aliceDiscordId, 
        timeString: "00:09:59"}
    );

    // await executeStatus({
    //     discordUserId: aliceDiscordId,
    //     inProgress: 1,
    //     yoursDone: 0,
    //     yoursInProgress: 1,
    //     timeString: "00:09:59"
    // });

    await executeSubmitSentence({
        discordUserId: aliceDiscordId,
        sentence: "Alice's sentence",
    });
});
