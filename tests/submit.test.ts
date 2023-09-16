import { expect, test } from "bun:test";
import { commands } from "../commands";
import { executeCommand } from "./setup";

test("When a user /submits and there are no games, they are dissuaded.", async () => {
    const user_id1 = 'U1';

    await executeCommand({
        commandName: "submit",
        user: { id: user_id1 },
        reply: (message) => {
            expect(message).toEqual("I'm not waiting on a turn from you!");
        }
    });
});

test("When a user /submits and there is only a pending game, they are dissuaded.", async () => {
    const user_id1 = 'U1';
    const user_id2 = 'U2';

    await executeCommand({
        commandName: "play",
        user: { id: user_id1 },
    });
    await executeCommand({
        commandName: "submit",
        user: { id: user_id2 },
        reply: (message) => {
            expect(message).toEqual("I'm not waiting on a turn from you!");
        }
    });
});
