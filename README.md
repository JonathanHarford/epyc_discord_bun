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

### Bugs

* When the bot sends the picture (either in response to /play or the game ending) it isn't able to convert the binary blob from the databse back into a picture.
* See the bug.png

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
* clear old commands
* Refactor to center around Game objects
* Fix: Game updatedAt isn't getting updated, so games end based on their start time, not the last time someone took a turn.
* Create full finish game message(s)
* Fix: slash command permissions
* Resize image on upload
* Give up on storing/resizing images

### Todo
* instead of having types that could have a picture or could have a sentence, make it so it must have one or the other.
* Run on Heroku or something
* Add debug commands
* Audit queries/indices
* Add prompt to appropriate places
* Use table for status
* Allow for players to 
