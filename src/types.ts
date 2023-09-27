import Discord from 'discord.js';
import { PrismaClient, Game as pcGame, Turn as pcTurn, Player as pcPlayer, Media as pcMedia} from '@prisma/client'

export type TurnWithGame = pcTurn & { game: Game, media?: Media };
export type Game = pcGame;
export type Player = pcPlayer;
export type Media = pcMedia;
export type PlayerId = number;
export type DiscordUserId = string;
export type ChannelId = string;
export interface MediaInput {
  url: string,
  contentType: string,
  content: Buffer,
}

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
  "timeoutGame";

export interface Message {
  playerId?: PlayerId,
  messageCode: MessageCode,

  inProgress?: number,
  yoursDone?: number,
  yoursInProgress?: number,
  timeRemaining?: number,

  previousSentence?: string,
  previousPictureUrl?: string,
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
  serverId?: string;
  channelId: string;
  turnId?: string;
  gameId?: string;
  picture?: {
    url: string,
    contentType: string,
    content: Buffer,
  }
  sentence?: string;
}
