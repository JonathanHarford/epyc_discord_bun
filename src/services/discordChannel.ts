import Discord from 'discord.js';
import { Interaction, DirectMessageRender, ReplyRender, ChannelMessageRender, MessageRender, ChatService } from '../types';
import * as db from '../db';

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
    sentence: sentence || undefined,
  }
}

const message2Embeds = (message: MessageRender): Discord.EmbedBuilder[] => {
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
  constructor(private client: Discord.Client) { 
    // Ideas for what should be in the constructor?
  }

  async sendDirectMessage(envelope: DirectMessageRender): Promise<void> {
    const { playerId } = envelope;
    if (!playerId) throw new Error(`Player ${playerId} not found.`);
    const player = await db.fetchPlayer(playerId);
    if (!player) throw new Error(`Player ${playerId} not found.`);
    const user = await this.client.users.fetch(player.discordUserId);
    const dmChannel = await user.createDM();
    await dmChannel.send({ embeds: message2Embeds(envelope.message) });
  }

  async replyToCommand(interaction: Discord.CommandInteraction, envelope: ReplyRender): Promise<void> {
    interaction.reply({
      embeds: message2Embeds(envelope.message),
      ephemeral: true,
    })
  }

  async sendChannelMessage(envelope: ChannelMessageRender): Promise<void> {
    const channel = await this.client.channels.fetch(envelope.channelId);
    if (!channel || !channel.isTextBased()) throw new Error(`Channel ${envelope.channelId} is not a text channel.`);
    await channel.send({ embeds: message2Embeds(envelope.message) });
  }

}