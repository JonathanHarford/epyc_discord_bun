import { expect, test } from "bun:test";
import { commands as c } from "../src/commands";
import { Game, Player } from '../src/db'
import { Interaction, Message, MessageRender, MediaInput, ChatService } from '../src/types';
import { config } from "../src/config"

const channelId = "channel";
const serverId = "server";
const alice = 'alice';
const bob = 'bob';
const carol = 'carol';
const dmitri = 'dmitri';
let game1, game2, game3: number;

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
    expect(await doHelp({}))
        .toEqual({ messageCode: 'help' });

    expect(await doStatus({ userId: alice }))
        .toEqual({ messageCode: 'status', inProgress: 0, yoursDone: 0, yoursInProgress: 0 });

    expect(await doSubmit({ userId: alice }))
        .toEqual({ messageCode: 'submitButNo' });

    m = await doPlay({ userId: alice })
    expect(m.messageCode).toEqual('playSentenceInitiating');
    game1 = m.gameId;
    expect(m.gameId).toBeDefined();
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doStatus({ userId: alice }))
        .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 1 });

    expect(await doSubmit({ userId: alice, sentence: 'sentence1' }))
        .toEqual({ messageCode: 'submitSentence', gameId: m.gameId });

    expect(await doStatus({ userId: alice }))
        .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 1 });

    expect(await doSubmit({ userId: alice, sentence: 'sentence2' }))
        .toEqual({ messageCode: 'submitButNo' });

    m = await doPlay({ userId: alice })
    expect(m.messageCode).toEqual('playSentenceInitiating');
    game2 = m.gameId;
    expect(game1).not.toEqual(game2);
    expect(m.gameId).toBeDefined();
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doStatus({ userId: alice }))
        .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 2 });

    // TODO (1 hour passes)
    // epyc-bot → Bob: Your turn has timed out. Use `/play` to play.

    expect(await doStatus({ userId: bob }))
        .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 0 });

    m = await doPlay({ userId: bob })
    expect(m.messageCode).toEqual('playPicture');
    expect(m.gameId).toEqual(game1);
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doStatus({ userId: bob }))
        .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 1 });

    // TODO (24 hours pass)
    // epyc-bot → Bob: Your turn has timed out. Use `/play` to play.

    // Bob: /submit picture [Bob uploads and sends a suitable picture]
    // epyc-bot: I'm not waiting on a turn from you!

    // Bob: /play
    // epyc-bot: You have 24 hours to `/submit` a picture that illustrates "The cat sat on the mat."

    expect(await doSubmit({ userId: bob, sentence: 'sentence2' }))
        .toEqual({ messageCode: 'submitPictureButSentence' });

    // Bob: /submit picture [Bob uploads a video]
    // epyc-bot: You have 23:59 to `/submit` a picture (JPG or PNG) that illustrates "The cat sat on the mat."

    // Bob: /submit picture [Bob uploads a picture that is shorter or narrower than 200 pixels]
    // epyc-bot: You have 23:59 to `/submit` a picture (larger than 200x200) that illustrates "The cat sat on the mat."

    expect(await doSubmit({ userId: bob, picture: 'https://i.imgur.com/aj1e4nD_d.jpg' }))
        .toEqual({ messageCode: 'submitPicture', gameId: game1 });

    // Bob: /status
    // epyc-bot: Games in progress: 2. Yours: 0 done, 1 in progress.

    // (a few hours pass)

    // Carol: /status
    // epyc-bot: Games in progress: 2. Yours: 0 done, 0 in progress.

    // Carol: /play
    // epyc-bot: You have 10 minutes to send me a sentence (or two) that describes this picture: [Bob's picture]

    // (10 minutes pass)

    // epyc-bot → Carol: Your turn has timed out. Use `/play` to play.

    // Carol: /submit sentence Tony the Tiger lounges on a persian rug.
    // epyc-bot: I'm not waiting on a turn from you!

    // Carol: /play
    // epyc-bot: You have 10 minutes to `/submit` a sentence or two that describes this: [Bob's picture]

    // Carol: /status
    // epyc-bot: Games in progress: 2. Yours: 0 done, 1 in progress. You have 9 minutes to `/submit` a sentence or two that describes this: [Bob's picture]

    // Carol: /submit picture [Carol uploads a picture]
    // epyc-bot: You have 9 minutes to `/submit` a sentence or two (not a file) that describes this: [Bob's picture]

    // Carol: /submit sentence Tony the Tiger lounges on a persian rug.
    // epyc-bot: Thanks, I'll let you know when Game #1 is complete.

    // Carol: /status
    // epyc-bot: Games in progress: 2. Yours: 0 done, 1 in progress.

    // Carol: /epyc play
    // epyc-bot: You are starting Game #3! You have 10 minutes to `/submit` an initiating sentence.

    // Carol: /submit picture The dog sat on the mat.
    // epyc-bot: Thanks, I'll let you know when Game #2 is complete.

    // Carol: /status
    // epyc-bot: Games in progress: 3. Yours: 0 done, 2 in progress.

    // (a few hours pass)

    // Dmitri: /status
    // epyc-bot: Games in progress: 3. Yours: 0 done, 0 in progress.

    // Dmitri: /play
    // (Dmitri is assigned the most stale game)
    // epyc-bot: You have 24 hours to `/submit` a picture that illustrates "Tony the Tiger lounges on a persian rug."

    // Dmitri: /submit picture [Dmitri uploads and sends a picture]
    // epyc-bot: Thanks, I'll let you know when Game #1 is complete.

    // Dmitri: /status
    // epyc-bot: Games in progress: 3. Yours: 0 done, 1 in progress.

    // (a week passes since a turn has been played in Game #2 but since there is only one turn it continues to wait for someone to play it)

    // (a week passes since a turn has been played in Game #1)

    // epyc-bot → #epyc: Game #1 is finished! Here are the turns:
    // epyc-bot → #epyc: Alice: The cat sat on the mat.
    // epyc-bot → #epyc: Bob: [Bob's picture]
    // epyc-bot → #epyc: Carol: Tony the Tiger lounges on a persian rug.
    // epyc-bot → #epyc: Dmitri: [Dmitri's picture]
    // epyc-bot → #epyc: This game started at 13:31 PT on September 11, 2023 and finished 9 days later at 11:24 PT on September 20, 2023. Thanks for playing! 

});
