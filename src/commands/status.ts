import { Message, Interaction } from "../channels/discordChannel"

export const data = {
	name: "status",
	description: "Server and personal stats.",
}

export const execute = async (i: Interaction): Promise<Message> => {
	return {
		title: "Eat Poop You Cat!",
		description: "Status Decription TK TODO",
		imageUrl: "https://i.imgur.com/oM0hxVC.jpeg",
	}
}
