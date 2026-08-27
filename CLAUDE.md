# Kanaflow — project context

(Renamed from "Kana Dojo" — that name was already taken elsewhere. The
`kanadojo:*` localStorage key prefix in `lib/storage.js` was deliberately left
unchanged during the rename, since renaming it would silently drop anyone's
existing saved progress on next load.)

A spaced-repetition trainer for hiragana and katakana, built as a React + Vite
single-page app. This file exists so Claude Code has the architecture and
design decisions up front instead of rediscovering them from scratch.

## Status as of hand-off — start here

**What's verified:** this project was just split out of a single-file
prototype into the module structure below. `npm install` and `npm run build`
both succeed cleanly from scratch (checked twice), and `npm run dev` serves
correctly. That confirms every import/export between all ~20 files resolves
and the JSX is syntactically valid.

**What's NOT yet verified:** nobody has clicked through the running app in a
browser yet — not during the split, and not since. A clean build only proves
the wiring is correct, not that it behaves correctly at runtime. In
particular, `lib/storage.js` was rewritten from the original prototype's
`window.storage` API to real `localStorage` as part of this split — that
specific change has not been exercised interactively at all.

**Your first task, before adding anything new:** run `npm run dev` and do a
full interactive smoke test:
- Home → Start Practice → grade a few cards each way (Forgot/Hard/Good/Easy),
  try the hint button (confirm "Easy" becomes disabled after using it), try
  "↺ undo last grade"
- Home → Speed Drill → confirm live stats update, end a drill, confirm the
  summary screen and personal-bests panel on Home both update
- Chart and Stats views render and reflect what you just did
- **Reload the page** and confirm progress/settings/drill stats all persisted
  — this is the part most likely to have broken in the `window.storage` →
  `localStorage` swap, since it was never actually run, only built
- IntroModal appears on first Practice session, and "re-read how the buttons
  work" on Home reopens it

Fix anything that surfaces there before starting on the roadmap items below —
don't build on top of an unverified persistence layer.

## What this app does

- **Practice** (`components/Study.jsx`) — SM-2-ish spaced repetition. Grading a
  card (Forgot/Hard/Good/Easy) moves it through 6 levels (`lib/srs.js`,
  `INTERVAL_DAYS = [0, 1, 3, 7, 14, 30]` days). Level 5 = "mastered." This is
  the **only** thing that writes to a character's level/reps/correct/incorrect.
- **Speed Drill** (`components/Drill.jsx`, `components/DrillSummary.jsx`) —
  unlimited-rep fluency mode, separate purpose from Practice. Tracks its own
  personal-bests (cards/min, accuracy, streak) in a dedicated `drillstats` key.
  **Deliberately never touches SRS levels or the daily practice streak** — a
  miss on an already-"mastered" character only pulls its `nextReview` date
  forward (soft reschedule), it does not change the level itself. This was a
  deliberate design decision after early iterations let Drill inflate mastery
  numbers; don't reintroduce that coupling without a good reason.
- **Chart** (`components/Chart.jsx`) — full gojūon reference table, doubles as
  a progress heatmap via border color (`styles/theme.js` → `levelColor`).
- **Stats** (`components/Stats.jsx`) — mastery distribution, mastered-character
  list, trickiest characters (by incorrect count), streak, reset.

## Architecture

```
src/
  main.jsx              — ReactDOM root
  App.jsx                — top-level state, view routing, all the
                            start/grade/undo/drill callbacks
  data/
    hiragana.js           — HIRAGANA_ROWS (char/romaji/mnemonic/word/emoji),
                            HIRAGANA_VOICED
    katakana.js           — same shape, katakana
    decks.js              — builds seion/voiced card decks from the row data,
                            attaches confusedWith cross-refs, exports DECKS + cardId
  lib/
    srs.js                — the scheduling algorithm (gradeCard), shuffle()
    storage.js             — persistence adapter, see below
  styles/
    theme.js               — COLORS + levelColor()
  components/
    ui.jsx                 — Chip, ProgressBar, Stamp (small shared bits)
    GlobalStyles.jsx        — page background, Google Fonts import, global CSS
    IntroModal.jsx, Header.jsx, Home.jsx, Study.jsx, Drill.jsx,
    DrillSummary.jsx, Chart.jsx, Stats.jsx
```

