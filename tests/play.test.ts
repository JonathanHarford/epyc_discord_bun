import { expect, test, beforeEach, afterAll } from "bun:test";
import { commands } from "../commands";
import { interact } from "./setup";

test("When a user uses /play and there are only pending and done games, a new game is started", async () => {
    const interaction = interact({
        commandName: "play",
        reply: (message: string) => {
            expect(message).toStartWith("You are starting Game #");
            expect(message).toEndWith("You have 00:09:59 to `/submit` an initiating sentence.");
        }
    });
    await commands.play.execute(interaction as any);
});



