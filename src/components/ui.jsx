// Small shared UI primitives used across several views.
import { COLORS } from "../styles/theme";

export function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: 999,
        border: `1px solid ${active ? COLORS.indigo : COLORS.line}`,
        background: active ? COLORS.indigo : "transparent",
        color: active ? COLORS.washi : COLORS.ink,
        fontFamily: "'Work Sans', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ percent, color }) {
  return (
    <div style={{ height: 8, borderRadius: 999, background: COLORS.line, overflow: "hidden" }}>
      <div style={{
        width: `${Math.max(0, Math.min(100, percent))}%`,
        height: "100%",
        background: color,
        borderRadius: 999,
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}

export function Stamp({ show }) {
  return (
    <div style={{
      position: "absolute", top: -18, right: -18,
      width: 72, height: 72,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: "50%",
      border: `3px solid ${COLORS.vermillion}`,
      color: COLORS.vermillion,
      fontFamily: "'Noto Sans JP', sans-serif",
      fontWeight: 800,
      fontSize: 22,
      background: "rgba(242,236,221,0.9)",
      opacity: show ? 1 : 0,
      transform: show ? "scale(1) rotate(-12deg)" : "scale(1.6) rotate(-12deg)",
      transition: "opacity 0.25s ease, transform 0.25s cubic-bezier(.2,1.4,.4,1)",
      pointerEvents: "none",
    }}>良</div>
  );
}
