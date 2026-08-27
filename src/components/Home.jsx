import { useState } from "react";
import { COLORS, levelColor } from "../styles/theme";
import { Chip, ProgressBar, LegendDot } from "./ui";

export function Home({ settings, updateSettings, deckStatsByScript, groupStatsByScript, dueCount, startSession, reopenIntro, startDrill, drillStats }) {
  const toggleScript = (script) => {
    const has = settings.scripts.includes(script);
    let next = has ? settings.scripts.filter(s => s !== script) : [...settings.scripts, script];
    if (next.length === 0) next = [script]; // never allow empty
    updateSettings({ scripts: next });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 14, color: COLORS.inkSoft, lineHeight: 1.6, maxWidth: 560 }}>
        A spaced-repetition trainer for hiragana and katakana — practice a character, grade yourself
        honestly, and it comes back right before you'd forget it.
      </div>

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
          onClick={() => startDrill()}
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

      <GroupMastery groupStatsByScript={groupStatsByScript} startSession={startSession} startDrill={startDrill} />

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

function GroupMastery({ groupStatsByScript, startSession, startDrill }) {
  const [script, setScript] = useState("hiragana");
  const [openRow, setOpenRow] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const groups = groupStatsByScript[script];
  const accent = script === "hiragana" ? COLORS.indigo : COLORS.vermillion;

  const switchScript = (s) => {
    setScript(s);
    setOpenRow(null);
    setSelected(new Set());
  };

  const toggleSelected = (label) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label); else next.add(label);
      return next;
    });
  };

  const selectedCards = groups.filter(g => selected.has(g.label)).flatMap(g => g.cards);

  return (
    <div style={{
      background: "rgba(255,255,255,0.55)", border: `1px solid ${COLORS.line}`,
      borderRadius: 18, padding: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontFamily: "'Shippori Mincho B1', serif", fontWeight: 700, fontSize: 18 }}>Mastery by group</span>
        <div style={{ display: "flex", gap: 8 }}>
          {["hiragana", "katakana"].map(s => (
            <Chip key={s} active={script === s} onClick={() => switchScript(s)}>{s}</Chip>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
          marginBottom: 12, padding: "10px 14px", borderRadius: 10,
          background: "rgba(255,255,255,0.6)", border: `1px solid ${accent}`,
        }}>
          <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12.5, color: COLORS.ink }}>
            {selected.size} group{selected.size > 1 ? "s" : ""} selected · {selectedCards.length} characters
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => startSession("row", selectedCards)}
              style={{
                border: `1px solid ${accent}`, background: accent, color: COLORS.washi,
                borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                fontFamily: "'Work Sans', sans-serif", cursor: "pointer",
              }}
            >
              Practice selected →
            </button>
            <button
              onClick={() => startDrill(selectedCards)}
              style={{
                border: `1px solid ${COLORS.gold}`, background: "transparent", color: COLORS.gold,
                borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                fontFamily: "'Work Sans', sans-serif", cursor: "pointer",
              }}
            >
              Drill selected →
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {groups.map(group => {
          const isOpen = openRow === group.label;
          const isChecked = selected.has(group.label);
          return (
            <div key={group.label} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px 10px 10px" }}>
                <button
                  onClick={() => toggleSelected(group.label)}
                  aria-pressed={isChecked}
                  aria-label={`Select ${group.label}`}
                  style={{
                    width: 18, height: 18, flexShrink: 0, borderRadius: 5, cursor: "pointer",
                    border: `1.5px solid ${isChecked ? accent : COLORS.inkSoft}`,
                    background: isChecked ? accent : "transparent",
                    color: COLORS.washi, fontSize: 12, lineHeight: "16px",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                  }}
                >
                  {isChecked ? "✓" : ""}
                </button>
                <button
                  onClick={() => setOpenRow(isOpen ? null : group.label)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0,
                    background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0,
                  }}
                >
                  <span style={{
                    fontSize: 10, color: COLORS.inkSoft, flexShrink: 0,
                    transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s ease",
                  }}>▸</span>
                  <span style={{ fontFamily: "'Shippori Mincho B1', serif", fontWeight: 700, fontSize: 14, width: 56, flexShrink: 0 }}>
                    {group.label}
                  </span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar percent={group.pct} color={accent} />
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: COLORS.inkSoft, width: 36, textAlign: "right", flexShrink: 0 }}>
                    {group.pct}%
                  </span>
                </button>
              </div>
              {isOpen && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${group.cells.length}, 1fr)`, gap: 8, padding: "0 14px 14px" }}>
                  {group.cells.map(cell => (
                    <div key={cell.c} style={{
                      aspectRatio: "1", borderRadius: 8, border: `2px solid ${levelColor(cell.level)}`,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                      background: "rgba(255,255,255,0.5)",
                    }}>
                      <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 18 }}>{cell.c}</span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: COLORS.inkSoft }}>{cell.r}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 14, flexWrap: "wrap" }}>
        <LegendDot color={levelColor(undefined)} label="Not started" />
        <LegendDot color={levelColor(0)} label="New" />
        <LegendDot color={levelColor(2)} label="Learning" />
        <LegendDot color={levelColor(4)} label="Strong" />
        <LegendDot color={levelColor(5)} label="Mastered" />
      </div>
    </div>
  );
}

