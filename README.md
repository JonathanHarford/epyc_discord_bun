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

## Bugs

* /submit picture ... -> submitButNo


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
[ ] readd tests
[ ] Add prompt to appropriate places
[ ] Use table for status
[ ] clear old commands
 

## NOTES

Example picture attachment:
```
{
  name: "picture",
  type: 11,
  value: "1152308681707356160",
  attachment: {
    attachment: "https://cdn.discordapp.com/ephemeral-attachments/1152030621082849333/1152308681707356160/hacker.png",
    name: "hacker.png",
    id: "1152308681707356160",
    size: 25297,
    url: "https://cdn.discordapp.com/ephemeral-attachments/1152030621082849333/1152308681707356160/hacker.png",
    proxyURL: "https://media.discordapp.net/ephemeral-attachments/1152030621082849333/1152308681707356160/hacker.png",
    height: 125,
    width: 115,
    contentType: "image/png",
    description: null,
    ephemeral: true,
    duration: null,
    waveform: null,
    flags: {
      bitfield: 0,
      any: [Function: any],
      equals: [Function: equals],
      has: [Function: has],
      missing: [Function: missing],
      freeze: [Function: freeze],
      add: [Function: add],
      remove: [Function: remove],
      serialize: [Function: serialize],
      toArray: [Function: toArray],
      toJSON: [Function: toJSON],
      valueOf: [Function: valueOf],
      [Symbol(Symbol.iterator)]: [Function: GeneratorFunction]
    },
    _patch: [Function: _patch],
    spoiler: [Getter],
    toJSON: [Function: toJSON]
  }
}
```