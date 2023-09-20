import Discord from 'discord.js';
export interface MediaInput {
    url: string,
    contentType: string,
    content: Buffer,
}

export interface Message {
    command: "play" | "submit" | "help" | "status"
    inProgress: number,
    yoursDone: number,
    yoursInProgress: number,
    timeString?: string,
  }

  export interface ChatService {
    sendDirectMessage(userId: string, message: MessageRender): Promise<void>;
    replyToCommand(interaction: Discord.CommandInteraction | null, out: MessageRender): Promise<void>;
  }
  
  export interface Interaction {
    userId: string;
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
    title?: string;
    description: string;
    imageUrl?: string;
  }
  