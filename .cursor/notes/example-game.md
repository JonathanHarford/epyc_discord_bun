# Example game

Here is an example of a game administered by epyc-bot and played by Alice, Bob, Carol, and Dmitri. All epyc-bot messages are ephemeral unless stated otherwise. Messages with "→" are to a specific person or channel.

Alice: /help
epyc-bot: Eat Poop You Cat! The first player writes a sentence, the second player draws a picture of that sentence, the third player writes a sentence of that picture, and so on. At the end of the game, it gets posted to #epyc where players can admire the art, the writing, and how the concept mutated. When providing an initiating sentence, input something that will be visually interesting! Type `/play` or `/status`.

Alice: /status
epyc-bot: Games in progress: 0. Yours: 0 done, 0 in progress, no turn pending.

Alice: /play
epyc-bot: You are starting Game #1! You have 10 minutes to `/submit` an initiating sentence.

Alice: /status
epyc-bot: Games in progress: 1. Yours: 0 done, 1 in progress. You have 9 minutes to `/submit` an initiating sentence.

Alice: /submit sentence The cat sat on the mat.
epyc-bot: Thanks, I'll let you know when Game #1 is complete.

Alice: /status
epyc-bot: Games in progress: 1. Yours: 0 done, 1 in progress.  

Alice: /submit sentence The pony sat on the mat.
epyc-bot: I'm not waiting on a turn from you!

Alice: /play
epyc-bot: You are starting Game #2! You have 10 minutes to `/submit` an initiating sentence.

Alice: /status
epyc-bot: Games in progress: 2. Yours: 0 done, 2 in progress. You have 9 minutes to `/submit` an initiating sentence.

(9 minutes pass)

epyc-bot → Alice: Your turn has timed out. Use `/play` to play.

Bob: /status
epyc-bot: Games in progress: 2. Yours: 0 done, 0 in progress, no turn pending.

Bob: /play
epyc-bot: You have 24 hours to `/submit` a picture that illustrates "The cat sat on the mat."

Bob: /status
epyc-bot: Games in progress: 2. Yours: 0 done, 1 in progress. You have 23:59 to `submit` a picture that illustrates "The cat sat on the mat."

(24 hours pass)

epyc-bot → Bob: Your turn has timed out. Use `/play` to play.

Bob: /submit picture [Bob uploads and sends a suitable picture]
epyc-bot: I'm not waiting on a turn from you!

Bob: /play
epyc-bot: You have 24 hours to `/submit` a picture that illustrates "The cat sat on the mat."

Bob: /submit sentence The dog sat on the mat.
epyc-bot: You have 23:59 to `/submit` a picture (not a sentence) that illustrates "The cat sat on the mat."

Bob: /submit picture [Bob uploads a video]
epyc-bot: You have 23:59 to `/submit` a picture (JPG or PNG) that illustrates "The cat sat on the mat."

Bob: /submit picture [Bob uploads a picture that is shorter or narrower than 200 pixels]
epyc-bot: You have 23:59 to `/submit` a picture (larger than 200x200) that illustrates "The cat sat on the mat."

Bob: /submit picture [Bob uploads a suitable picture]
epyc-bot: Thanks, I'll let you know when Game #1 is complete.

Bob: /status
epyc-bot: Games in progress: 2. Yours: 0 done, 1 in progress.

(a few hours pass)

Carol: /status
epyc-bot: Games in progress: 2. Yours: 0 done, 0 in progress.

Carol: /play
epyc-bot: You have 10 minutes to send me a sentence (or two) that describes this picture: [Bob's picture]

(10 minutes pass)

epyc-bot → Carol: Your turn has timed out. Use `/play` to play.

Carol: /submit sentence Tony the Tiger lounges on a persian rug.
epyc-bot: I'm not waiting on a turn from you!

Carol: /play
epyc-bot: You have 10 minutes to `/submit` a sentence or two that describes this: [Bob's picture]

Carol: /status
epyc-bot: Games in progress: 2. Yours: 0 done, 1 in progress. You have 9 minutes to `/submit` a sentence or two that describes this: [Bob's picture]

Carol: /submit picture [Carol uploads a picture]
epyc-bot: You have 9 minutes to `/submit` a sentence or two (not a file) that describes this: [Bob's picture]

Carol: /submit sentence Tony the Tiger lounges on a persian rug.
epyc-bot: Thanks, I'll let you know when Game #1 is complete.

Carol: /status
epyc-bot: Games in progress: 2. Yours: 0 done, 1 in progress.

Carol: /epyc play
epyc-bot: You are starting Game #3! You have 10 minutes to `/submit` an initiating sentence.

Carol: /submit picture The dog sat on the mat.
epyc-bot: Thanks, I'll let you know when Game #2 is complete.

Carol: /status
epyc-bot: Games in progress: 3. Yours: 0 done, 2 in progress.

(a few hours pass)

Dmitri: /status
epyc-bot: Games in progress: 3. Yours: 0 done, 0 in progress.

Dmitri: /play
(Dmitri is assigned the most stale game)
epyc-bot: You have 24 hours to `/submit` a picture that illustrates "Tony the Tiger lounges on a persian rug."

Dmitri: /submit picture [Dmitri uploads and sends a picture]
epyc-bot: Thanks, I'll let you know when Game #1 is complete.

Dmitri: /status
epyc-bot: Games in progress: 3. Yours: 0 done, 1 in progress.

(a week passes since a turn has been played in Game #2 but since there is only one turn it continues to wait for someone to play it)

(a week passes since a turn has been played in Game #1)

epyc-bot → #epyc: Game #1 is finished! Here are the turns:
epyc-bot → #epyc: Alice: The cat sat on the mat.
epyc-bot → #epyc: Bob: [Bob's picture]
epyc-bot → #epyc: Carol: Tony the Tiger lounges on a persian rug.
epyc-bot → #epyc: Dmitri: [Dmitri's picture]
epyc-bot → #epyc: This game started at 13:31 PT on September 11, 2023 and finished 9 days later at 11:24 PT on September 20, 2023. Thanks for playing!