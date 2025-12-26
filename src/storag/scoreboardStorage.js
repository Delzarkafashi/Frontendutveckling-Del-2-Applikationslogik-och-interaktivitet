const STORAGE_KEY = "snakeScores";

export function loadScores() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveScore(entry) {
  const scores = loadScores();
  scores.push(entry);

  scores.sort((a, b) => b.score - a.score);

  const topFive = scores.slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topFive));

  return topFive;
}
