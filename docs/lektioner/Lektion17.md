# Lektion 17 – WebSocket-server i Node.js

## Syfte
Introducera backend-utveckling med **Node.js** och skapa en grundläggande **WebSocket-server**.  
Samtidigt säkerställa korrekt **Git-hantering** så att endast nödvändiga filer pushas.

---

## Vad ska vi göra?
- Introduktion till Node.js och backend
- Skapa en WebSocket-server med `ws`
- Starta servern och lyssna på en port
- Hantera anslutningar och meddelanden
- Skapa och använda en `.gitignore`

---

## Hur ska vi tänka?
- Backend och frontend är separata delar
- Servern ska:
  - kunna starta
  - ta emot anslutningar
  - skicka och ta emot enkla meddelanden
- Ingen spel-logik eller synk ännu
- Git ska endast innehålla:
  - egen kod
  - konfigurationsfiler
- Genererade och onödiga filer ska ignoreras

---

## Pseudokod
- Skapa `package.json`
- Installera `ws`
- Skapa `server.js`
- Starta en `WebSocketServer`
- Vid anslutning:
  - logga klient
  - skicka bekräftelse
- Vid meddelande:
  - tolka JSON
  - skicka svar
- Skapa `.gitignore`
  - ignorera `node_modules`
  - ignorera loggar och miljöfiler
- Verifiera att endast rätt filer pushas till Git

---

## Git & .gitignore
- Skapa `.gitignore` i projektets rot
- Lägg till:
  - `node_modules/`
  - `.env`
  - loggfiler
  - editor-mappar
- Kontrollera innan commit:
  - inga beroenden pushas
  - endast egen kod versioneras

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Kunna starta en WebSocket-server i Node.js
- Förstå hur klient och server kommunicerar
- Ha korrekt Git-struktur med `.gitignore`
- Vara redo att bygga sessions och synk i nästa lektion
