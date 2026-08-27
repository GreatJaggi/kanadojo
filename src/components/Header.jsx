import { COLORS } from "../styles/theme";

export function Header({ stats, view, setView }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 2, color: COLORS.inkSoft, textTransform: "uppercase" }}>
          稽古場 · practice hall
        </div>
        <div
          onClick={() => setView("home")}
          style={{ fontFamily: "'Shippori Mincho B1', serif", fontWeight: 800, fontSize: 34, cursor: "pointer", color: COLORS.indigoDeep, lineHeight: 1.1 }}
        >
          Kanaflow
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: COLORS.gold,
          border: `1px solid ${COLORS.line}`, padding: "6px 12px", borderRadius: 999,
        }}>
          🔥 {stats.streakDays || 0} day{stats.streakDays === 1 ? "" : "s"}
        </div>
        {["chart", "stats"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            border: `1px solid ${view === v ? COLORS.indigo : COLORS.line}`,
            background: view === v ? COLORS.indigo : "transparent",
            color: view === v ? COLORS.washi : COLORS.ink,
            borderRadius: 999, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            {v === "chart" ? "Chart" : "Stats"}
          </button>
        ))}
      </div>
    </div>
  );
}

