import { expect, test } from "bun:test";
import { commands as c } from "../src/commands";
import { Game, Player } from '../src/db'
import { Interaction, Message, MessageRender, MediaInput, ChatService } from '../src/types';
import { config } from "../src/config"

const channelId = "channel";
const serverId = "server";
const alice = 'alice';
const bob = 2;
const carol = 3;
const dmitri = 4;
let game1, game2, game3: Game;

const doHelp = async (interaction: any): Promise<Message> => {
    return c.help.execute({
        ...interaction,
        serverId,
        channelId
    });
}
const doStatus = async (interaction: any): Promise<Message> => {
    return c.status.execute({
        ...interaction,
        serverId,
        channelId
    });
}
const doPlay = async (interaction: any): Promise<Message> => {
    return c.play.execute({
        ...interaction,
        serverId,
        channelId
    });
}
const doSubmit = async (interaction: any): Promise<Message> => {
    return c.submit.execute({
        ...interaction,
        serverId,
        channelId
    });
}

test("A full game", async () => {
    let m: Message;
    expect(await doHelp({})).toEqual({ messageCode: 'help'} );
    expect(await doStatus({ userId: alice })).toEqual({ messageCode: 'status', inProgress: 0, yoursDone: 0, yoursInProgress: 0 });
    expect(await doSubmit({ userId: alice })).toEqual({ messageCode: 'submitButNo' });
    m = await doPlay({ userId: alice })
    expect(m.messageCode).toEqual('playSentenceInitiating');
    expect(m.gameId).toBeDefined();
    expect(m.timeRemaining).toBeGreaterThan(0);

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
