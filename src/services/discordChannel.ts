import Discord from 'discord.js';
import config from "../config";
import { Interaction, DirectMessageRender, ReplyRender, ChannelMessageRender, MessageRender, ChatService } from '../types';
import * as db from '../db';

export const discord2Interaction = async (discordInteraction: Discord.CommandInteraction): Promise<Interaction> => {
  const pictureAttachment = discordInteraction.options?.get("picture")?.attachment;
  const sentence = discordInteraction.options?.get("sentence")?.value as string;
  return {
    userId: discordInteraction.user.id,
    username: discordInteraction.user.username,
    serverId: discordInteraction.guildId || undefined,
    channelId: discordInteraction.channelId,
    imageUrl: pictureAttachment?.url || undefined,
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
  channel?: Discord.TextChannel | undefined;
  constructor(private client: Discord.Client) { 
  }

  onReady() {
    this.channel = this.client.channels.cache.find(channel => channel instanceof Discord.TextChannel && channel.name === config.CHANNEL) as Discord.TextChannel;
    if (!this.channel) throw new Error(`Could not find channel ${config.CHANNEL}`);
  }

  async sendDirectMessage(envelope: DirectMessageRender): Promise<void> {
    const { playerId } = envelope;
    const player = await db.fetchPlayer(playerId!);
    const user = await this.client.users.fetch(player!.discordUserId);
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
    await this.channel!.send({ embeds: message2Embeds(envelope.message) });
  }

}