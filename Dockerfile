FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
ENTRYPOINT ["bun", "run", "start"]
# docker build -t epyc-discord . && docker run -d --rm --name epyc --env-file=.env.local epyc-discord && docker logs -f epyc`