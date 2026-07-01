# Production image: Next.js + Prisma (SQLite). Mount a volume for DATABASE_URL (see DEPLOY.md).
FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
COPY . .

RUN npx prisma generate

ENV DATABASE_URL="file:./prisma/build-empty.db"
RUN npx prisma db push && npm run build && rm -f prisma/build-empty.db prisma/build-empty.db-journal

RUN mv scripts/docker-entrypoint.sh /entrypoint.sh && chmod +x /entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
