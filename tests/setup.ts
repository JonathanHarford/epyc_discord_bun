import { expect, test, beforeEach, afterAll } from "bun:test";
import { CommandInteraction } from "discord.js";
import { commands } from "../commands";


const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

beforeEach(async () => {
    console.log("Clearing database...");
    await prisma.$executeRaw`DELETE FROM "Turn";`
    await prisma.$executeRaw`DELETE FROM "Player";`
    await prisma.$executeRaw`DELETE FROM "Game";`
})

afterAll(async () => {
    await prisma.$disconnect()
})

export const executeCommand = async (options:
    {
        commandName: keyof typeof commands,
        reply: (message: string) => void,
        user?: any,
        guildId?: string,
        picture?: string,
        sentence?: string,
        channelId?: string,
    }
) => {
    return await commands[options.commandName].execute({
        isCommand: () => true,
        commandName: options.commandName,
        user: {
            id: options.user?.id || 'U' + crypto.randomUUID(),
        },

        guildId: options.guildId || 'G' + crypto.randomUUID(),
        channelId: options.guildId || 'C' + crypto.randomUUID(),
        reply: options.reply,
    } as any);
}