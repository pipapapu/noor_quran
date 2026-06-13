// ============================================
// STORAGE untuk progress trivia
// Pake localStorage (sama kayak kode lo yang lain)
// Bisa di-migrate ke Capacitor Preferences nanti
// ============================================

const KEYS = {
  UNLOCKED: "trivia_unlocked_levels",
  COMPLETED: "trivia_completed_levels",
};

export function getUnlockedLevels(): number[] {
  try {
    const raw = localStorage.getItem(KEYS.UNLOCKED);
    return raw ? JSON.parse(raw) : [1];
  } catch {
    return [1];
  }
}

export function setUnlockedLevels(levels: number[]) {
  localStorage.setItem(KEYS.UNLOCKED, JSON.stringify(levels));
}

export function getCompletedLevels(): number[] {
  try {
    const raw = localStorage.getItem(KEYS.COMPLETED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCompletedLevels(levels: number[]) {
  localStorage.setItem(KEYS.COMPLETED, JSON.stringify(levels));
}

export function markLevelCompleted(level: number) {
  const completed = getCompletedLevels();
  if (!completed.includes(level)) {
    completed.push(level);
    setCompletedLevels(completed);
  }
}

export function unlockNextLevel(level: number) {
  const unlocked = getUnlockedLevels();
  if (!unlocked.includes(level)) {
    unlocked.push(level);
    setUnlockedLevels(unlocked);
  }
}