Every character card carries: `c` (character), `r` (romaji), `m` (shape
mnemonic), `w`/`e` (acrophonic word + emoji, optional), `row`, `script`,
`confusedWith` (array of lookalike characters, shown as a note during Study —
there used to be a dedicated "drill lookalikes" mode but it was cut because
shuffling a filtered pool isn't actually the "interleave pairs" technique it
claimed to be; the personalized "Trickiest characters" stat in Stats.jsx does
this job better since it's based on real mistakes, not a hardcoded list).

## Storage — READ THIS BEFORE ADDING ACCOUNTS

`lib/storage.js` exports `loadKey(key, fallback)` / `saveKey(key, value)`,
both async, both currently backed by `window.localStorage`. This is a
deliberate seam: everything in the app calls these two functions and nothing
else touches storage directly. **When you add user accounts, this is the only
file that should need to change** — swap the `localStorage` calls for API
calls to your backend, keep the same async signatures, and the rest of the
app (progress tracking, settings, drill stats) should work unmodified.

Keys currently in use: `kanadojo:progress`, `kanadojo:stats`,
`kanadojo:settings`, `kanadojo:drillstats`. If you add per-user accounts,
these are the four things to key by user ID server-side.

## Roadmap / ideas from the person building this (not yet built)

These are captured here so context isn't lost between sessions — none of this
exists yet, it's intent:

1. **User accounts / identity**, so progress and drill stats sync across
   devices instead of living only in one browser's localStorage. Natural
   approach: auth provider (Clerk/Auth0/Supabase Auth are all reasonable,
   pick based on whether a Postgres-backed backend is wanted anyway for #2) +
   a backend endpoint that mirrors the `loadKey`/`saveKey` shape so
   `lib/storage.js` stays the only file that changes.
2. **Server-cached stats**, presumably riding on the same backend as #1 —
   move `progress`/`stats`/`drillstats` server-side, keyed by user, instead of
   (or in addition to) localStorage.
3. **Word-reading mechanics via an API** — reading real words/sentences built
   from kana, not just isolated characters. This is a genuinely different
   skill from character recognition (the app currently only drills isolated
   kana), so it likely wants its own view/mode rather than bolting onto
   Study or Drill. The existing `w`/`e` (acrophonic word) fields in the
   character data are a reasonable seed but only cover single words per
   character, not reading connected text. Open questions to ask the person
   building this before writing any code, since "based on what I already
   understood" left this genuinely underspecified:
   - Vocabulary source: a dictionary/JMdict-style lookup API, LLM-generated
     example sentences, or both?
   - Scope: single words first (extending the existing acrophonic word list),
     or full sentences from the start?
   - Does this need furigana/reading display, romaji, or both?
   - Should it feed into the same SRS levels as character Practice, or be
     tracked separately the way Speed Drill is (see the mastery-integrity
     notes above — this is the same category of design decision)?
   - Any API budget/rate-limit constraints if this calls an LLM per session?

None of this is fully specified — treat it as direction, not a spec. Ask
clarifying questions before building rather than guessing at scope.

## Design conventions to keep in mind

- Palette is intentionally not cream+terracotta (reads as a generic "AI app"
  look) — indigo is primary, vermillion is reserved for accents/mastery/
  warnings. See `styles/theme.js`.
- Fonts: Shippori Mincho B1 (kana display), Work Sans (UI text), IBM Plex Mono
  (numbers/stats), loaded via Google Fonts `@import` in `GlobalStyles.jsx`.
- No `localStorage`/`sessionStorage` calls outside `lib/storage.js`.
- Grading integrity matters more than convenience in this app — see the hint
  system (Study.jsx disables "Easy" for a round where a hint was used) and the
  Drill/SRS separation above. If a future feature could let a low-effort
  interaction fake a mastery signal, that's a bug, not a shortcut.

## Local development

```
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```
