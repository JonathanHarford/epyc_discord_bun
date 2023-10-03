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
* since we almost always need to include a game when fetching a turn, can we just always work with a Game (w/ Turns & Media) object?

## STATUS

### Done

* The bot runs and replies to commands.
* Let's make it so that `/play` creates a game with a turn.
* Move the prisma calls to functions. Better yet, models.
* Update example to make consistent so it can be used for reference.
* Get tests running
* Write down descriptions of all the tests we think we might need
* Fix picture turns -- store pics in DB
* Refactor submit to not interact with discord directly
* Write more test
* Get status to work
* Add render layer
* Finish getting rid of descriptionOverride
* Fix picture test
* Figure out test/local environments
* Finish timers
* Store pictures in database
* Sort out userId/PlayerId/etc. Should use playerId everywhere except Discord
* Finish full test

### Todo

* clear old commands
* Create full finish game message(s)
* Audit queries/indices
* Add prompt to appropriate places
* Use table for status
