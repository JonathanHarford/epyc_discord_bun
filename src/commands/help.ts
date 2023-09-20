import { helpDescription } from "../copy";
import { Message, Interaction } from "../channels/discordChannel"

export const data = {
	name: "help",
	description: "How to play Eat Poop You Cat.",
}

export const execute = async (i: Interaction): Promise<Message> => {
	return {
		title: "How to play Eat Poop You Cat",
		description: helpDescription,
		imageUrl: "https://i.imgur.com/ipoiOMF.jpeg",
	}
}
