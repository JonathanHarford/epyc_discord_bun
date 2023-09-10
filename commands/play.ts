import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Initiate a turn in a game of Eat Poop You Can.");

export async function execute(interaction: CommandInteraction) {
  const user = interaction.user;
  // Create player if none exists
  const player = await prisma.player.upsert({
    where: { discordId: user.id },
    update: {},
    create: { discordId: user.id },
  });
  if (!player) {
    return interaction.reply("ERROR: Could not find or create a player.");
  }

  // Find player's pending turn
  const pendingTurn = await prisma.turn.findFirst({
    where: {
      player: player,
      done: false,
    },
  });
  // If a pending turn is found, return it
  if (pendingTurn) {
    return interaction.reply(`You have a pending turn ${pendingTurn.id}.`);
  }

  // Find a game that is available that has no turns by the player
  console.log("Searching for game")
  let game = await prisma.game.findFirst({
    where: {
      done: false,
      turns: {
        none: {
          player: {
            discordId: user.id,
          },
        },
      },
    },
  });
  // If no game is found, create a new game
  if (!game) {
    console.log("No game found, creating a new one")
    game = await prisma.game.create({data: {}});
  }

  // Should never happen?
  if (!game) {
    return interaction.reply("ERROR: Could not find or create a game.");
  }


  // Create a turn for the player
  console.log("Creating a new turn")
  const newTurn = await prisma.turn.create({
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
  return interaction.reply(`Created a new turn ${newTurn.id}.`);
}