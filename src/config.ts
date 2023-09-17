const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  SENTENCE_TIMEOUT,
  PICTURE_TIMEOUT,
  GAME_TIMEOUT,
} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  SENTENCE_TIMEOUT: parseInt(SENTENCE_TIMEOUT || "60"),
  PICTURE_TIMEOUT: parseInt(PICTURE_TIMEOUT || "60"),
  GAME_TIMEOUT: parseInt(GAME_TIMEOUT || "60"),
};
