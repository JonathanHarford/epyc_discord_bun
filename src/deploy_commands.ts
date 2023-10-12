import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { commands } from "./commands";
import config from "./config";

const commandsData = Object.values(commands).map((command) => {
  const { name, description } = command.data;
  const slashCommand = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description);
  if ("stringOption" in command.data) {
    const { name: stringName, description: stringDescription } = command.data.stringOption;
    slashCommand.addStringOption(option => option.setName(stringName).setDescription(stringDescription));
  }
  if ("attachmentOption" in command.data) {
    const { name: attachmentName, description: attachmentDescription } = command.data.attachmentOption;
    slashCommand.addAttachmentOption(option => option.setName(attachmentName).setDescription(attachmentDescription));
  }
  return slashCommand.toJSON();
});

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCommands({ guildId }: DeployCommandsProps) {
  rest.put(Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);
}