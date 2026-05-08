# PhishGuard

PhishGuard is a defensive cybersecurity education platform for phishing awareness. Users can paste suspicious messages (SMS, email, WhatsApp, Telegram, etc.), detect malicious indicators, extract URLs, and review scan analytics.

## Stack

- Frontend: Next.js App Router, TypeScript, TailwindCSS, Zustand, React Query, Recharts, Framer Motion
- Backend: NestJS, Prisma, PostgreSQL, Redis, BullMQ, JWT auth, Swagger
- Infra: Docker, docker-compose, GitHub Actions CI

## Monorepo Structure

- `apps/frontend`: Next.js dashboard and scanner UI
- `apps/backend`: NestJS API, auth, scanner, admin
- `packages/shared`: shared types

## Defensive Scope

This project is for **defensive cybersecurity education only**. It does not generate offensive phishing tooling.

## Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Key integrations:

- `GOOGLE_SAFE_BROWSING_API_KEY`
- `VIRUSTOTAL_API_KEY`
- `URLSCAN_API_KEY`
- `OPENAI_API_KEY`

## Local Setup

```bash
npm install
npm run build -w @phishguard/shared
```

### Database

```bash
docker compose up -d postgres redis
npm run prisma:generate -w @phishguard/backend
npm run prisma:migrate -w @phishguard/backend
npm run prisma:seed -w @phishguard/backend
```

### Run apps

```bash
npm run dev:backend
npm run dev:frontend
```

Backend API: `http://localhost:4000/api`  
Swagger docs: `http://localhost:4000/api/docs`  
Frontend: `http://localhost:3000`

## Docker Full Stack

```bash
docker compose up --build
```

Services:

- frontend (`3000`)
- backend (`4000`)
- postgres (`5432`)
- redis (`6379`)

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/profile`

### Scanner
- `POST /api/scan/message`
- `POST /api/scan/url`
- `GET /api/scan/history`
- `GET /api/scan/:id`

### Admin
- `GET /api/admin/stats`
- `GET /api/admin/users`

## Features Implemented

- JWT auth (access + refresh)
- Role system (`admin`, `user`)
- Message scanning pipeline
- URL extraction and heuristic checks
- Phishing indicators and risk scoring (0-100)
- Classification (`Safe`, `Suspicious`, `Dangerous`)
- Async background jobs with BullMQ
- Scan history and analytics dashboard
- Swagger OpenAPI docs
- Rate limiting + helmet + validation

## Production Notes

- Use managed PostgreSQL and Redis
- Put backend behind reverse proxy (Nginx/Traefik)
- Configure HTTPS and CORS allow-list
- Rotate JWT secrets and API keys
- Add real API clients for Safe Browsing, VirusTotal, URLScan in `ScanService`
- Add SMTP config for dangerous scan email alerts

## Deployment

1. Build containers: `docker compose build`
2. Apply migrations on target DB
3. Start services with environment secrets
4. Expose `frontend` and `backend` through TLS ingress

## Vercel Prototype Deployment

Use Vercel for the frontend prototype and deploy backend separately (Railway/Render/Fly/VM).

1. Push this repo to GitHub.
2. In Vercel, import the repository.
3. Set **Root Directory** to `apps/frontend`.
4. Add env var in Vercel:
   - `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>/api`
5. Deploy.

The frontend is already App Router + TypeScript and is Vercel-ready.

## Bonus Roadmap

- WebSocket live scan updates
- Threat intelligence cache layer in Redis
- PDF report export
- PWA support
- Browser extension companion
