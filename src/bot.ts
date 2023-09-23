import { Client, Events, GatewayIntentBits } from 'discord.js';
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy_commands";
import { DiscordService, discord2Interaction } from './services/discordChannel';
import { render } from './copy';
import { audit } from './auditor'

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
    const interval = setInterval(async () => {
        const messages = await audit();
        messages.forEach(m => chatService.sendDirectMessage(render(m)));
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
        chatService.replyToCommand(discordInteraction, messageRender);
    }

});

client.login(config.DISCORD_TOKEN);



