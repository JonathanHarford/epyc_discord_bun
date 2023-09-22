import Discord from 'discord.js';
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
    "submitSentenceButEmpty";
    

export interface Message {
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