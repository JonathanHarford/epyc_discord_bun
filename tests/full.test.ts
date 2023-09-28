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
    await prisma.$executeRaw`DELETE FROM "Turn";`
    await prisma.$executeRaw`DELETE FROM "Player";`
    await prisma.$executeRaw`DELETE FROM "Game";`
})

afterAll(async () => {
    await prisma.$disconnect()
})

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
    expect(m.previousSentence).toEqual('sentence1');
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
    expect(m.timeRemaining).toBeGreaterThan(0);

});
