// First-session explainer: what the four grading buttons actually do.
// Re-openable from the Home screen link, not just shown once and forgotten.
import { COLORS } from "../styles/theme";

export function IntroModal({ onConfirm }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(35,38,43,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50,
    }}>
      <div style={{
        background: COLORS.washi, borderRadius: 18, padding: 28, maxWidth: 420,
        border: `1px solid ${COLORS.line}`, boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}>
        <div style={{ fontFamily: "'Shippori Mincho B1', serif", fontWeight: 800, fontSize: 22, color: COLORS.indigoDeep, marginBottom: 14 }}>
          How a card works
        </div>
        <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 14, color: COLORS.ink, lineHeight: 1.7, display: "flex", flexDirection: "column", gap: 12 }}>
          <div><b>1. Try to recall first.</b> When the character appears, say the sound in your head before doing anything else.</div>
          <div><b>2. Reveal to check.</b> Tap the card to see if you were right.</div>
          <div><b>3. Grade what you knew before revealing</b> — not how obvious it feels after:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 4 }}>
            <div>• <b style={{ color: COLORS.inkSoft }}>Forgot</b> — blank, or you guessed → shows again right away</div>
            <div>• <b style={{ color: COLORS.gold }}>Hard</b> — got it, but slowly → shows again soon</div>
            <div>• <b style={{ color: COLORS.moss }}>Good</b> — recalled it cleanly → comes back in a few days</div>
            <div>• <b style={{ color: COLORS.indigo }}>Easy</b> — instant, zero doubt → comes back in weeks</div>
          </div>
          <div style={{ fontSize: 13, color: COLORS.inkSoft }}>
            The buttons control your review schedule, not a score. Grading generously just means weak characters
            get pushed away before they are actually locked in.
          </div>
        </div>
        <button onClick={onConfirm} style={{
          marginTop: 20, width: "100%", padding: "12px 20px", borderRadius: 12, border: "none",
          background: COLORS.indigo, color: COLORS.washi, fontFamily: "'Work Sans', sans-serif",
          fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>
          Got it — start practice
        </button>
      </div>
    </div>
  );
}
