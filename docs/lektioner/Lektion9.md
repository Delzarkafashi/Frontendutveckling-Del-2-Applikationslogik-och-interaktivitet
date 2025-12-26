# Lektion 9 – Scoreboard & localStorage

## Syfte
I denna lektion lägger vi till en **scoreboard** som sparar spelarens poäng även efter att sidan laddas om.  
Fokus ligger på **persistens**, sortering och tydlig ansvarsfördelning – inte på UI-design.

---

## Vad ska vi göra?
- Skapa en scoreboard som sparas i `localStorage`
- Spara spelarens poäng vid game over
- Läsa in sparade poäng när spelet startar
- Sortera poäng i fallande ordning
- Visa de 5 högsta poängen (Top 5)

---

## Hur ska vi tänka?
- Poäng är **data**, inte UI
- `localStorage` används som en enkel databas
- Spel-logik (score) hanteras i `Game`
- Lagring och sortering sker i en separat modul
- UI ska endast visa färdig data
- Scoreboarden ska:
  - vara stabil
  - inte växa obegränsat
  - alltid visa högsta poäng först

Arkitektur:
- `core/` → spel-logik och score
- `storage/` → spara och läsa poäng
- `ui/` → rendera scoreboard
- `main.js` → koppla ihop spelet och scoreboarden

---

## Pseudokod
1. Vid start:
   - hämta sparade poäng från `localStorage`
   - rendera scoreboard

2. Under spel:
   - räkna hur många gånger spelaren äter mat
   - spara detta som `score` i `Game`

3. Vid game over:
   - skicka `score` från `Game`
   - lägg till poängen i scoreboard-listan
   - sortera listan fallande
   - behåll endast de 5 högsta resultaten
   - spara listan i `localStorage`
   - rendera uppdaterad scoreboard

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Förstå hur `localStorage` fungerar
- Kunna spara och läsa strukturerad data
- Ha en fungerande Top 5-scoreboard
- Förstå skillnaden mellan:
  - spel-logik
  - lagring
  - UI
- Vara redo att bygga vidare på UI och användarflöde i nästa lektion
