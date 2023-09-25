import { Interaction, Message } from '../types';
import { createOrFindPlayer, getStats } from "../db"

export const data = {
	name: "status",
	description: "Server and personal stats.",
}

export const execute = async (interaction: Interaction): Promise<Message> => {
	const player = await createOrFindPlayer(interaction.userId);
	const stats = await getStats(player);
	return {
		...stats,
		messageCode: 'status'
	};
}
