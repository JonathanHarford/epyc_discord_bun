import { PrismaClient } from '@prisma/client'
import * as db from '../src/db';
import { expect, test, beforeEach, describe } from "bun:test";

const discordChannelId = "channel";
const discordGuildId = "guild";
const pic1 = { url: 'https://i.imgur.com/aj1e4nD.jpg', contentType: 'image/jpeg' };
const prisma = new PrismaClient()

describe('finishPictureTurn', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await prisma.media.deleteMany();
    await prisma.turn.deleteMany();
    await prisma.game.deleteMany();
  });

  test('finishes turn and creates media item', async () => {
    // Create a game and turn
    let alice = await db.createOrFindPlayer('alice');
    let bob = await db.createOrFindPlayer('alice');
    let game1 = await db.createNewGame(discordGuildId, discordChannelId);
    let turn1 = await db.createNewTurn(game1, alice, false);
    turn1 = await db.finishSentenceTurn(turn1.id, 'This is a sentence.');
    let turn2 = await db.createNewTurn(game1, bob, true);
    const result = await db.finishPictureTurn(turn2.id, {
        url: pic1.url,
        contentType: pic1.contentType,
        content: await fetch(pic1.url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => Buffer.from(arrayBuffer)),
    });

    // Assert that the turn is done and includes the game and media item
    expect(result.done).toBe(true);
    expect(result.game.id).toBe(game1.id);
    expect(result.media).toBeDefined();

    // Assert that the media item was created in the database
    const media = await prisma.media.findUnique({ where: { id: result.media!.id } });
    expect(media).toBeDefined();
    expect(media!.url).toBe(pic1.url);
    expect(media!.contentType).toBe(pic1.contentType);
    expect(media!.content).toBeDefined;
  });
});