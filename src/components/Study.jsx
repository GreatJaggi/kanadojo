import { COLORS } from "../styles/theme";
import { Stamp } from "./ui";
import { cardId } from "../data/decks";

export function Study({ session, setSession, grade, setView, progress, undoLastGrade }) {
  const card = session.queue[session.index];
  const dir = session.dir[session.index];
  const front = dir === "kana" ? card.c : card.r.toUpperCase();
  const back = dir === "kana" ? card.r : card.c;
  const isNew = !progress[cardId(card)];
  // kana→romaji: many mnemonics spell the romaji as wordplay ("a karate ka strike"), so a first-letter
  // nudge is used instead to avoid leaking the answer. romaji→kana: the mnemonic describes the shape to draw,
  // which isn't the literal answer in that direction, so it's safe to show in full.
  const hintText = dir === "kana" ? `Starts with "${card.r[0]}"…` : card.m;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setView("home")} style={{
          background: "none", border: "none", color: COLORS.inkSoft, fontFamily: "'Work Sans', sans-serif",
          fontSize: 13, cursor: "pointer", padding: 0,
        }}>← exit session</button>
        {session.lastGrade && (
          <button onClick={undoLastGrade} style={{
            background: "none", border: "none", color: COLORS.vermillion, fontFamily: "'Work Sans', sans-serif",
            fontSize: 12.5, cursor: "pointer", padding: 0, textDecoration: "underline",
          }}>↺ undo last grade</button>
        )}
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: COLORS.inkSoft }}>
          {session.index + 1} / {session.queue.length}
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <div
          onClick={() => !session.revealed && setSession(prev => ({ ...prev, revealed: true }))}
          style={{
            position: "relative",
            width: 240, height: 240,
            border: `2px solid ${COLORS.ink}`,
            borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.6)",
            cursor: session.revealed ? "default" : "pointer",
          }}
        >
          {/* genkouyoushi corner ticks */}
          {[["-6px","-6px"],["calc(100% - 6px)","-6px"],["-6px","calc(100% - 6px)"],["calc(100% - 6px)","calc(100% - 6px)"]].map(([top,left], i) => (
            <div key={i} style={{ position: "absolute", top, left, width: 10, height: 10, borderTop: i<2?`1px solid ${COLORS.inkSoft}`:"none", borderBottom: i>=2?`1px solid ${COLORS.inkSoft}`:"none", borderLeft: i%2===0?`1px solid ${COLORS.inkSoft}`:"none", borderRight: i%2===1?`1px solid ${COLORS.inkSoft}`:"none" }} />
          ))}
          <div style={{
            fontFamily: dir === "kana" ? "'Noto Sans JP', sans-serif" : "'Work Sans', sans-serif",
            fontWeight: dir === "kana" ? 400 : 700,
            fontSize: dir === "kana" ? 108 : 48,
            color: COLORS.ink,
          }}>
            {front}
          </div>
          <Stamp show={session.stamp} />
        </div>
        <div style={{
          position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)",
          background: card.script === "hiragana" ? COLORS.indigo : COLORS.vermillion,
          color: COLORS.washi, fontSize: 11, padding: "3px 10px", borderRadius: 999,
          fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1, textTransform: "uppercase",
        }}>
          {card.script}{isNew ? " · new" : ""}
        </div>
      </div>

      {!session.revealed ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{
            fontFamily: "'Work Sans', sans-serif", fontSize: 13, color: COLORS.inkSoft,
            textAlign: "center", maxWidth: 320, lineHeight: 1.5,
          }}>
            Say the {dir === "kana" ? "sound" : "character"} in your head first. Then reveal to check yourself.
          </div>
          {session.hintUsed && (
            <div style={{
              fontFamily: "'Work Sans', sans-serif", fontSize: 12.5, color: COLORS.gold,
              textAlign: "center", maxWidth: 300, lineHeight: 1.5, fontStyle: "italic",
              border: `1px dashed ${COLORS.gold}`, borderRadius: 10, padding: "8px 12px",
            }}>
              {hintText}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            {!session.hintUsed && (
              <button
                onClick={() => setSession(prev => ({ ...prev, hintUsed: true }))}
                style={{
                  padding: "12px 20px", borderRadius: 12, border: `1px solid ${COLORS.gold}`,
                  background: "transparent", color: COLORS.gold, fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                }}
              >
                Need a hint?
              </button>
            )}
            <button
              onClick={() => setSession(prev => ({ ...prev, revealed: true }))}
              style={{
                padding: "12px 28px", borderRadius: 12, border: `1px solid ${COLORS.ink}`,
                background: "transparent", color: COLORS.ink, fontFamily: "'Work Sans', sans-serif",
                fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}
            >
              Reveal answer
            </button>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, color: COLORS.indigoDeep, fontWeight: 500 }}>
              {back}
            </div>
            <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 14, color: COLORS.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
              {card.m}
            </div>
            {card.w && (
              <div style={{
                fontFamily: "'Work Sans', sans-serif", fontSize: 13, color: COLORS.moss, marginTop: 8,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <span style={{ fontSize: 17 }}>{card.e}</span>
                <span>
                  <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 15 }}>{card.w}</span>
                  {" "}starts with this sound
                </span>
              </div>
            )}
            {card.confusedWith && card.confusedWith.length > 0 && (
              <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: COLORS.vermillion, marginTop: 6 }}>
                Often confused with {card.confusedWith.join(", ")}
              </div>
            )}
          </div>

          <div style={{
            fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: COLORS.inkSoft,
            textAlign: "center",
          }}>
            Be honest about <b>before</b> you revealed it, not after — it always looks obvious in hindsight.
          </div>

          {session.hintUsed && (
            <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11.5, color: COLORS.gold, textAlign: "center" }}>
              Hint used this round — "Easy" is off the table, since it wasn't from cold memory.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, width: "100%" }}>
            {[
              ["forgot", "Forgot", COLORS.inkSoft, "Blank / guessed", "see it again now"],
              ["hard", "Hard", COLORS.gold, "Got there slowly", "see it again soon"],
              ["good", "Good", COLORS.moss, "Recalled it fine", "back in a few days"],
              ["easy", "Easy", COLORS.indigo, "Instant, no doubt", "back in weeks"],
            ].map(([key, label, color, when, next]) => {
              const disabled = key === "easy" && session.hintUsed;
              return (
                <button key={key} onClick={() => !disabled && grade(key)} disabled={disabled} style={{
                  padding: "10px 6px", borderRadius: 10, border: `1px solid ${disabled ? COLORS.line : color}`,
                  background: "transparent", color: disabled ? COLORS.line : color, fontFamily: "'Work Sans', sans-serif",
                  cursor: disabled ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", gap: 4, alignItems: "center",
                  opacity: disabled ? 0.6 : 1,
                }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{label}</span>
                  <span style={{ fontSize: 10, color: disabled ? COLORS.line : COLORS.inkSoft, textAlign: "center", lineHeight: 1.3 }}>{when}</span>
                  <span style={{ fontSize: 9, color: disabled ? COLORS.line : color, opacity: 0.8, textAlign: "center", lineHeight: 1.3 }}>{next}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

