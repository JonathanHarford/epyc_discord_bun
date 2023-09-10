# epyc_discord_bun

## Description

The software application to be developed is a bot named discord-epyc, to administer the public domain party game "Broken Picture Telephone" (also known as "Eat Poop You Cat") over the messaging app Discord (the bot has no web interface). It should be developed in Bun/Typescript, leverage discord.js, and use Postgres for persistence. The bot administers multiple games at once, and tracks the sequence of players' turns, ensuring that a user can't play in multiple games simultaneously. Each game consists of alternating sentence/picture turns, with each turn by a different player.

The user initiates play with the slash command `/play`. When this happens, the bot finds the active game that's gone the longest without a turn (excluding games the user has already played in), and creates a turn in that game. This involves sending the user the previous completed turn (played by another user) in the game, and receiving the user's response. Each turn is either a "sentence" turn, where the user responds with a sentence, or a "picture" turn, where the user uploads a picture (JPG, PNG, WebP). 

If the user initiates play but has already played in every active game, the bot will prompt the user to provide an initial sentence with which to start a new game. 

If a player doesn't respond within 24 hours after initiating a turn, they are sent a message letting them know their turn has expired. They can then 

After a week of no gameplay, the game is considered finished, triggering an announcement to the #epyc channel, comprising: 1. a message announcing the end of the game, giving the date that it started 2. a series of messages (one per game turn), containing that turn's user's name, the time they played their turn, and the content of their turn (i.e. a sentence or a picture).

The bot is required to have authorization and permissions for Discord servers, including the abilities to Manage Channels, Send Messages, Manage Webhooks, Read Messages, Attach Files, Embed Links, and Use External Emojis. There is no limit to the number of turns per game. Current plans only include support for English.

## Use

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## TODO

Consider:

* Do we need a player model?

## STATUS

[x] The bot runs and replies to commands. X
[x] Let's make it so that `/play` creates a game with a turn. X
[ ] Move the prisma calls to functions. Better yet, models.