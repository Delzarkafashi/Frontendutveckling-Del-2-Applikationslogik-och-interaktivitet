# Lektion 18 – Sessions & synk

## Syfte
Bygga stöd för **sessions** i multiplayer så att flera klienter kan ansluta till samma match och **synka data** via servern.

---

## Vad ska vi göra?
- Skapa sessions (host / join)
- Identifiera klienter
- Skicka och ta emot speldata
- Synka data mellan flera klienter
- Testa funktionaliteten lokalt i webbläsaren

---

## Hur ska vi tänka?
- Servern ansvarar för:
  - sessions
  - vilka klienter som tillhör en session
  - vidarebefordran av data
- Klienterna:
  - hostar eller joinar en session
  - skickar data
  - tar emot data
- Ingen faktisk spel-logik synkas ännu
- Fokus är kommunikation och struktur

---

## Test
- Skapa ett enkelt test-UI i HTML
- Öppna test-sidan i **två flikar**
  - flik 1: host
  - flik 2: join med session-id
- Skicka testdata från ena fliken
- Verifiera att andra fliken tar emot datan i konsolen

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Kunna skapa och ansluta till sessions
- Kunna skicka och ta emot data mellan klienter
- Förstå hur synk mellan flera klienter fungerar
- Ha en fungerande grund för nätverksmultiplayer
