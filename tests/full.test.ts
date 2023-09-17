import { expect, test } from "bun:test";
import { executeCommand } from "./setup";
import { Game, Player } from '../src/db'

const aliceDiscordId = "alice";
const bobDiscordId = "bob";
const carolDiscordId = "carol";
const dmitriDiscordId = "dmitri";
let alice, bob, carol, dmitri: Player;
let game1, game2, game3: Game;

const executeHelp = async () => {
    return executeCommand({
        commandName: "help",
        // user: { id: user.discordId },
        reply: (message) => {
            // This should never happen?
            if (typeof message === "string") {
                expect(message).toStartWith("Eat Poop You Cat is a");
                return;
            }
            expect(message.embeds.length).toEqual(1);
            const embed = message.embeds[0];
            expect(embed.data.title).toEqual("Eat Poop You Cat!");
            expect(embed.data.description).toStartWith("Eat Poop You Cat is a");
            expect(embed.data.image?.url).toEqual("https://i.imgur.com/AfFp7pu.png");
        }
    });
}

const executeStatus = async (options:
    {
        discordId: string,
        inProgress: number,
        yoursDone: number,
        yoursInProgress: number,
        timeString?: string,
    }) => {
    const { discordId, inProgress, yoursDone, yoursInProgress, timeString } = options;
    return executeCommand({
        commandName: "status",
        user: { id: aliceDiscordId },
        reply: (message) => {
            expect(message).toStartWith("You are starting Game #");
            expect(message).toEndWith(`You have ${timeString} to \`/submit\` an initiating sentence.`);
        }
    });
}

const executeSubmitSentence = async (options:
    {
        discordId: string,
        sentence: string,
        reply?: (message: string | Message) => void,
    }) => {
    const { discordId, sentence, reply } = options;
    return executeCommand({
        commandName: "submit",
        user: { id: discordId },
        sentence: sentence,
        reply: reply || ((message) => {
            expect(message).toStartWith(`Thanks, I'll let you know when Game`);
        })
    })
};

const executeSubmitPicture = async (options:
    {
        discordId: string,
        picture: string,
        reply?: (message: string | Message) => void,
    }) => {
    const { discordId, picture, reply } = options;
    return executeCommand({
        commandName: "submit",
        user: { id: discordId },
        picture: picture,
        reply: reply || ((message) => {
            expect(message).toStartWith(`Thanks, I'll let you know when Game`);
        })
    })
};

const executePlay = async (discordId: string, timeString: string) => {
    return executeCommand({
        commandName: "play",
        user: { id: aliceDiscordId },
        reply: (message) => {
            expect(message).toStartWith("You are starting Game #");
            expect(message).toEndWith(`You have ${timeString} to \`/submit\` an initiating sentence.`);
        }
    });
}

test("A full game", async () => {

    await executeHelp();
    
    // await executeStatus({
    //     discordId: aliceDiscordId,
    //     inProgress: 0,
    //     yoursDone: 0,
    //     yoursInProgress: 0,
    //     timeString: "00:09:59"
    // });
    
    await executeSubmitSentence({
        discordId: aliceDiscordId,
        sentence: "Alice's sentence",
        reply: (message) => {
            expect(message).toEqual("I'm not waiting on a turn from you!");
        }
    });

    await executePlay(aliceDiscordId, "00:09:59");

    // await executeStatus({
    //     discordId: aliceDiscordId,
    //     inProgress: 1,
    //     yoursDone: 0,
    //     yoursInProgress: 1,
    //     timeString: "00:09:59"
    // });

    // await executeSubmitSentence({
    //     discordId: aliceDiscordId,
    //     sentence: "Alice's sentence",
    // });
});
