import { Client, Events, GatewayIntentBits } from 'discord.js';
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy_commands";
import { DiscordService } from './channels/discordChannel';

// create a new Client instance
const client = new Client({
    intents:
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
        ]
});

const channel = new DiscordService(client);

client.once(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    // await deployCommands({ guildId: c.guilds.cache.first()?.id || ""  });
});

client.on("guildCreate", async (guild) => {
    console.log(`Joined guild ${guild.name} (${guild.id})`);
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        const command = commands[commandName as keyof typeof commands];
        const message = await command.execute(interaction);
        channel.replyToCommand(interaction, message);
    }

});

client.login(config.DISCORD_TOKEN);



