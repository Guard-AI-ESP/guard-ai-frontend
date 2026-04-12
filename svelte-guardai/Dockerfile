# Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Run — serve le build SvelteKit avec node
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

ENV PORT=3000
EXPOSE 3000
CMD ["node", "build"]
