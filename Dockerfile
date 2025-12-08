# -------- Base image for dependencies --------
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./


COPY prisma ./prisma
COPY prisma.config.ts ./


RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm ci

# -------- Builder image --------
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules

COPY . .



RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Build Next.js app
RUN npm run build

# -------- Runner image --------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache openssl


COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src ./src

# Copy config files
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/tsconfig.* ./

EXPOSE 3000
CMD ["npm", "run", "start"]