import { expect, test, beforeEach, afterAll } from "bun:test";
import { commands as c } from "../src/commands";
import { Message } from '../src/types';
import { expireTurn, expireGame } from '../src/auditor';

const channelId = "channel";
const serverId = "server";
const alice = 'alice';
const bob = 'bob';
const carol = 'carol';
const dmitri = 'dmitri';
const pic1 = { url: 'https://i.imgur.com/aj1e4nD.jpg', contentType: 'image/jpeg' };
const pic2 = { url: 'https://i.imgur.com/gIok1pC.jpeg', contentType: 'image/jpeg' };

let game1, game2, game3: number;
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({})

beforeEach(async () => {
    console.log("Clearing database...");
    await prisma.media.deleteMany();
    await prisma.turn.deleteMany();
    await prisma.game.deleteMany();
})

afterAll(async () => {
    await prisma.$disconnect()
})

const doHelp = async (interaction: any): Promise<Message> => {
    console.log("/help");
    return c.help.execute({
        ...interaction,
        serverId,
        channelId
    });
}
const doStatus = async (interaction: any): Promise<Message> => {
    console.log("/status");
    return c.status.execute({
        ...interaction,
        serverId,
        channelId
    });
}
const doPlay = async (interaction: any): Promise<Message> => {
    console.log("/play");
    return c.play.execute({
        ...interaction,
        serverId,
        channelId
    });
}
const doSubmit = async (interaction: any): Promise<Message> => {
    console.log("/submit", interaction.sentence || interaction.picture?.url);
    return c.submit.execute({
        ...interaction,
        serverId,
        channelId
    });
}

const expireGameTurn = async (gameId: number): Promise<Message> => {
    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { turns: true },
    });
    const turn = game.turns[game.turns.length - 1];
    expect(turn.done).toEqual(false);
    return expireTurn(turn);
}

test("A full game", async () => {
    let m: Message;
    let turn;
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

    expect(await doPlay({ userId: alice }))
        .toEqual({ messageCode: 'playButPending' });
    
    expect(await doStatus({ userId: alice }))
        .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 1 });

    expect(await doSubmit({ userId: alice, sentence: 'g1s1' }))
        .toEqual({ messageCode: 'submitSentence', gameId: m.gameId });

    expect(await doStatus({ userId: alice }))
        .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 1 });

    expect(await doSubmit({ userId: alice, sentence: 'sentence_reject' }))
        .toEqual({ messageCode: 'submitButNo' });

    m = await doPlay({ userId: alice })
    expect(m.messageCode).toEqual('playSentenceInitiating');
    game2 = m.gameId;
    expect(game2).toBeDefined();
    expect(game1).not.toEqual(game2);
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doStatus({ userId: alice }))
        .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 2 });

    // Time passes, and the pending turn in Game 2 expires
    turn = await expireGameTurn(game2!);
    expect(turn).toBeDefined();
    expect(turn.gameId).toEqual(game2);
    expect(turn.playerId).toBeDefined();
    expect(turn.messageCode).toEqual('timeoutTurn');

    expect(await doStatus({ userId: bob }))
        .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 0 });

    m = await doPlay({ userId: bob })
    expect(m.messageCode).toEqual('playPicture');
    expect(m.gameId).toEqual(game1);
    expect(m.previousSentence).toEqual('g1s1');
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doStatus({ userId: bob }))
        .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 1 });

    // Time passes, and Bob's pending turn in Game 1 expires
    turn = await expireGameTurn(game1!);
    expect(turn).toBeDefined();
    expect(turn.gameId).toEqual(game1);
    expect(turn.playerId).toBeDefined();
    expect(turn.messageCode).toEqual('timeoutTurn');
    
    expect(await doSubmit({ userId: bob, picture: pic1 }))
        .toEqual({ messageCode: 'submitButNo' });

    m = await doPlay({ userId: bob })
    expect(m.messageCode).toEqual('playPicture');
    expect(m.gameId).toEqual(game1);
    expect(m.previousSentence).toEqual('g1s1');
    expect(m.timeRemaining).toBeGreaterThan(0);

    // Bob: /submit picture [Bob uploads a video]
    // epyc-bot: You have 23:59 to `/submit` a picture (JPG or PNG) that illustrates "The cat sat on the mat."

    // Bob: /submit picture [Bob uploads a picture that is shorter or narrower than 200 pixels]
    // epyc-bot: You have 23:59 to `/submit` a picture (larger than 200x200) that illustrates "The cat sat on the mat."

    expect(await doSubmit({ userId: bob, picture: pic1 }))
    .toEqual({ 
        messageCode: "submitPicture",
        gameId: game1,
    });

    expect(await doStatus({ userId: bob }))
    .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 1 });

    
    expect(await doStatus({ userId: carol }))
    .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 0 });

    m = await doPlay({ userId: carol })
    expect(m.messageCode).toEqual('playSentence');
    expect(m.gameId).toEqual(game1);
    expect(m.previousPictureUrl).toEqual(pic1.url);
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doSubmit({ userId: carol, picture: pic2 }))
        .toEqual({ messageCode: "submitSentenceButPicture" });

    expect(await doSubmit({ userId: carol, sentence: 'g1s2' }))
        .toEqual({ messageCode: 'submitSentence', gameId: game1 });

    expect(await doStatus({ userId: carol }))
        .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 1 });

    // m = await doPlay({ userId: carol })
    // expect(m.messageCode).toEqual('playSentenceInitiating');
    // expect(m.gameId).not.toEqual(game1);
    // expect(m.gameId).not.toEqual(game2);
    // const game3 = m.gameId;
    // expect(m.timeRemaining).toBeGreaterThan(0);

    // expect(await doSubmit({ userId: carol, sentence: 'g3s1' }))
    // .toEqual({ messageCode: 'submitSentence', gameId: game1 });

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
