import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { PrismaClient, Game, Turn, Player } from '@prisma/client'

const prisma = new PrismaClient()

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Initiate a turn in a game of Eat Poop You Can.");

const createOrFindPlayer = async (discordId: string): Promise<Player> => {
  return prisma.player.upsert({
    where: { discordId: discordId },
    update: {},
    create: { discordId: discordId },
  });
}

const findPendingTurn = async (player: Player): Promise<Turn|null> => {
  return prisma.turn.findFirst({
    where: {
      player: player,
      done: false,
    },
  });
}

const findAvailableGame = async (player: Player): Promise<Game|null> => {
  return prisma.game.findFirst({
    where: {
      done: false,
      turns: {
        none: {
          player: player,
        },
      },
    },
  });
}

const createNewGame = async (): Promise<Game> => {
  return prisma.game.create({data: {}});
}

const createNewTurn = async (game: Game, player: Player): Promise<Turn> => {
  return prisma.turn.create({
    data: {
      game: {
        connect: {
          id: game.id,
        },
      },
      player: {
        connect: {
          id: player.id,
        },
      },
    },
  });
}

export async function execute(interaction: CommandInteraction) {
  const user = interaction.user;

  const player = await createOrFindPlayer(user.id);

  const pendingTurn = await findPendingTurn(player);
  if (pendingTurn) { return interaction.reply(`You have a pending turn ${pendingTurn.id}.`) }

  let game = await findAvailableGame(player) || await createNewGame();
  
  // Create a turn for the player
  console.log("Creating a new turn")
  const newTurn = await createNewTurn(game, player);
  return interaction.reply(`Created a new turn ${newTurn.id}.`);
}