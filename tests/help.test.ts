import { expect, test } from "bun:test";
import { commands } from "../commands";
import { Message } from "discord.js";
import { helpDescription } from "../copy";

test("help", async () => {
    const interaction = {
        isCommand: () => true,
        commandName: "help",
        reply: (message: Message  ) => {
            expect(message.embeds.length).toEqual(1);
            const embed = message.embeds[0];
            expect(embed.data.title).toEqual("Eat Poop You Cat!");
            expect(embed.data.description).toEqual(helpDescription);
            expect(embed.data.image?.url).toEqual("https://i.imgur.com/AfFp7pu.png");
        },
    };

    await commands.help.execute(interaction as any);
    
});
