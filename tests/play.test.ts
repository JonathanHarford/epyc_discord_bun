import { expect, test } from "bun:test";
import { commands } from "../commands";
import { executeCommand } from "./setup";

test("When a user uses /play and there are no games, a new game is started", async () => {
    const user_id1 = 'U1';
await executeCommand({
        commandName: "play",
        user: { id: user_id1 },
        reply: (message: string) => {
            expect(message).toStartWith("You are starting Game #");
            expect(message).toEndWith("You have 00:09:59 to `/submit` an initiating sentence.");
        }
    });
    await executeCommand({
        commandName: "play",
        user: { id: user_id1 },
        reply: (message: string) => {
            expect(message).toEqual("You still have 00:09:59 to `/submit` an initiating sentence.");
        }
    });
});


test("When a user uses /play and there is a pending game, a new game is started", async () => {
    const user_id1 = 'U1';
    const user_id2 = 'U2';

    await executeCommand({
        commandName: "play",
        user: { id: user_id1 },
        reply: (message: string) => {
            expect(message).toStartWith("You are starting Game #");
            expect(message).toEndWith("You have 00:09:59 to `/submit` an initiating sentence.");
        }
    });
    await executeCommand({
        commandName: "play",
        user: { id: user_id2 },
        reply: (message: string) => {
            expect(message).toStartWith("You are starting Game #");
            expect(message).toEndWith("You have 00:09:59 to `/submit` an initiating sentence.");
        }
    });
});





