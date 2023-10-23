# epyc_discord_bun

## Use

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

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
