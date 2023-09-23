import Discord from 'discord.js';
import { PrismaClient, Game as pcGame, Turn as pcTurn, Player as pcPlayer, Media as pcMedia} from '@prisma/client'

export type TurnWithGame = pcTurn & { game: Game, media?: Media };
export type Game = pcGame;
export type Player = pcPlayer;
export type Media = pcMedia;
export type PlayerId = number;
export type DiscordUserId = string;
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

export interface ChatService {
  sendDirectMessage(message: MessageRender): Promise<void>;
  replyToCommand(interaction: Discord.CommandInteraction | null, out: MessageRender): Promise<void>;
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

export interface MessageRender {
  playerId?: PlayerId;
  title?: string;
  description: string;
  imageUrl?: string;
}

// TODO add Reply and DirectMessage types to wrap MessageRender