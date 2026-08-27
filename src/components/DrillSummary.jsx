import { COLORS } from "../styles/theme";
import { StatBox } from "./Stats";

export function DrillSummary({ drill, startDrill, setView, drillStats }) {
  const accuracy = drill.attempts > 0 ? Math.round((drill.correct / drill.attempts) * 100) : 0;
  const elapsedMin = Math.max((Date.now() - drill.startTime) / 60000, 1 / 60);
  const cpm = Math.round((drill.attempts / elapsedMin) * 10) / 10;

  const prevBests = drill.prevBests || { cpm: 0, accuracy: 0, streak: 0 };
  const newBests = [];
  if (cpm > prevBests.cpm) newBests.push("cards/min");
  if (accuracy > prevBests.accuracy) newBests.push("accuracy");
  if (drill.bestStreak > prevBests.streak) newBests.push("streak");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 20 }}>
      <div style={{ fontFamily: "'Shippori Mincho B1', serif", fontWeight: 700, fontSize: 24, color: COLORS.indigoDeep }}>
        Drill complete
      </div>
      {newBests.length > 0 && (
        <div style={{
          fontFamily: "'Work Sans', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.gold,
          border: `1px solid ${COLORS.gold}`, borderRadius: 999, padding: "6px 16px",
        }}>
          🎉 New personal best — {newBests.join(", ")}!
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: "100%", maxWidth: 360 }}>
        <StatBox label="Accuracy" value={`${accuracy}%`} />
        <StatBox label="Attempts" value={drill.attempts} />
        <StatBox label="Best streak" value={drill.bestStreak} />
        <StatBox label="Cards / min" value={cpm} />
      </div>
      {drill.flagged > 0 && (
        <div style={{
          fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: COLORS.gold, textAlign: "center", maxWidth: 320,
          border: `1px dashed ${COLORS.gold}`, borderRadius: 10, padding: "8px 12px",
        }}>
          {drill.flagged} character{drill.flagged > 1 ? "s" : ""} you'd already marked mastered slipped here \u2014
          rescheduled for an earlier check in Practice instead of waiting out the full interval.
        </div>
      )}
      <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: COLORS.inkSoft, textAlign: "center", maxWidth: 320 }}>
        Your speed/accuracy records are tracked and saved here, separately from the mastery tracker and
        your daily practice streak \u2014 drilling won't inflate either of those.
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setView("home")} style={{
          padding: "12px 22px", borderRadius: 12, border: `1px solid ${COLORS.line}`,
          background: "transparent", color: COLORS.ink, fontFamily: "'Work Sans', sans-serif",
          fontWeight: 600, fontSize: 14, cursor: "pointer",
        }}>
          Back home
        </button>
        <button onClick={startDrill} style={{
          padding: "12px 22px", borderRadius: 12, border: "none",
          background: COLORS.gold, color: COLORS.washi, fontFamily: "'Work Sans', sans-serif",
          fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>
          Drill again
        </button>
      </div>
    </div>
  );
}

