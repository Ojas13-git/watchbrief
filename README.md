# WatchBrief

Personal NSE watchlist + neutral AI research briefs for Indian equities.

Add tickers, generate a concise Markdown brief, and keep history — without buy/sell advice, fake live prices, or SEBI claims.

> **Not investment advice.** WatchBrief explains companies for learning. It has no market data feed and is not a SEBI-registered research product.

## Stack

| Layer | Tech |
|-------|------|
| **Client** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Clerk, Motion, Hugeicons |
| **Server** | Express 5, Prisma 7, Neon Postgres, Clerk JWT, Groq (Vercel AI SDK) |

```
watchbrief/
├── client/          # UI only (port 3000)
└── server/          # API + DB + LLM (port 4000)
```

## Features

- Public landing page (`/`) and auth-protected research desk (`/app`)
- Watchlist CRUD (max 10 symbols) with search and pagination
- Streaming AI briefs (Markdown) via Groq
- Brief history with search
- Clerk auth: browser sends Bearer JWT to the API

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 9+
- [Clerk](https://clerk.com) application (publishable + secret keys)
- [Neon](https://neon.tech) (or any Postgres) database
- [Groq](https://console.groq.com) API key

## Setup

### 1. Clone and install

```bash
cd server && pnpm install
cd ../client && pnpm install
```

### 2. Server env (`server/.env`)

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
GROQ_API_KEY=gsk_...
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

Run migrations and generate the Prisma client:

```bash
cd server
pnpm prisma:generate
pnpm prisma:migrate
```

### 3. Client env (`client/.env`)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Use the **same** Clerk app keys on client and server.

In the Clerk dashboard, set sign-in/sign-up redirect URLs to `/app` (or rely on the in-app `forceRedirectUrl`).

### 4. Run locally

Terminal 1 — API:

```bash
cd server && pnpm dev
```

Terminal 2 — UI:

```bash
cd client && pnpm dev
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Landing |
| http://localhost:3000/app | Research desk (signed in) |
| http://localhost:4000/health | API health check |

## API

All `/api/*` routes (except `/health`) require `Authorization: Bearer <Clerk JWT>`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness |
| `GET` | `/api/me` | Current user id |
| `GET` | `/api/watchlist` | List items (`q`, `page`, `pageSize`) |
| `POST` | `/api/watchlist` | Add symbol `{ "symbol": "RELIANCE" }` |
| `DELETE` | `/api/watchlist/:id` | Remove item |
| `POST` | `/api/brief` | Stream a brief for the current watchlist |
| `GET` | `/api/briefs` | Brief history (`q`, `page`, `pageSize`) |

Postman collection and local environment live under `server/postman/`.

## Scripts

**Server**

| Script | Action |
|--------|--------|
| `pnpm dev` | Watch mode (`tsx`) |
| `pnpm build` / `pnpm start` | Compile and run |
| `pnpm prisma:migrate` | Apply migrations |
| `pnpm prisma:generate` | Generate client |
| `pnpm prisma:studio` | DB browser |

**Client**

| Script | Action |
|--------|--------|
| `pnpm dev` | Next.js dev server |
| `pnpm build` / `pnpm start` | Production |
| `pnpm lint` | ESLint |

## Data model

- **WatchlistItem** — per-user symbol (unique on `userId` + `symbol`)
- **Brief** — stored Markdown content, symbols snapshot, model id, timestamp

## Product notes

- Briefs are **overview-only**: no buy/sell/hold, no invented LTP or % change
- Model: `openai/gpt-oss-20b` via Groq
- Client talks to Express only (`NEXT_PUBLIC_API_URL`); Next.js does not own the API

## License

Private / personal project — not licensed for redistribution unless you add one.
