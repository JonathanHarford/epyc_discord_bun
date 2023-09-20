import Discord from 'discord.js';

interface ChatService {
  sendDirectMessage(userId: string, message: Message): Promise<void>;
  replyToCommand(interaction: Discord.CommandInteraction | null, out: Message): Promise<void>;
}

export interface Interaction {
  userId: string;
  serverId?: string;
  channelId: string;
  picture?: {
    url: string,
    contentType: string,
    content: Buffer,
  }
  sentence?: string;
}

export interface Message {
  title?: string;
  description: string;
  imageUrl?: string;
}

export const discord2Interaction = async (discordInteraction: Discord.CommandInteraction): Promise<Interaction> => {
  const pictureAttachment = discordInteraction.options?.get("picture")?.attachment;
  const pictureContent = pictureAttachment && await fetch(pictureAttachment.url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => Buffer.from(arrayBuffer));

  const sentence = discordInteraction.options?.get("sentence")?.value as string;

  return {
    userId: discordInteraction.user.id,
    serverId: discordInteraction.guildId || undefined,
    channelId: discordInteraction.channelId,
    picture: pictureAttachment && pictureAttachment.contentType && pictureContent && {
      url: pictureAttachment.url,
      contentType: pictureAttachment.contentType,
      content: pictureContent,
    } || undefined,
    sentence: discordInteraction.options?.get("sentence")?.value as string || undefined,
  }
}

const message2Embeds = (message: Message): Discord.EmbedBuilder[] => {
  const embeds = new Discord.EmbedBuilder().setDescription(message.description)
  if (message.title) {
    embeds.setTitle(message.title);
  }
  if (message.imageUrl) {
    embeds.setImage(message.imageUrl);
  }
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