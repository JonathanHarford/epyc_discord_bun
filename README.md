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

* Do we need a player model?
* How do we keep one player from initiating lots of games?
* status should say if turn is pending (put in script)
* 



## STATUS

[x] The bot runs and replies to commands.
[x] Let's make it so that `/play` creates a game with a turn.
[x] Move the prisma calls to functions. Better yet, models.
[x] Update example to make consistent so it can be used for reference.
[x] Get tests running
[x] Write down descriptions of all the tests we think we might need
[ ] Fix picture turns -- store pics in DB
  [ ] Make a Media type instead of stretching out Turn 

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