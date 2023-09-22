import { expect, test } from "bun:test";
import { commands } from "../src/commands";
import { Game, Player } from '../src/db'
import { Interaction, Message, MessageRender, ChatService } from '../src/types';
import { MediaInput } from "../src/types";


const channelId = "channel";
const serverId = "server";
const aliceDiscordId = "alice";
const bobDiscordId = "bob";
const carolDiscordId = "carol";
const dmitriDiscordId = "dmitri";
let game1, game2, game3: Game;


test("A full game", async () => {
    // await executeHelp(aliceDiscordId);

    // await executeStatus({
    //     discordUserId: aliceDiscordId,
    //     inProgress: 0,
    //     yoursDone: 0,
    //     yoursInProgress: 0
    // });

    // await executeSubmitSentence({
    //     discordUserId: aliceDiscordId,
    //     sentence: "Alice's sentence",
    //     reply: (message) => {
    //         expect(message.description).toEqual("I'm not waiting on a turn from you!");
    //     }
    // });

    // await executePlay({
    //     discordUserId: aliceDiscordId, 
    //     timeString: "00:09:59"}
    // );

    // await executeStatus({
    //     discordUserId: aliceDiscordId,
    //     inProgress: 1,
    //     yoursDone: 0,
    //     yoursInProgress: 1,
    //     timeString: "00:09:59",
    // });

    // await executeSubmitSentence({
    //     discordUserId: aliceDiscordId,
    //     sentence: "Alice's sentence",
    // });
});
