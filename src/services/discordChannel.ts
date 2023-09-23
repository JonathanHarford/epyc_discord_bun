import Discord from 'discord.js';
import { Interaction, Message, MessageRender, ChatService, TurnWithGame } from '../types';
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
    sentence: discordInteraction.options?.get("sentence")?.value as string || undefined,
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
  constructor(private client: Discord.Client) { }

  async sendDirectMessage(message: MessageRender): Promise<void> {
    const { playerId } = message;
    if (!playerId) throw new Error(`Player ${message.playerId} not found.`);
    const player = await db.fetchPlayer(playerId);
    if (!player) throw new Error(`Player ${message.playerId} not found.`);
    const user = await this.client.users.fetch(player.discordUserId);
    const dmChannel = await user.createDM();
    await dmChannel.send({ embeds: message2Embeds(message) });
  }

  async replyToCommand(interaction: Discord.CommandInteraction, message: MessageRender): Promise<void> {
    interaction.reply({
      embeds: message2Embeds(message),
      ephemeral: true,
    })
  }

}