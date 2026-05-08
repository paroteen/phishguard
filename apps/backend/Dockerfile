FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared/package*.json ./packages/shared/
RUN npm install
COPY . .
RUN npm run build -w @phishguard/shared && npm run build -w @phishguard/backend

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app
WORKDIR /app/apps/backend
EXPOSE 4000
CMD ["npm", "run", "start"]
