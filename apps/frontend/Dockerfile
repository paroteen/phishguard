FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/shared/package*.json ./packages/shared/
RUN npm install
COPY . .
RUN npm run build -w @phishguard/shared && npm run build -w @phishguard/frontend

FROM node:20-alpine
WORKDIR /app/apps/frontend
COPY --from=builder /app /app
EXPOSE 3000
CMD ["npm", "run", "start"]
