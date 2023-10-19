FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
RUN bunx prisma generate

ENTRYPOINT ["bun", "run", "bot"]

# docker build -t epyc-discord . && docker run -d -p 3000:3000 --rm --name epyc --env-file=.env.local epyc-discord && docker logs -f epyc