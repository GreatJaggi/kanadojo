// Page background, Google Fonts import, and a few global CSS rules
// (focus rings, reduced-motion support). Rendered once at the App root.
import { COLORS } from "../styles/theme";

export const pageStyle = {
  minHeight: "100vh",
  background: COLORS.washi,
  backgroundImage: `
    linear-gradient(${COLORS.line} 1px, transparent 1px),
    linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)
  `,
  backgroundSize: "28px 28px",
  color: COLORS.ink,
};

export function FontImport() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;600;800&family=Noto+Sans+JP:wght@400;500;700&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
    `}</style>
  );
}


export function GlobalStyle() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      button { font-family: inherit; }
      button:focus-visible, [tabindex]:focus-visible { outline: 2px solid ${COLORS.indigo}; outline-offset: 2px; }
      .kd-chart-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .kd-chart-cells { display: flex; gap: 6px; flex: 1 1 auto; min-width: 0; }
      .kd-chart-cell { flex: 1 1 0; min-width: 0; max-width: 60px; aspect-ratio: 1; }
      .kd-drill-btn { flex-shrink: 0; }
      @media (max-width: 460px) {
        .kd-chart-cell { max-width: 44px; }
        .kd-chart-cell-char { font-size: 18px !important; }
        .kd-chart-cell-romaji { font-size: 9px !important; }
        .kd-drill-btn { font-size: 10px !important; padding: 5px 7px !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        * { transition: none !important; animation: none !important; }
      }
    `}</style>
  );
}

