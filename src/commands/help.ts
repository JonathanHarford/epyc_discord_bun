import { helpDescription } from "../copy";
import { Interaction, Message, MessageRender, ChatService } from '../types';

export const data = {
	name: "help",
	description: "How to play Eat Poop You Cat.",
}

export const execute = async (i: Interaction): Promise<MessageRender> => {
	return {
		title: "How to play Eat Poop You Cat",
		description: helpDescription,
		imageUrl: "https://i.imgur.com/ipoiOMF.jpeg",
	}
}
