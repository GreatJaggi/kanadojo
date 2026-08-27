// Design tokens. Deliberately not a cream+terracotta palette (that reads as a
// generic "AI app" look) — indigo is the primary interactive color, vermillion
// is reserved for accents (mastery, cut lines, warnings), washi is the page bg.
export const COLORS = {
  ink: "#23262B",
  inkSoft: "#5B5F66",
  washi: "#F2ECDD",
  washiDeep: "#E8DFC8",
  indigo: "#2C4A6E",
  indigoDeep: "#1D3350",
  vermillion: "#BB4430",
  gold: "#B08D57",
  moss: "#6F7A56",
  line: "rgba(35,38,43,0.14)",
};

export function levelColor(level) {
  if (level === undefined || level === null) return COLORS.line;
  if (level <= 0) return "#D8CBAE";
  if (level === 1) return "#C9B78C";
  if (level === 2) return "#9FB08C";
  if (level === 3) return "#6F9A7E";
  if (level === 4) return COLORS.indigo;
  return COLORS.vermillion;
}
