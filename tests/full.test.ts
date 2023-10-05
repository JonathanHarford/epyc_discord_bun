import { expect, test, beforeEach, afterAll } from "bun:test";
import { commands as c } from "../src/commands";
import { Message, Game, Turn } from '../src/types';
import * as auditor from '../src/auditor';
import * as db from '../src/db';

const channelId = "channel";
const serverId = "server";
const alice = 'alice';
const bob = 'bob';
const carol = 'carol';
const dmitri = 'dmitri';
const pic1 = { url: 'https://i.imgur.com/aj1e4nD.jpg', contentType: 'image/jpeg' };
const pic2 = { url: 'https://i.imgur.com/YKgGm9y.jpeg', contentType: 'image/jpeg' };
const pic3 = { url: 'https://i.imgur.com/DzzQWsc.jpeg', contentType: 'image/jpeg' };

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
    interaction.username = interaction.userId;
    return c.help.execute({
        ...interaction,
        serverId,
        channelId
    });
}
const doStatus = async (interaction: any): Promise<Message> => {
    console.log("/status");
    interaction.username = interaction.userId;
    return c.status.execute({
        ...interaction,
        serverId,
        channelId
    });
}
const doPlay = async (interaction: any): Promise<Message> => {
    console.log("/play");
    interaction.username = interaction.userId;
    return c.play.execute({
        ...interaction,
        serverId,
        channelId
    });
}
const doSubmit = async (interaction: any): Promise<Message> => {
    console.log("/submit", interaction.sentence || interaction.picture?.url);
    interaction.username = interaction.userId;
    return c.submit.execute({
        ...interaction,
        serverId,
        channelId
    });
}

const expirePendingTurn = async (gameId: number): Promise<Message> => {
    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { turns: { include: { media: true } } }
    }) as Game;
    return auditor.expireTurn(game);
}

