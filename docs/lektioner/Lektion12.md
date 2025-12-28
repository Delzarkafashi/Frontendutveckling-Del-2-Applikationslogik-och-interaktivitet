# Lektion 12 – Stöd & stabilisering

## Syfte
Säkerställa att singleplayer-spelet är **stabilt, buggfritt och redo att gå vidare från**. Lektionen fokuserar på felsökning, repetition och sluttest snarare än ny funktionalitet.

---

## Vad ska vi göra?
- Rätta kvarvarande **buggar**
- Hjälpa studenter som ligger efter
- Testa spelet från start till game over
- Säkerställa att alla flöden fungerar korrekt
- Göra mindre justeringar för stabilitet och tydlighet

---

## Hur ska vi tänka?
- Inga nya stora features introduceras
- Fokus ligger på **kvalitet och stabilitet**
- Testa spelet som en användare:
  - Start
  - Spel
  - Paus
  - Game over
  - Starta om
- Identifiera edge cases och fixa dem direkt

---

## Checklista för sluttest (singleplayer)
- Startskärmen visas korrekt vid laddning
- Spelet startar endast via start-knappen
- Ormen rör sig korrekt och kan inte vända 180°
- Vägg- och självkollision fungerar
- Mat spawna alltid på giltig position
- Poäng uppdateras korrekt
- Paus (Escape / P) fungerar som förväntat
- Game over-skärm visas korrekt
- Scoreboard sparar rätt namn och poäng
- “Till start” ger alltid en ny game-run

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Ha ett **stabilt och färdigt singleplayer-spel**
- Ha rättat alla kända buggar
- Känna sig trygg i kodbasen
- Vara redo att gå vidare till nästa steg (lokal multiplayer)
