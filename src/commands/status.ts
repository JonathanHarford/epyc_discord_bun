import { Interaction, Message, MessageRender, ChatService } from '../types';
import { createOrFindPlayer, getStats } from "../db"

export const data = {
	name: "status",
	description: "Server and personal stats.",
}

export const execute = async (interaction: Interaction): Promise<MessageRender> => {
	const player = await createOrFindPlayer(interaction.userId);
	const { inProgress, yoursDone, yoursInProgress } = await getStats(player);
	return {
		title: "Eat Poop You Cat! STATUS",
		description: `Games in progress: ${inProgress}. Yours: ${yoursDone} done, ${yoursInProgress} in progress.`,
	}
}