const finishGame = async (gameId: number): Promise<Message[]> => {
    const gameToExpire = await prisma.game.findUnique({
        where: { id: gameId },
        include: { turns: { include: { media: true } } }
    }) as Game;
    return auditor.finishGame(gameToExpire);
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

    // Alice starts turn 1 in game 1
    m = await doPlay({ userId: alice })
    expect(m.messageCode).toEqual('playSentenceInitiating');
    game1 = m.gameId;
    expect(m.gameId).toBeDefined();
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doPlay({ userId: alice }))
        .toEqual({ messageCode: 'playButPending' });
    
    expect(await doStatus({ userId: alice }))
        .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 1 });

    // Alice submits turn 1 in game 1
    expect(await doSubmit({ userId: alice, sentence: 'g1s1' }))
        .toEqual({ messageCode: 'submitSentence', gameId: m.gameId });

    expect(await doStatus({ userId: alice }))
        .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 1 });

    expect(await doSubmit({ userId: alice, sentence: 'sentence_reject' }))
        .toEqual({ messageCode: 'submitButNo' });

    
    // Alice starts turn 1 in game 2
    m = await doPlay({ userId: alice })
    expect(m.messageCode).toEqual('playSentenceInitiating');
    game2 = m.gameId;
    expect(game2).toBeDefined();
    expect(game1).not.toEqual(game2);
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doStatus({ userId: alice }))
        .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 2 });

    // Time passes, and the pending turn in Game 2 expires, deleting game 2
    m = await expirePendingTurn(game2!);
    expect(m).toBeDefined();
    expect(m.gameId).toEqual(game2);
    expect(m.playerId).toBeDefined();
    expect(m.messageCode).toEqual('timeoutTurn');

    expect(await doStatus({ userId: bob }))
        .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 0 });

    // Bob starts turn 2 in game 1
    m = await doPlay({ userId: bob })
    expect(m.messageCode).toEqual('playPicture');
    expect(m.gameId).toEqual(game1);
    expect(m.sentence).toEqual('g1s1');
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doStatus({ userId: bob }))
        .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 1 });

    // Time passes, and Bob's pending turn in Game 1 expires
    m = await expirePendingTurn(game1!);
    expect(m.gameId).toEqual(game1);
    expect(m.playerId).toBeDefined();
    expect(m.messageCode).toEqual('timeoutTurn');

    expect(await doSubmit({ userId: bob, picture: pic1 }))
        .toEqual({ messageCode: 'submitButNo' });

    // Bob starts turn 2 in game 1
    m = await doPlay({ userId: bob })
    expect(m.messageCode).toEqual('playPicture');
    expect(m.gameId).toEqual(game1);
    expect(m.sentence).toEqual('g1s1');
    expect(m.timeRemaining).toBeGreaterThan(0);

    // Bob: /submit picture [Bob uploads a video]
    // epyc-bot: You have 23:59 to `/submit` a picture (JPG or PNG) that illustrates "The cat sat on the mat."

    // Bob: /submit picture [Bob uploads a picture that is shorter or narrower than 200 pixels]
    // epyc-bot: You have 23:59 to `/submit` a picture (larger than 200x200) that illustrates "The cat sat on the mat."

    // Bob submits turn 2 in game 1
    expect(await doSubmit({ userId: bob, picture: pic1 }))
    .toEqual({ 
        messageCode: "submitPicture",
        gameId: game1,
    });

    expect(await doStatus({ userId: bob }))
    .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 1 });

    
    expect(await doStatus({ userId: carol }))
    .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 0 });

    // Carol starts turn 3 in game 1
    m = await doPlay({ userId: carol })
    expect(m.messageCode).toEqual('playSentence');
    expect(m.gameId).toEqual(game1);
    expect(m.pictureUrl).toEqual(pic1.url);
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doSubmit({ userId: carol, picture: pic2 }))
        .toEqual({ messageCode: "submitSentenceButPicture" });

    // Carol submits turn 3 in game 1
    expect(await doSubmit({ userId: carol, sentence: 'g1s2' }))
        .toEqual({ messageCode: 'submitSentence', gameId: game1 });
   
    expect(await doStatus({ userId: carol }))
        .toEqual({ messageCode: 'status', inProgress: 1, yoursDone: 0, yoursInProgress: 1 });

    m = await doPlay({ userId: carol })
    expect(m.messageCode).toEqual('playSentenceInitiating');
    expect(m.gameId).not.toEqual(game1);
    expect(m.gameId).not.toEqual(game2);
    const game3 = m.gameId;
    expect(m.timeRemaining).toBeGreaterThan(0);

    expect(await doSubmit({ userId: carol, sentence: 'g3s1' }))
    .toEqual({ messageCode: 'submitSentence', gameId: game3 });

    expect(await doStatus({ userId: carol }))
        .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 2 });

    expect(await doStatus({ userId: dmitri }))
        .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 0 });

    // Dmitri starts turn 4 in game 1
    m = await doPlay({ userId: dmitri })
    expect(m.messageCode).toEqual('playPicture');
    expect(m.gameId).toEqual(game1);
    expect(m.timeRemaining).toBeGreaterThan(0);
    
    // Dmitri submits turn 4 in game 1
    expect(await doSubmit({ userId: dmitri, picture: pic3 }))
    .toEqual({ gameId: game1, messageCode: "submitPicture" });
    
    expect(await doStatus({ userId: dmitri }))
    .toEqual({ messageCode: 'status', inProgress: 2, yoursDone: 0, yoursInProgress: 1 });

    const gameDoneMessages = await finishGame(game1!);
    expect(gameDoneMessages).toBeDefined();
    const cleanedMessages = gameDoneMessages.map(m => {
        delete m.playerId;
        delete m.timeRemaining;
        delete m.gameId;
        if (m.startedAt) expect(m.startedAt.valueOf()).toBeGreaterThan(0);
        if (m.startedAt && m.endedAt)  expect(m.endedAt!.valueOf()).toBeGreaterThan(m.startedAt!.valueOf());
        delete m.startedAt
        delete m.endedAt
        if (m.pictureUrl === undefined) delete m.pictureUrl;
        if (m.sentence === undefined) delete m.sentence;
        expect(m.channelId).toEqual(channelId);
        delete m.channelId;
        return m;
    });
    expect(cleanedMessages).toEqual([
        { messageCode: 'timeoutGameIntro' },
        { messageCode: 'timeoutGameTurn', discordUsername: 'alice', sentence: 'g1s1'},
        { messageCode: 'timeoutGameTurn', discordUsername: 'bob', pictureUrl: pic1.url },
        { messageCode: 'timeoutGameTurn', discordUsername: 'carol', sentence: 'g1s2'},
        { messageCode: 'timeoutGameTurn', discordUsername: 'dmitri', pictureUrl: pic3.url },
        { messageCode: 'timeoutGameEnd' }
    ]);
    
    // epyc-bot → #epyc: Game #1 is finished! Here are the turns:
    // epyc-bot → #epyc: Alice: The cat sat on the mat.
    // epyc-bot → #epyc: Bob: [Bob's picture]
    // epyc-bot → #epyc: Carol: Tony the Tiger lounges on a persian rug.
    // epyc-bot → #epyc: Dmitri: [Dmitri's picture]
    // epyc-bot → #epyc: This game started at 13:31 PT on September 11, 2023 and finished 9 days later at 11:24 PT on September 20, 2023. Thanks for playing! 


});
