FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
RUN bunx prisma generate
ENTRYPOINT ["bun", "run", "start"]
# docker build -t epyc-discord . && docker run -d --rm --name epyc --env-file=.env.local epyc-discord && docker logs -f epyc`