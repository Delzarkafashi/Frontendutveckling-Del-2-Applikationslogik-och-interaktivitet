# Lektion 3 – Projektsetup

## Syfte
Sätta upp projektet tekniskt så att alla studenter har samma grund och är redo att börja bygga spelet vidare.

---

## Vad ska vi göra?
- Skapa projektets mapp- och filstruktur utifrån spelmallen
- Lägga in grundfiler för HTML, CSS och JavaScript
- Koppla canvas till JavaScript
- Förbereda en minimal game loop
- Initiera Git-repository och göra första commit

---

## Hur ska vi tänka?
- Struktur kommer före funktionalitet
- Alla filer behöver inte innehålla kod direkt – de ska finnas på rätt plats
- `index.html` ansvarar för struktur
- CSS-filer ansvarar för layout och utseende
- `main.js` ansvarar för att starta spelet
- Vi bygger en stabil grund som vi kan vidareutveckla i nästa veckor

---

## Pseudokod
- Länka CSS i `index.html`
- Skapa `<canvas id="game">` i `index.html`
- Ladda `main.js` som module
- I `main.js`: hämta canvas + `ctx`
- Skapa en minimal loop: `update()` + `render()` + `setInterval`
- Testa i webbläsaren att canvas syns och att loopen körs (t.ex. logg eller enkel ruta)
- Initiera Git och gör första commit

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Ha ett fungerande projekt som öppnas i webbläsaren
- Se canvasen renderas korrekt
- Ha en grundläggande game loop på plats
- Ha projektet kopplat till Git
- Vara redo att börja bygga spelets logik i nästa vecka
