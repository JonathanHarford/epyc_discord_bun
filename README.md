# epyc_discord_bun

This Discord bot administers the party game [Eat Poop You Cat](https://boardgamegeek.com/boardgame/30618/eat-poop-you-cat) aka Telephone Pictionary aka the board games [Cranium Scribblish](https://boardgamegeek.com/boardgame/82610/cranium-scribblish) and [Telestrations](https://en.wikipedia.org/wiki/Telestrations); aka the web games Broken Picture Telephone(RIP), [Doodle or Die](https://doodleordie.com/), [Drawception](https://drawception.com/), [Interference](https://www.playinterference.com/), [BrokenPicturePhone](https://www.brokenpicturephone.com/), [DrawPhone](https://rocketcrab.com/game/drawphone), and [TypeDrawType](https://draw.czedik.at/); aka the Discord game [Gartic Phone](https://garticphone.com/).

What makes this one special?

1. It's asyncronous
1. It's on Discord
1. You can generate your picture however you like. Drawing on a phone or with a mouse is terrible.

## Prerequisites:

* Bun
* PostgreSQL

## Use

1. Install dependencies: `bun install`
1. Add your environment variables to `.env`. You can see what needs to be defined in `src/config.ts`.
1. `bun run index.ts`

## Todo

* Make bot able to work on multiple servers
* Merge Message and MessageRender
* Turns and Games should own their timeouts?
* Add debug commands
* Audit queries/indices
* Add prompt to appropriate places
* Send reminders before turns expire
* Minimum number of turns
* Allow for players to play more than once in a game if enough turns have elapsed

## Consider:

* How do we keep one player from initiating lots of games?
* Do we need /submit? Can we just use /play?
