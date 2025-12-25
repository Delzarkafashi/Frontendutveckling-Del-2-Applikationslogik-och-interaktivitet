# Lektion 2 – Planering & struktur

## Syfte
Skapa en tydlig bild av hur spelprojektet är uppbyggt och hur vi kommer arbeta vidare steg för steg med samma mall under kursen.

---

## Vad ska vi göra?
- Gå igenom spelmallen som används i kursen
- Gå igenom hur spelet är uppdelat i delar:
  - `Game`
  - `Snake`
  - `Board`
  - `Food`
- Gå igenom ansvar för varje del (logik, rendering, input)
- Gå igenom spelets flöde (start → spel → game over)
- Förklara hur vi bygger vidare vecka för vecka med denna struktur

---

## Hur ska vi tänka?
- Vi vill ha ordning från början så att spelet går att bygga ut
- Varje del har ett tydligt ansvar och ska inte göra “allt”
- `Game` håller ihop helheten och styr flödet
- `Board` ansvarar för spelplanen och rendering av planen
- `Snake` ansvarar för ormens state och beteende
- `Food` ansvarar för matens position och regler kring mat
- `main.js` ska vara liten och bara starta spelet

---

## Pseudokod
*Ingen kod i denna lektion – fokus ligger på genomgång och förståelse.*

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Förstå projektets struktur och vilka delar som finns
- Förstå ansvarsfördelningen mellan klasserna
- Förstå spelets grundflöde (start → spel → game over)
- Vara redo att sätta upp projektet tekniskt i nästa lektion
