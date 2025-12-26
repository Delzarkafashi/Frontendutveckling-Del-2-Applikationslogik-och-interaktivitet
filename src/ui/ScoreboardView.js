export function renderScoreboard(scores) {
  const list = document.getElementById("scoreboard-list");
  if (!list) return;

  list.innerHTML = "";

  scores.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} – ${entry.score}`;
    list.appendChild(li);
  });
}
