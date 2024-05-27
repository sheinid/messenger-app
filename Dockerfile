FROM node:alpine AS deps

RUN apk update && apk add --no-cache && apk add git
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --immutable

# Rebuild source code only when needed
FROM node:alpine AS builder

ARG NEXT_PUBLIC_BASE_URL

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:alpine AS runner
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY .env .
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/postcss.config.js ./postcss.config.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/typed-scss-modules.config.ts ./typed-scss-modules.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src

USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]
