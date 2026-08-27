// Builds the study decks (seion + voiced cards) from the raw character data,
// and attaches the "often confused with" cross-references used in Study view.
import { HIRAGANA_ROWS, HIRAGANA_VOICED } from "./hiragana";
import { KATAKANA_ROWS, KATAKANA_VOICED } from "./katakana";

function buildVoicedCards(rows, script) {
  const out = [];
  rows.forEach(row => row.cells.forEach(cell => {
    const [c, r] = cell.split(" ");
    out.push({ c, r, m: `Voiced partner — same shape as its base row, extra marks add the buzz`, row: row.label, script, level: "voiced" });
  }));
  return out;
}

const CONFUSABLE_PAIRS = {
  hiragana: [["ぬ","め"],["ぬ","ね"],["る","ろ"],["わ","ね"],["は","ほ"],["き","さ"]],
  katakana: [["シ","ツ"],["ソ","ン"],["ワ","ラ"],["ク","ケ"],["ウ","ワ"]],
};

function buildConfusedMap(script) {
  const map = {};
  CONFUSABLE_PAIRS[script].forEach(([a, b]) => {
    map[a] = map[a] || []; map[a].push(b);
    map[b] = map[b] || []; map[b].push(a);
  });
  return map;
}

function buildSeionCards(rows, script) {
  const confused = buildConfusedMap(script);
  const out = [];
  rows.forEach(row => row.cells.forEach(cell => {
    if (!cell) return;
    out.push({ c: cell.c, r: cell.r, m: cell.m, w: cell.w, e: cell.e, row: row.label, script, level: "seion", confusedWith: confused[cell.c] || [] });
  }));
  return out;
}

export const DECKS = {
  hiragana: {
    seion: buildSeionCards(HIRAGANA_ROWS, "hiragana"),
    voiced: buildVoicedCards(HIRAGANA_VOICED, "hiragana"),
  },
  katakana: {
    seion: buildSeionCards(KATAKANA_ROWS, "katakana"),
    voiced: buildVoicedCards(KATAKANA_VOICED, "katakana"),
  },
};

export function cardId(card) { return `${card.script}:${card.c}`; }
