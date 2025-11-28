# ---------- 1. Builder ----------
FROM node:20 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---------- 2. Runner ----------
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["yarn", "start"]
