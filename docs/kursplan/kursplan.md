# Kursplan – Bygg ditt eget Snake-spel i JavaScript (6 veckor)

## Översikt
Denna kurs är en **fortsättning på Frontendutveckling – Del 1: Webbstruktur och interaktion**. Studenten förväntas redan behärska grundläggande HTML, CSS och JavaScript, inklusive DOM, events och enklare objekt och klasser.

Kursen har ett **högre tempo och mer praktiskt fokus**, där kunskaperna från del 1 tillämpas i ett större sammanhängande projekt. Studenten bygger ett komplett Snake-spel i JavaScript, först singleplayer och därefter multiplayer, och avslutar kursen med att utveckla en **egen WebSocket-server i Node.js**.

---

## Vecka 1 – Projektförståelse, planering & grundsetup

### Lektion 1 – Projektöversikt & mål
- Gå igenom vad som ska byggas (visa färdigt Snake)
- Förklara kursens upplägg vecka för vecka
- Vad är ett spel? (state, tick, loop, input, rendering)
- Skillnad mellan singleplayer och multiplayer

### Lektion 2 – Planering & struktur
- Gå igenom spelmallen som används i kursen
- Gå igenom hur spelet är uppdelat i delar (`Game`, `Snake`, `Board`, `Food`)
- Gå igenom ansvar för varje del (logik, rendering, input)
- Gå igenom spelets flöde (start → spel → game over)
- Förklara hur vi kommer arbeta stegvis vidare med denna mall

### Lektion 3 – Projektsetup
- Skapa projektstruktur utifrån spelmallen (mappar, filer)
- Gå igenom grundläggande HTML, CSS och JavaScript som används i projektet
- Förbereda grund för game loop och rendering
- Koppla projektet till Git och gå igenom grundläggande Git-arbetsflöde


### Lektion 4 – Stöd & repetition
- Hjälp med setup
- Repetition av klasser och JS-grunder
- Säkerställa att alla är redo för vecka 2

---
## Vecka 2 – Bygga Snake-spelet (singleplayer)

### Lektion 5 – Game & Board
- Skapa `Game`-klassen
- Skapa `Board` (spelplan, grid/canvas)
- Game loop (update/render)

### Lektion 6 – Snake
- Skapa `Snake`-klassen
- Rörelse per tick
- Förhindra 180°-vändningar
- Kroppen följer huvudet

### Lektion 7 – Food & kollisioner
- Skapa `Food`-klassen
- Slumpa mat på giltiga positioner
- Väggkollision och egen kropp
- Game over-logik

### Lektion 8 – Stöd & stabilisering
- Felsökning
- Hjälp med logik och klasser
- Säkerställa fungerande singleplayer

---

## Vecka 3 – UI & localStorage (singleplayer)

### Lektion 9 – Scoreboard & localStorage
- Spara poäng i `localStorage`
- Läsa in scoreboard vid start
- Sortera resultat (fallande poäng)

### Lektion 10 – UI: start & game over
- Startskärm (start-knapp, ev. namninput)
- Game-over-skärm med resultat
- Visa poäng under spel

### Lektion 11 – Polish & förbättringar
- Design, färger, typografi
- Förbättrad spelkänsla
- Edge cases

### Lektion 12 – Stöd & stabilisering
- Buggrättning
- Hjälp till de som ligger efter
- Sluttest av singleplayer

---

## Vecka 4 – Flera ormar lokalt

### Lektion 13 – Flera ormar
- Stöd för mer än en `Snake`
- Separat state per spelare
- Olika kontroller per spelare

### Lektion 14 – Kollisioner & matchlogik
- Orm ↔ orm-kollision
- Vinnare, förlorare, oavgjort
- Reset av enskild spelare eller match

### Lektion 15 – UI för flera spelare
- Visa poäng per spelare
- Visa spelstatus
- Matchstart/matchslut i UI

### Lektion 16 – Stöd & test
- Testspelning
- Identifiera och åtgärda buggar
- Stabilitet i lokal multiplayer

---

## Vecka 5 – Multiplayer & server (WebSocket)

### Lektion 17 – WebSocket-server i Node.js
- Introduktion till Node.js
- Skapa WebSocket-server (`ws`)
- Hantera anslutningar och meddelanden

### Lektion 18 – Sessions & synk
- Sessions (host/join)
- Skicka och ta emot speldata
- Synka flera klienter

### Lektion 19 – Integration & stabilitet
- Koppla spelet till servern
- Testa multiplayer (flera flikar/datorer)
- Stabilitet och edge cases

### Lektion 20 – Stöd & felsökning
- Hjälp med server och klient
- Felsökning av multiplayer
- Säkerställa fungerande nätverksspel

---

## Vecka 6 – Stöd, kodstädning & presentation

### Lektion 21–22 – Stöd & förbättring
- Extra stöd och handledning
- Gemensam genomgång av kodstruktur
- Kodstädning och förtydligande
- Tid för att färdigställa projekt
- Förberedelse inför presentation

### Lektion 23–24 – Presentation & avslut
- Presentation av spelprojekt
- Gemensam genomgång och reflektion
- Sammanfattning av kursen
