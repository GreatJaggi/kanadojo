# Kana Dojo

A spaced-repetition trainer for hiragana and katakana — Practice mode for
building long-term mastery, Speed Drill for fluency and speed, plus a full
reference chart and stats.

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
```

Output goes to `dist/`. This is a static site — no server/backend required
in its current form, so it deploys to any static host.

## Deploying

Any static host works. Two of the simplest:

**Vercel**
```bash
npm i -g vercel
vercel
```
Framework preset: Vite. No configuration needed beyond that.

**Netlify**
- Build command: `npm run build`
- Publish directory: `dist`

Both auto-detect Vite projects from `package.json` if you connect the repo
through their dashboards instead of the CLI.

## Project structure

See `CLAUDE.md` for the full architecture breakdown, storage design, and the
roadmap notes (accounts, server-synced stats, word-reading mode) — that file
is written for picking this project back up in Claude Code.

## Data note

Right now all progress lives in the browser's `localStorage` — nothing syncs
across devices yet. `src/lib/storage.js` is the single seam designed to swap
in a real backend later without touching the rest of the app.
