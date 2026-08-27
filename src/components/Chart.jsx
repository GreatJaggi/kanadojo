import { useState } from "react";
import { COLORS, levelColor } from "../styles/theme";
import { HIRAGANA_ROWS } from "../data/hiragana";
import { KATAKANA_ROWS } from "../data/katakana";
import { Chip, LegendDot } from "./ui";

export function Chart({ settings, progress, startSession }) {
  const [script, setScript] = useState(settings.scripts[0] || "hiragana");
  const rows = script === "hiragana" ? HIRAGANA_ROWS : KATAKANA_ROWS;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["hiragana", "katakana"].map(s => (
          <Chip key={s} active={script === s} onClick={() => setScript(s)}>{s}</Chip>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map(row => {
          const rowCards = row.cells.filter(Boolean).map(cell => ({ c: cell.c, r: cell.r, m: cell.m, row: row.label, script, level: "seion" }));
          return (
            <div key={row.label} className="kd-chart-row">
              <div className="kd-chart-cells">
                {row.cells.map((cell, i) => {
                  if (!cell) return <div key={i} className="kd-chart-cell" style={{ aspectRatio: "1" }} />;
                  const p = progress[`${script}:${cell.c}`];
                  return (
                    <div key={i} className="kd-chart-cell" title={`${cell.c} — ${cell.r}\n${cell.m}${cell.w ? `\n${cell.e} ${cell.w}` : ""}`} style={{
                      position: "relative",
                      borderRadius: 8,
                      border: `2px solid ${levelColor(p?.level)}`,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      background: "rgba(255,255,255,0.5)",
                    }}>
                      {cell.e && (
                        <span style={{ position: "absolute", top: 2, right: 3, fontSize: 10, opacity: 0.75 }}>{cell.e}</span>
                      )}
                      <div className="kd-chart-cell-char" style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 24 }}>{cell.c}</div>
                      <div className="kd-chart-cell-romaji" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: COLORS.inkSoft }}>{cell.r}</div>
                    </div>
                  );
                })}
              </div>
              {rowCards.length > 0 && (
                <button className="kd-drill-btn" onClick={() => startSession("row", rowCards)} style={{
                  border: `1px solid ${COLORS.line}`, background: "transparent", borderRadius: 8,
                  padding: "6px 10px", fontSize: 11, color: COLORS.inkSoft, cursor: "pointer",
                  fontFamily: "'Work Sans', sans-serif",
                }}>
                  drill row
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20, fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: COLORS.inkSoft, display: "flex", gap: 14, flexWrap: "wrap" }}>
        <LegendDot color={levelColor(undefined)} label="Not started" />
        <LegendDot color={levelColor(0)} label="New" />
        <LegendDot color={levelColor(2)} label="Learning" />
        <LegendDot color={levelColor(4)} label="Strong" />
        <LegendDot color={levelColor(5)} label="Mastered" />
      </div>
    </div>
  );
}
