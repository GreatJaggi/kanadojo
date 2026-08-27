// Spaced-repetition scheduling. This is the source of truth for character
// mastery — Study grades move a card through these levels; Speed Drill never
// writes to level/reps/correct/incorrect directly (see components/Drill.jsx).
export const INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];
export const MASTER_LEVEL = 5;
export const DAY_MS = 24 * 60 * 60 * 1000;

export function gradeCard(prog, grade) {
  const level = prog?.level ?? 0;
  let newLevel = level;
  if (grade === "forgot") newLevel = 0;
  else if (grade === "hard") newLevel = level;
  else if (grade === "good") newLevel = Math.min(MASTER_LEVEL, level + 1);
  else if (grade === "easy") newLevel = Math.min(MASTER_LEVEL, level + 2);
  const next = Date.now() + INTERVAL_DAYS[newLevel] * DAY_MS;
  return {
    level: newLevel,
    nextReview: next,
    reps: (prog?.reps ?? 0) + 1,
    correct: (prog?.correct ?? 0) + (grade === "forgot" ? 0 : 1),
    incorrect: (prog?.incorrect ?? 0) + (grade === "forgot" ? 1 : 0),
  };
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
