import { expect, test } from "bun:test";
import { commands } from "../commands";
import { executeCommand } from "./setup";

test("When a user /submits and there are no games, they are dissuaded.", async () => {
    const user_id1 = 'U1';

    await executeCommand({
        commandName: "submit",
        user: { id: user_id1 },
        reply: (message: string) => {
            expect(message).toEqual("I'm not waiting on a turn from you!");
        }
    });


});
