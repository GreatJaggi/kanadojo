// Speed Drill: unlimited-rep fluency mode, deliberately separate from SRS
// mastery tracking. See lib/srs.js and App.jsx (drillAnswer/endDrill) for the
// "never fakes a level change, only reschedules a shaky 'mastered' card
// sooner in Practice" logic this component's UI is built around.
import { useState, useEffect } from "react";
import { COLORS } from "../styles/theme";

export function Drill({ drill, drillAnswer, endDrill, revealDrill, setView }) {
  const { card, dir, revealed, attempts, correct, streak, bestStreak, startTime, flagged } = drill;
  const front = dir === "kana" ? card.c : card.r.toUpperCase();
  const back = dir === "kana" ? card.r : card.c;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsedMin = Math.max((now - startTime) / 60000, 1 / 60);
  const cpm = attempts / elapsedMin;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={endDrill} style={{
          background: "none", border: "none", color: COLORS.vermillion, fontFamily: "'Work Sans', sans-serif",
          fontSize: 13, cursor: "pointer", padding: 0,
        }}>■ end drill</button>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: COLORS.inkSoft, display: "flex", gap: 12 }}>
          <span>{accuracy === null ? "—" : `${accuracy}%`}</span>
          <span>🔥{streak}</span>
          <span>{cpm.toFixed(1)}/min</span>
        </div>
      </div>
      {flagged > 0 && (
        <div style={{
          fontFamily: "'Work Sans', sans-serif", fontSize: 11, color: COLORS.gold,
          textAlign: "center", maxWidth: 300,
        }}>
          {flagged} "mastered" character{flagged > 1 ? "s" : ""} missed here — rescheduled sooner in Practice.
        </div>
      )}

      <div
        onClick={() => !revealed && revealDrill()}
        style={{
          position: "relative", width: 220, height: 220,
          border: `2px solid ${COLORS.ink}`, borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.6)", cursor: revealed ? "default" : "pointer",
        }}
      >
        <div style={{
          fontFamily: dir === "kana" ? "'Noto Sans JP', sans-serif" : "'Work Sans', sans-serif",
          fontWeight: dir === "kana" ? 400 : 700,
          fontSize: dir === "kana" ? 100 : 44,
          color: COLORS.ink,
        }}>
          {front}
        </div>
      </div>

      {!revealed ? (
        <button onClick={revealDrill} style={{
          padding: "12px 28px", borderRadius: 12, border: `1px solid ${COLORS.ink}`,
          background: "transparent", color: COLORS.ink, fontFamily: "'Work Sans', sans-serif",
          fontWeight: 600, fontSize: 14, cursor: "pointer",
        }}>
          Reveal
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, color: COLORS.indigoDeep }}>
            {back}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => drillAnswer(false)} style={{
              padding: "12px 24px", borderRadius: 12, border: `1px solid ${COLORS.inkSoft}`,
              background: "transparent", color: COLORS.inkSoft, fontFamily: "'Work Sans', sans-serif",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              ✗ Missed
            </button>
            <button onClick={() => drillAnswer(true)} style={{
              padding: "12px 24px", borderRadius: 12, border: `1px solid ${COLORS.moss}`,
              background: "transparent", color: COLORS.moss, fontFamily: "'Work Sans', sans-serif",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              ✓ Got it
            </button>
          </div>
        </div>
      )}

      <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, color: COLORS.inkSoft, textAlign: "center" }}>
        Best streak this session: {bestStreak}
      </div>
    </div>
  );
}
