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

## TODO

* i18n-node

Consider:

* How do we keep one player from initiating lots of games?
* Do we need /submit? Can we just use /play?
* send player a reminder when turn will timeout soon

## Bugs

* I still don't understand how .env.test works. 

## STATUS

[x] The bot runs and replies to commands.
[x] Let's make it so that `/play` creates a game with a turn.
[x] Move the prisma calls to functions. Better yet, models.
[x] Update example to make consistent so it can be used for reference.
[x] Get tests running
[x] Write down descriptions of all the tests we think we might need
[x] Fix picture turns -- store pics in DB
[x] Refactor submit to not interact with discord directly
[x] Write more test
[x] Get status to work
[x] Add render layer
[x] Finish getting rid of descriptionOverride
[x] Fix picture test
[x] Figure out test/local environments
[ ] Finish timers
 - Including in tests
[ ] Sort out userId/PlayerId/etc. Should use playerId everywhere except Discord
[ ] More tests / debugging
[ ] Audit queries/indices
[ ] Add prompt to appropriate places
[ ] Use table for status
[ ] clear old commands
 

## NOTES

Configure the project so that `bun run test` uses the "epyctest" database mentioned in `.env.test`. Do this without making changes to .`env.local`, which needs to continue to refer to the "epyc" database. When running the test, check the line that starts with the word "Datastore" to ensure it is using the correct database. Setting the DATABASE_URL environment variable in the shell is not a valid solution.