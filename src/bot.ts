import { Client, Events, GatewayIntentBits } from 'discord.js';
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy_commands";
import { DiscordService, discord2Interaction } from './services/discordChannel';
import { render } from './copy';
import { findTurnsTimedout, expireTurn, findGamesTimedout, expireGame } from './auditor'
import * as db from "./db";
import { MessageCode } from './types';

// create a new Client instance
const client = new Client({
    intents:
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
        ]
});
const chatService = new DiscordService(client);

client.once(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    const heartbeat = setInterval(async () => {
        console.log("Lub dub");

        // For each pending turn that has timed out, delete it from its game
        // and notify its player
        const turnsExpired = await findTurnsTimedout();
        const turnsExpiredMessages = turnsExpired.map(expireTurn);
        for await (const message of turnsExpiredMessages) {
            await chatService.sendDirectMessage({
                playerId: message.playerId!,
                message: render(message),
            });
        }

        // For each game that has timed out, let the players know it is done 
        // and post the results
        const gamesDone = await findGamesTimedout();
        const gamesExpiredMessages = gamesDone.map(expireGame);
        for await (const message of turnsExpiredMessages) {
            await chatService.sendChannelMessage({
                channelId: message.channelId!,
                message: render(message),
            });
        }
    }, 1000 * 5); // Todo make this every minute
    // await deployCommands({ guildId: c.guilds.cache.first()?.id || ""  });
});

client.on("guildCreate", async (guild) => {
    console.log(`Joined guild ${guild.name} (${guild.id})`);
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (discordInteraction) => {
    if (!discordInteraction.isCommand()) {
        return;
    }
    const { commandName } = discordInteraction;
    if (commands[commandName as keyof typeof commands]) {
        const command = commands[commandName as keyof typeof commands];
        const interaction = await discord2Interaction(discordInteraction);
        const message = await command.execute(interaction);
        console.log(interaction, '\n->\n', message, '\n');
        const messageRender = render(message);
        chatService.replyToCommand(discordInteraction, { message: messageRender });
    }
});

client.login(config.DISCORD_TOKEN);



