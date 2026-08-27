import { COLORS, levelColor } from "../styles/theme";
import { MASTER_LEVEL } from "../lib/srs";

export function Stats({ stats, progress, deckStatsByScript, fullDeck, onReset }) {
  const levelCounts = [0, 1, 2, 3, 4, 5].map(lvl =>
    Object.values(progress).filter(p => p.level === lvl).length
  );
  const maxCount = Math.max(1, ...levelCounts);

  const trickiest = Object.entries(progress)
    .map(([id, p]) => ({ id, ...p }))
    .filter(p => p.incorrect > 0)
    .sort((a, b) => b.incorrect - a.incorrect)
    .slice(0, 6);

  const mastered = Object.entries(progress)
    .filter(([, p]) => p.level >= MASTER_LEVEL)
    .map(([id]) => ({ id, script: id.split(":")[0], char: id.split(":")[1] }))
    .sort((a, b) => a.script === b.script ? a.char.localeCompare(b.char) : a.script.localeCompare(b.script));
  const masteredHira = mastered.filter(m => m.script === "hiragana");
  const masteredKata = mastered.filter(m => m.script === "katakana");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <StatBox label="Current streak" value={`${stats.streakDays || 0}d`} />
        <StatBox label="Total reviews" value={stats.totalReviews || 0} />
      </div>

      <div>
        <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
          Mastery distribution
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
          {levelCounts.map((count, lvl) => (
            <div key={lvl} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: "100%", background: levelColor(lvl),
                height: `${(count / maxCount) * 80}px`, minHeight: count > 0 ? 4 : 0,
                borderRadius: "4px 4px 0 0",
              }} />
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: COLORS.inkSoft }}>{count}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.inkSoft, fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
          <span>new</span><span>mastered</span>
        </div>
      </div>

      {mastered.length > 0 && (
        <div>
          <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
            Mastered characters ({mastered.length})
          </div>
          {[["Hiragana", masteredHira], ["Katakana", masteredKata]].map(([label, list]) => (
            list.length > 0 && (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: COLORS.inkSoft, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                  {label} ({list.length})
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {list.map(m => (
                    <div key={m.id} style={{
                      width: 34, height: 34, borderRadius: 8, border: `2px solid ${COLORS.vermillion}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Noto Sans JP', sans-serif", fontSize: 17, background: "rgba(255,255,255,0.5)",
                    }}>
                      {m.char}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {trickiest.length > 0 && (
        <div>
          <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
            Trickiest characters
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {trickiest.map(t => (
              <div key={t.id} style={{
                border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: "8px 12px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 20 }}>{t.id.split(":")[1]}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: COLORS.vermillion }}>{t.incorrect}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onReset} style={{
        alignSelf: "flex-start", background: "none", border: `1px solid ${COLORS.line}`,
        borderRadius: 10, padding: "8px 14px", fontSize: 12, color: COLORS.inkSoft, cursor: "pointer",
        fontFamily: "'Work Sans', sans-serif",
      }}>
        Reset all progress
      </button>
    </div>
  );
}

export function StatBox({ label, value }) {
  return (
    <div style={{ border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 16, background: "rgba(255,255,255,0.5)" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 500, color: COLORS.indigoDeep }}>{value}</div>
      <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: COLORS.inkSoft }}>{label}</div>
    </div>
  );
}
