import { Message } from "../channels/discordChannel"

export const data = {
	name: "status",
	description: "Server and personal stats.",
}

export const execute = async (): Promise<Message> => {
	return {
		title: "Eat Poop You Cat!",
		description: "Status Decription TK TODO",
		imageUrl: "https://i.imgur.com/AfFp7pu.png",
	}
}
