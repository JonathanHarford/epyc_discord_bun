import { Interaction, Message } from '../types';

export const data = {
	name: "help",
	description: "How to play Eat Poop You Cat.",
}

export const execute = async (i: Interaction): Promise<Message> => {
	return {
		messageCode: 'help',
	}
}
