# PrimeInt

AI-powered mock interviews that feel real. Role-specific questions. Feedback that actually helps you improve.

## Stack

- **Next.js 15.3.1** · App Router · TypeScript strict
- **Tailwind v4** (`@tailwindcss/postcss`, CSS-first, no config file)
- **`next/font/google`** for Inter (replaces CDN link)
- **`pnpm`** lockfile committed

## Routes

| Route | Description |
|---|---|
| `/` | Landing page — hero, demo widget, features, how it works, waitlist CTA |
| `/try` | Mock session — pick a role (SWE, PM, Designer, Sales), answer 2 questions (1 behavioral + 1 technical), self-score against a 3-point rubric |
| `/api/waitlist` | POST `{ email }` → forwards to waitlist-api-sigma with `product: "primeint"` |

## Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy on [Vercel](https://vercel.com) — Next.js is auto-detected. No environment variables required. The waitlist API URL is public and hardcoded.

## Status

**v0 skeleton** — landing page ported from static `index.html`, `/try` page with mocked questions and rubric, waitlist API wired up. No AI calls, no auth, no database.
