# Lektion 13 – Flera ormar (lokal multiplayer)

## Syfte
Utöka spelet från singleplayer till **lokal multiplayer** genom att stödja fler än en orm i samma spel. Fokus ligger på spel-logik, state-hantering och input – inte nätverk.

---

## Vad ska vi göra?
- Stöd för **mer än en `Snake`**
- Separat **state per spelare** (position, riktning, score)
- Olika **kontroller per spelare**
- Möjlighet att välja **singleplayer eller multiplayer** vid start
- Behålla all befintlig funktionalitet (paus, game over, UI)

---

## Hur ska vi tänka?
- Singleplayer ska fortsätta fungera **oförändrat**
- Multiplayer byggs som ett **tillägg**, inte en ersättning
- `Game` ansvarar för:
  - antal spelare
  - ormar
  - poäng
  - kollisioner mellan ormar
- UI ska bara:
  - välja antal spelare
  - visa overlays (start, paus, game over)

---

## Pseudokod
- Lägg till stöd för flera ormar i spelet
- Ersätt `snake` med en lista av ormar (`snakes`)
- Lägg till `playerCount` för att hålla reda på antal spelare
- Skapa en metod `setPlayers(count)` som:
  - initierar rätt antal ormar
  - sätter olika startpositioner
  - nollställer poäng per spelare
- Uppdatera spelets loop:
  - loopa igenom alla ormar i `update()`
  - rita alla ormar i `render()`
- Hantera input:
  - koppla piltangenter till spelare 1
  - koppla WASD till spelare 2
- Hantera kollisioner:
  - väggkollision per orm
  - självkollision per orm
  - orm ↔ orm-kollision
- Uppdatera poäng individuellt när respektive orm äter mat
- Behåll singleplayer som standardläge

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Kunna välja mellan **singleplayer och multiplayer**
- Kunna spela **två ormar samtidigt** på samma spelplan
- Förstå hur man hanterar **separat state per spelare**
- Förstå hur input kan kopplas till olika spelare
- Ha ett spel som fungerar stabilt både för 1 och 2 spelare

