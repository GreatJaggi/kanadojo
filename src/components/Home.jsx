import { COLORS } from "../styles/theme";
import { Chip, ProgressBar } from "./ui";

export function Home({ settings, updateSettings, deckStatsByScript, dueCount, startSession, reopenIntro, startDrill, drillStats }) {
  const toggleScript = (script) => {
    const has = settings.scripts.includes(script);
    let next = has ? settings.scripts.filter(s => s !== script) : [...settings.scripts, script];
    if (next.length === 0) next = [script]; // never allow empty
    updateSettings({ scripts: next });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{
        background: "rgba(255,255,255,0.55)", border: `1px solid ${COLORS.line}`,
        borderRadius: 18, padding: 24,
      }}>
        <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 15, color: COLORS.inkSoft, marginBottom: 14 }}>
          {dueCount.due > 0
            ? <>You have <b style={{ color: COLORS.ink }}>{dueCount.due}</b> characters ready for review.</>
            : dueCount.fresh > 0
              ? <>Nothing is due yet — <b style={{ color: COLORS.ink }}>{dueCount.fresh}</b> new characters waiting.</>
              : <>Everything is caught up. A light refresh session is ready when you want it.</>}
        </div>
        <button
          onClick={() => startSession("srs")}
          style={{
            width: "100%", padding: "16px 20px", borderRadius: 14, border: "none",
            background: COLORS.indigo, color: COLORS.washi,
            fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer",
            boxShadow: "0 4px 0 rgba(0,0,0,0.08)",
          }}
        >
          Start practice
        </button>
        <button
          onClick={startDrill}
          style={{
            width: "100%", marginTop: 10, padding: "12px 20px", borderRadius: 14,
            border: `1px solid ${COLORS.gold}`, background: "transparent", color: COLORS.gold,
            fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}
        >
          Speed drill (unlimited reps, no scheduling)
        </button>
        <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, color: COLORS.inkSoft, marginTop: 6, textAlign: "center" }}>
          Draws from characters you've already started. Never changes a mastery level or your streak —
          but a miss on a "mastered" one gets it rechecked sooner in Practice instead of waiting out the full interval.
        </div>
        {drillStats && drillStats.sessionsCompleted > 0 && (
          <div style={{
            marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.line}`,
            display: "flex", justifyContent: "space-around", textAlign: "center",
          }}>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: COLORS.gold, fontWeight: 600 }}>{drillStats.bestCpm}</div>
              <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 10, color: COLORS.inkSoft }}>best cards/min</div>
            </div>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: COLORS.gold, fontWeight: 600 }}>{drillStats.bestAccuracy}%</div>
              <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 10, color: COLORS.inkSoft }}>best accuracy</div>
            </div>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: COLORS.gold, fontWeight: 600 }}>{drillStats.bestStreak}</div>
              <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 10, color: COLORS.inkSoft }}>longest streak</div>
            </div>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: COLORS.gold, fontWeight: 600 }}>{drillStats.sessionsCompleted}</div>
              <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 10, color: COLORS.inkSoft }}>drills done</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {["hiragana", "katakana"].map(script => {
          const s = deckStatsByScript[script];
          const pct = s.total ? Math.round((s.mastered / s.total) * 100) : 0;
          return (
            <div key={script} style={{
              border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 16,
              background: settings.scripts.includes(script) ? "rgba(44,74,110,0.06)" : "transparent",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontFamily: "'Shippori Mincho B1', serif", fontWeight: 700, fontSize: 18, textTransform: "capitalize" }}>
                  {script}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: COLORS.inkSoft }}>
                  {s.mastered}/{s.total}
                </span>
              </div>
              <ProgressBar percent={pct} color={script === "hiragana" ? COLORS.indigo : COLORS.vermillion} />
              <div style={{ marginTop: 12 }}>
                <Chip active={settings.scripts.includes(script)} onClick={() => toggleScript(script)}>
                  {settings.scripts.includes(script) ? "Included" : "Include"}
                </Chip>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 13, color: COLORS.inkSoft }}>Direction:</span>
        {[["kana","Kana → romaji"],["romaji","Romaji → kana"],["mixed","Mixed"]].map(([k,label]) => (
          <Chip key={k} active={settings.direction === k} onClick={() => updateSettings({ direction: k })}>{label}</Chip>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 13, color: COLORS.inkSoft }}>Include voiced sounds (がざだば・ぱ):</span>
        <Chip active={settings.voiced} onClick={() => updateSettings({ voiced: !settings.voiced })}>
          {settings.voiced ? "On" : "Off"}
        </Chip>
      </div>

      <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.6 }}>
        Each character is reviewed on a schedule: the moment you start to forget it is when it comes back.
        Rate yourself honestly after each card — <b>Forgot</b> brings it back sooner, <b>Easy</b> pushes it further out.
        Keyboard: space to reveal, 1–4 to grade.{" "}
        <span onClick={reopenIntro} style={{ color: COLORS.indigo, textDecoration: "underline", cursor: "pointer" }}>
          Re-read how the buttons work.
        </span>
      </div>
    </div>
  );
}

