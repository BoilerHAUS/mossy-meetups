# Mossy Meetups

> **Private group planning for music-loving campers.**
> Coordinate dates, collect RSVPs, and share calendars — no spreadsheets, no group texts.

---

## What is this?

Mossy Meetups is a private web app built for music-loving families and friend groups (Dead-head / festival culture) who need a better way to plan camping trips together. It replaces the endless group-chat thread with a focused tool:

- **Week view** of upcoming events across all your groups
- **Date & location voting** — members propose options, the group votes, the admin confirms
- **RSVPs** with live counts on every event card
- **Magic-link auth** — no passwords, no anonymous access
- **Calendar export** — `.ics` download for every confirmed event

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 13 (pages router) + React 18 |
| Styling | Tailwind CSS 3 + styled-jsx |
| Fonts | Fraunces (display) + Inter (body) via `next/font` |
| Auth | NextAuth.js — magic-link email |
| ORM | Prisma 4 |
| Database | PostgreSQL 16 |
| Deployment | Dokploy + Docker on `moss.boilerhaus.org` |
| CI | GitHub Actions — lint + test on every push to `main` |
| Testing | Vitest + React Testing Library + Playwright |

---

## Getting started

### Prerequisites

- Node 20 LTS
- Docker + Docker Compose (for local DB)
- An SMTP server or Resend account (for magic-link email)

### Local setup

```bash
# 1. Clone and install
git clone <repo-url>
cd mossy-meetups
npm ci

# 2. Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, EMAIL_SERVER, EMAIL_FROM

# 3. Start the database
docker compose up -d db

# 4. Run migrations
npx prisma migrate dev

# 5. Start the dev server
npm run dev
# → http://localhost:3000
```

### Docker Compose (full stack)

```bash
docker compose up --build
# App + Postgres start together; migrations run automatically
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Prisma connection string |
| `NEXTAUTH_URL` | Yes | Full public URL (e.g. `https://moss.boilerhaus.org`) |
| `NEXTAUTH_SECRET` | Yes | Random 32-byte secret — `openssl rand -base64 32` |
| `EMAIL_SERVER` | Yes | SMTP URL — `smtp://user:pass@host:587` |
| `EMAIL_FROM` | Yes | Sender address — `noreply@boilerhaus.org` |

Never commit real values. Use a secrets manager or Dokploy environment variable injection.

---

## Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm test             # Vitest unit + integration tests
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Playwright E2E tests
npm run prisma:generate   # Regenerate Prisma client
```

---

## Project structure

```
src/
  components/       UI components (AppShell, EventCard, WeekView, Logo, ...)
  lib/              Server utilities (auth, prisma, home-data, rate-limit, ...)
  pages/            Next.js pages + API routes
    api/            REST handlers (groups, events, rsvps, invites, ...)
  styles/           globals.css — CSS custom properties + Tailwind base
  __tests__/        Vitest unit + integration tests

e2e/                Playwright E2E tests
prisma/             Schema + migrations
branding/           Brand guidelines
docs/               Roadmap + architecture notes
```

---

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for the full phased plan.

| Phase | Goal | Status |
|---|---|---|
| 0 | Deployment stable | done |
| 1 | Magic-link auth | done |
| 1.5 | User profiles | done |
| 2 | Group membership + invites | done |
| 3 | RSVP flow | done |
| 4 | WeekView + core UI | done |
| 5 | Date & location voting + calendar export | done |
| 6 | Test suite & hardening | done |
| 7 | Design polish | done |

---

## Design system

The project uses CSS custom properties for all brand tokens defined in [src/styles/globals.css](src/styles/globals.css). A `[data-theme="light"]` override enables the light mode variant. Toggle with the sun/moon button in the nav bar.

**Core palette:**

| Token | Dark | Light | Use |
|---|---|---|---|
| `--accent` | `#d7b97f` | `#D97706` | Links, CTAs, highlights |
| `--text` | `#f3ebdc` | `#1A1A18` | Body text |
| `--text-muted` | `#c9c2b3` | `#5B5B58` | Secondary text |
| `--bg-card` | `rgba(13,28,23,.74)` | `rgba(255,255,255,.9)` | Cards + panels |
| `--border` | `rgba(243,235,220,.12)` | `rgba(26,26,24,.12)` | Borders |

**Typography:**
- Display headings — Fraunces (optical sizing, variable weight)
- Body — Inter

---

*Plan together. Camp together. Mossy vibes.*
