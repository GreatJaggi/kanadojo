// Persistence layer. `window.storage` (used in the original Claude.ai artifact
// prototype) only exists inside that sandbox — it is not available once this
// runs as a real deployed page, so this module replaces it with localStorage
// behind the same async get/set interface the rest of the app already uses.
//
// This is the intended seam for the "user accounts + server-cached stats"
// feature from the roadmap (see CLAUDE.md): swap the localStorage calls below
// for calls to your backend/API, keep the same loadKey/saveKey signatures, and
// nothing else in the app needs to change.

export const K_PROGRESS = "kanadojo:progress";
export const K_STATS = "kanadojo:stats";
export const K_SETTINGS = "kanadojo:settings";
export const K_DRILL_STATS = "kanadojo:drillstats";

export async function loadKey(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    return fallback;
  } catch {
    return fallback;
  }
}

export async function saveKey(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore write failure (e.g. private browsing storage limits), keep working in memory */
  }
}
