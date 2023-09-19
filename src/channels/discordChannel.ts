import Discord from 'discord.js';

interface ChatService {
  sendDirectMessage(userId: string, message: Message): Promise<void>;
  replyToCommand(interaction: Discord.CommandInteraction | null, out: Message): Promise<void>;
}

export interface Message {
  title: string | null;
  description: string;
  imageUrl: string | null;
}

const message2Embeds = (message: Message): Discord.EmbedBuilder[] => {
  const embeds = new Discord.EmbedBuilder()
    .setTitle(message.title)
    .setDescription(message.description)
    .setImage(message.imageUrl);
  return [embeds];
}

export class DiscordService implements ChatService {
  constructor(private client: Discord.Client) { }

  async sendDirectMessage(userId: string, message: Message): Promise<void> {
    const user = await this.client.users.fetch(userId);
    const dmChannel = await user.createDM();
    await dmChannel.send({ embeds: message2Embeds(message) });
  }

  async replyToCommand(interaction: Discord.CommandInteraction, message: Message): Promise<void> {
    interaction.reply({
      embeds: message2Embeds(message),
      ephemeral: true,
    })
  }

}