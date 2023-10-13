import Discord from 'discord.js';
import * as prisma from '@prisma/client'

export type Turn = prisma.Turn;
export type Game = prisma.Game & { turns: Turn[] };
export type Player = prisma.Player;
export type PlayerId = number;
export type DiscordUserId = string;
export type ChannelId = string;

export type MessageCode =
  "help" |
  "status" |
  "playButPending" |
  "playSentenceInitiating" |
  "playPicture" |
  "playSentence" |
  "submitButNo" |
  "submitPicture" |
  "submitSentence" |
  "submitPictureButSentence" |
  "submitPictureButEmpty" |
  "submitSentenceButPicture" |
  "submitSentenceButEmpty" |
  "timeoutTurn" |
  "timeoutGameIntro" | 
  "timeoutGameTurn" |
  "timeoutGameEnd";

export interface Message {
  playerId?: PlayerId,
  discordUserId?: DiscordUserId,
  messageCode: MessageCode,
  channelId?: ChannelId,

  discordUsername?: string,
  inProgress?: number,
  yoursDone?: number,
  yoursInProgress?: number,
  timeRemaining?: number,
  startedAt?: Date,
  endedAt?: Date,

  sentence?: string,
  imageUrl?: string,
  gameId?: number,
}
export interface MessageRender {
  playerId?: PlayerId;
  title?: string;
  description: string;
  imageUrl?: string;
}

export interface ReplyRender {
  message: MessageRender;
}
export interface DirectMessageRender {
  message: MessageRender;
  playerId: PlayerId;
}

export interface ChannelMessageRender {
  channelId: ChannelId;
  message: MessageRender;
}

export interface ChatService {
  sendDirectMessage(message: DirectMessageRender): Promise<void>;
  sendChannelMessage(message: ChannelMessageRender): Promise<void>;
  replyToCommand(interaction: Discord.CommandInteraction | null, out: ReplyRender): Promise<void>;
}

export interface Interaction {
  userId: DiscordUserId;
  username: string;
  serverId?: string;
  channelId: string;
  turnId?: string;
  gameId?: string;
  imageUrl?: string
  sentence?: string;
}
