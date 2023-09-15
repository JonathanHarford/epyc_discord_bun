import { expect, test } from "bun:test";
import { Message } from "discord.js";
import { helpDescription } from "../copy";
import { executeCommand } from "./setup";

test("help", async () => {
    await executeCommand({
        commandName: "help",
        reply: (message) => {
            // This should never happen?
            if (typeof message === "string") {
                expect(message).toEqual(helpDescription);
                return;
            }
            expect(message.embeds.length).toEqual(1);
            const embed = message.embeds[0];
            expect(embed.data.title).toEqual("Eat Poop You Cat!");
            expect(embed.data.description).toEqual(helpDescription);
            expect(embed.data.image?.url).toEqual("https://i.imgur.com/AfFp7pu.png");
        }
    });

});
