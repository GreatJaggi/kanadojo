import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { loadKey, saveKey, K_PROGRESS, K_STATS, K_SETTINGS, K_DRILL_STATS } from "./lib/storage";
import { gradeCard, shuffle, MASTER_LEVEL, DAY_MS } from "./lib/srs";
import { DECKS, cardId } from "./data/decks";
import { COLORS } from "./styles/theme";
import { pageStyle, FontImport, GlobalStyle } from "./components/GlobalStyles";
import { IntroModal } from "./components/IntroModal";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { Study } from "./components/Study";
import { Drill } from "./components/Drill";
import { DrillSummary } from "./components/DrillSummary";
import { Chart } from "./components/Chart";
import { Stats } from "./components/Stats";

export default function KanaDojo() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState({ streakDays: 0, lastStudyDate: null, totalReviews: 0 });
  const [settings, setSettings] = useState({ scripts: ["hiragana"], voiced: false, direction: "kana", seenIntro: false });
  const [drillStats, setDrillStats] = useState({ sessionsCompleted: 0, bestCpm: 0, bestAccuracy: 0, bestStreak: 0, history: [] });

  const [view, setView] = useState("home");
  const [session, setSession] = useState(null); // {queue, index, revealed, results, stamp}
  const [drill, setDrill] = useState(null); // {card, dir, revealed, attempts, correct, streak, bestStreak, startTime}
  const [showIntro, setShowIntro] = useState(false);
  const pendingSessionRef = useRef(null);

  useEffect(() => {
    (async () => {
      const [p, s, st, ds] = await Promise.all([
        loadKey(K_PROGRESS, {}),
        loadKey(K_STATS, { streakDays: 0, lastStudyDate: null, totalReviews: 0 }),
        loadKey(K_SETTINGS, { scripts: ["hiragana"], voiced: false, direction: "kana", seenIntro: false }),
        loadKey(K_DRILL_STATS, { sessionsCompleted: 0, bestCpm: 0, bestAccuracy: 0, bestStreak: 0, history: [] }),
      ]);
      setProgress(p); setStats(s); setSettings(st); setDrillStats(ds);
      setLoaded(true);
    })();
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      saveKey(K_SETTINGS, next);
      return next;
    });
  }, []);

  const fullDeck = useMemo(() => {
    let cards = [];
    settings.scripts.forEach(script => {
      cards = cards.concat(DECKS[script].seion);
      if (settings.voiced) cards = cards.concat(DECKS[script].voiced);
    });
    return cards;
  }, [settings.scripts, settings.voiced]);

  const deckStatsByScript = useMemo(() => {
    const out = {};
    ["hiragana", "katakana"].forEach(script => {
      const cards = DECKS[script].seion.concat(settings.voiced ? DECKS[script].voiced : []);
      let mastered = 0;
      cards.forEach(card => {
        const p = progress[cardId(card)];
        if (p && p.level >= MASTER_LEVEL) mastered++;
      });
      out[script] = { total: cards.length, mastered };
    });
    return out;
  }, [progress, settings.voiced]);

  const groupStatsByScript = useMemo(() => {
    const out = {};
    ["hiragana", "katakana"].forEach(script => {
      const groups = [];
      const byRow = new Map();
      DECKS[script].seion.forEach(card => {
        if (!byRow.has(card.row)) { byRow.set(card.row, []); groups.push(card.row); }
        byRow.get(card.row).push(card);
      });
      out[script] = groups.map(label => {
        const cards = byRow.get(label);
        const cells = cards.map(card => ({ c: card.c, r: card.r, level: progress[cardId(card)]?.level }));
        const pct = Math.round(
          (cells.reduce((sum, cell) => sum + Math.min(cell.level ?? 0, MASTER_LEVEL), 0) / (cells.length * MASTER_LEVEL)) * 100
        );
        return { label, pct, cells, cards };
      });
    });
    return out;
  }, [progress]);

  const dueCount = useMemo(() => {
    const now = Date.now();
    let due = 0, fresh = 0;
    fullDeck.forEach(card => {
      const p = progress[cardId(card)];
      if (!p) fresh++;
      else if (p.nextReview <= now) due++;
    });
    return { due, fresh };
  }, [fullDeck, progress]);

  const persistProgress = useCallback((next) => {
    setProgress(next);
    saveKey(K_PROGRESS, next);
  }, []);

  const endSession = useCallback((finalResults) => {
    const today = new Date().toDateString();
    setStats(prev => {
      let streakDays = prev.streakDays || 0;
      if (prev.lastStudyDate !== today) {
        const yesterday = new Date(Date.now() - DAY_MS).toDateString();
        streakDays = prev.lastStudyDate === yesterday ? streakDays + 1 : 1;
      }
      const next = {
        streakDays,
        lastStudyDate: today,
        totalReviews: (prev.totalReviews || 0) + finalResults.length,
      };
      saveKey(K_STATS, next);
      return next;
    });
  }, []);

  function buildQueue(cards, limit) {
    const now = Date.now();
    const due = [], fresh = [];
    cards.forEach(card => {
      const p = progress[cardId(card)];
      if (!p) fresh.push(card);
      else if (p.nextReview <= now) due.push(card);
    });
    due.sort((a, b) => (progress[cardId(a)].nextReview) - (progress[cardId(b)].nextReview));
    let queue = due.slice(0, limit);
    // `fresh` is already in gojūon row order (a-row, k-row, s-row...) because it's built by filtering
    // `cards`, which preserves DECKS' row order — so new characters are introduced in the conventional
    // teaching order instead of scattered randomly across the whole script. The final shuffle() below
    // still randomizes on-screen presentation order within a session.
    if (queue.length < limit) queue = queue.concat(fresh.slice(0, limit - queue.length));
    if (queue.length === 0) {
      // nothing due, nothing new — offer a light review of the shakiest cards
      const ranked = [...cards].sort((a, b) => (progress[cardId(a)]?.level ?? 0) - (progress[cardId(b)]?.level ?? 0));
      queue = ranked.slice(0, Math.min(limit, ranked.length));
    }
    return shuffle(queue);
  }

  const actuallyStartSession = useCallback((mode, extraCards) => {
    let cards;
    if (mode === "row" && extraCards) {
      cards = extraCards;
    } else {
      cards = buildQueue(fullDeck, 16);
    }
    if (cards.length === 0) { setView("home"); return; }
    const direction = cards.map(() =>
      settings.direction === "mixed" ? (Math.random() < 0.5 ? "kana" : "romaji") : settings.direction
    );
    setSession({ queue: cards, dir: direction, index: 0, revealed: false, results: [], stamp: false, hintUsed: false });
    setView("study");
  }, [fullDeck, settings.direction, progress]);

  const startSession = useCallback((mode, extraCards) => {
    if (!settings.seenIntro) {
      pendingSessionRef.current = { mode, extraCards };
      setShowIntro(true);
      return;
    }
    actuallyStartSession(mode, extraCards);
  }, [settings.seenIntro, actuallyStartSession]);

  const confirmIntro = useCallback(() => {
    setShowIntro(false);
    updateSettings({ seenIntro: true });
    const pending = pendingSessionRef.current;
    pendingSessionRef.current = null;
    if (pending) actuallyStartSession(pending.mode, pending.extraCards);
  }, [updateSettings, actuallyStartSession]);

  const grade = useCallback((g) => {
    if (!session) return;
    const card = session.queue[session.index];
    const id = cardId(card);
    const prevProgEntry = progress[id]; // snapshot before this grade, for undo
    const newProg = gradeCard(prevProgEntry, g);
    const nextProgress = { ...progress, [id]: newProg };

    let nextQueue = session.queue;
    let nextDir = session.dir;
    if (g === "forgot") {
      // requeue a few cards later in the same session for immediate reinforcement
      nextQueue = [...session.queue];
      nextDir = [...session.dir];
      const insertAt = Math.min(nextQueue.length, session.index + 4);
      nextQueue.splice(insertAt, 0, card);
      nextDir.splice(insertAt, 0, nextDir[session.index]);
    }

    persistProgress(nextProgress);
    const results = [...session.results, { id, grade: g }];
    const lastGrade = {
      id, prevProgEntry, grade: g,
      prevIndex: session.index, prevQueue: session.queue, prevDir: session.dir,
    };

    if (g !== "forgot") {
      setSession(prev => ({ ...prev, stamp: true }));
      setTimeout(() => {
        advance(nextQueue, nextDir, results, lastGrade);
      }, 420);
    } else {
      advance(nextQueue, nextDir, results, lastGrade);
    }

    function advance(q, d, res, lg) {
      const nextIndex = session.index + 1;
      if (nextIndex >= q.length) {
        endSession(res);
        setSession(null);
        setView("home");
      } else {
        setSession({ queue: q, dir: d, index: nextIndex, revealed: false, results: res, stamp: false, hintUsed: false, lastGrade: lg });
      }
    }
  }, [session, progress, persistProgress, endSession]);

  const undoLastGrade = useCallback(() => {
    setSession(prev => {
      if (!prev || !prev.lastGrade) return prev;
      const { id, prevProgEntry, prevIndex, prevQueue, prevDir } = prev.lastGrade;
      setProgress(currentProgress => {
        const nextProgress = { ...currentProgress };
        if (prevProgEntry === undefined) delete nextProgress[id];
        else nextProgress[id] = prevProgEntry;
        saveKey(K_PROGRESS, nextProgress);
        return nextProgress;
      });
      return {
        queue: prevQueue, dir: prevDir, index: prevIndex,
        revealed: true, results: prev.results.slice(0, -1),
        stamp: false, hintUsed: false, lastGrade: null,
      };
    });
  }, []);

  // ---- Drill mode: unlimited rapid-fire reps for in-session fluency. Deliberately does NOT
  // touch per-character SRS levels or nextReview dates — it's for speed/accuracy right now,
  // not long-term retention tracking. Only feeds the daily streak + total-reviews counters. ----
  const pickDrillCard = useCallback((candidatePool) => {
    // Drill is meant to test recognition speed on characters already introduced via Practice,
    // not to introduce brand-new ones — so it draws from the "known" subset of the candidate pool
    // (the full deck by default, or a group-scoped selection when one was passed in), falling back
    // to the whole candidate pool only if nothing in it has been started yet.
    const base = candidatePool && candidatePool.length ? candidatePool : fullDeck;
    if (!base.length) return null;
    const known = base.filter(c => progress[cardId(c)]);
    const pool = known.length > 0 ? known : base;
    const card = pool[Math.floor(Math.random() * pool.length)];
    const dir = settings.direction === "mixed" ? (Math.random() < 0.5 ? "kana" : "romaji") : settings.direction;
    return { card, dir };
  }, [fullDeck, settings.direction, progress]);

  const startDrill = useCallback((pool) => {
    const picked = pickDrillCard(pool);
    if (!picked) return;
    setDrill({
      card: picked.card, dir: picked.dir, revealed: false,
      attempts: 0, correct: 0, streak: 0, bestStreak: 0, startTime: Date.now(), flagged: 0,
      pool: pool && pool.length ? pool : null,
    });
    setView("drill");
  }, [pickDrillCard]);

  const drillAnswer = useCallback((isCorrect) => {
    setDrill(prev => {
      if (!prev) return prev;
      let flagged = prev.flagged || 0;
      if (!isCorrect) {
        // A miss on a character that's already high-level (Review/Almost/Mastered) is exactly the
        // "was this real mastery or a lucky guess" signal — pull its next Practice check forward
        // instead of leaving it to sit untouched for days or weeks. This changes only the schedule,
        // never the level itself or the correct/incorrect tally, so it can't be used to fake a drop
        // any more than a hint-assisted answer could be used to fake a level-up.
        const answeredId = cardId(prev.card);
        const prog = progress[answeredId];
        if (prog && prog.level >= 3 && prog.nextReview > Date.now()) {
          const nextProgress = { ...progress, [answeredId]: { ...prog, nextReview: Date.now() } };
          persistProgress(nextProgress);
          flagged += 1;
        }
      }
      const attempts = prev.attempts + 1;
      const correct = prev.correct + (isCorrect ? 1 : 0);
      const streak = isCorrect ? prev.streak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, streak);
      const picked = pickDrillCard(prev.pool);
      return {
        ...prev, attempts, correct, streak, bestStreak, flagged,
        card: picked ? picked.card : prev.card,
        dir: picked ? picked.dir : prev.dir,
        revealed: false,
      };
    });
  }, [pickDrillCard, progress, persistProgress]);

  const endDrill = useCallback(() => {
    // Speed Drill still never touches SRS levels or the daily practice streak — those track spaced
    // long-term retention. But it deserves its own honest sense of progress, so personal bests and a
    // short history are tracked separately here, the way a typing test tracks WPM over time.
    setDrill(prev => {
      if (!prev || prev.attempts === 0) return prev;
      const elapsedMin = Math.max((Date.now() - prev.startTime) / 60000, 1 / 60);
      const cpm = Math.round((prev.attempts / elapsedMin) * 10) / 10;
      const accuracy = Math.round((prev.correct / prev.attempts) * 100);
      // snapshot the bests as they stood BEFORE this session, so the summary screen can compare
      // against the right baseline instead of the just-updated (already-merged) values
      const prevBests = { cpm: drillStats.bestCpm || 0, accuracy: drillStats.bestAccuracy || 0, streak: drillStats.bestStreak || 0 };
      const entry = { date: Date.now(), attempts: prev.attempts, accuracy, cpm, bestStreak: prev.bestStreak };
      const nextDrillStats = {
        sessionsCompleted: (drillStats.sessionsCompleted || 0) + 1,
        bestCpm: Math.max(prevBests.cpm, cpm),
        bestAccuracy: Math.max(prevBests.accuracy, accuracy),
        bestStreak: Math.max(prevBests.streak, prev.bestStreak),
        history: [...(drillStats.history || []), entry].slice(-20),
      };
      saveKey(K_DRILL_STATS, nextDrillStats);
      setDrillStats(nextDrillStats);
      return { ...prev, prevBests };
    });
    setView("drillSummary");
  }, [drillStats]);

  const revealDrill = useCallback(() => {
    setDrill(prev => prev ? { ...prev, revealed: true } : prev);
  }, []);

  // keyboard shortcuts during study
  useEffect(() => {
    if (view !== "study" || !session) return;
    function onKey(e) {
      if (!session.revealed) {
        if (e.code === "Space" || e.key === "Enter") {
          e.preventDefault();
          setSession(prev => ({ ...prev, revealed: true }));
        }
        return;
      }
      if (e.key === "1") grade("forgot");
      if (e.key === "2") grade("hard");
      if (e.key === "3") grade("good");
      if (e.key === "4") grade("easy");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, session, grade]);

  if (!loaded) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <FontImport />
        <div style={{ color: COLORS.inkSoft, fontFamily: "'Work Sans', sans-serif" }}>Opening the dojo…</div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <FontImport />
      <GlobalStyle />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
        <Header stats={stats} view={view} setView={setView} />
        {view === "home" && (
          <Home
            settings={settings} updateSettings={updateSettings}
            deckStatsByScript={deckStatsByScript} groupStatsByScript={groupStatsByScript} dueCount={dueCount}
            startSession={startSession} setView={setView}
            reopenIntro={() => setShowIntro(true)}
            startDrill={startDrill}
            drillStats={drillStats}
          />
        )}
        {view === "study" && session && (
          <Study session={session} setSession={setSession} grade={grade} setView={setView} progress={progress} undoLastGrade={undoLastGrade} />
        )}
        {view === "drill" && drill && (
          <Drill drill={drill} drillAnswer={drillAnswer} endDrill={endDrill} revealDrill={revealDrill} setView={setView} />
        )}
        {view === "drillSummary" && drill && (
          <DrillSummary drill={drill} startDrill={startDrill} setView={setView} drillStats={drillStats} />
        )}
        {view === "chart" && (
          <Chart settings={settings} progress={progress} startSession={startSession} />
        )}
        {view === "stats" && (
          <Stats stats={stats} progress={progress} deckStatsByScript={deckStatsByScript}
            fullDeck={fullDeck} onReset={() => {
              if (window.confirm("Reset all kana progress? This cannot be undone.")) {
                persistProgress({});
              }
            }}
          />
        )}
      </div>
      {showIntro && <IntroModal onConfirm={confirmIntro} />}
    </div>
  );
}
