# Lektion 7 – Food & kollisioner

## Syfte
I denna lektion bygger vi vidare på Snake-spelet genom att lägga till **mat**, grundläggande **kollisionslogik** och hantering av **game over**. Fokus ligger på spelregler och hur spelets state förändras över tid.

---

## Vad ska vi göra?
- Skapa en `Food`-klass
- Slumpa mat på giltiga positioner på spelplanen
- Säkerställa att mat inte placeras på ormen
- Kontrollera kollision med vägg
- Kontrollera kollision med egen kropp
- Avsluta spelet när en kollision sker
- Koppla game over till UI (overlay)

---

## Hur ska vi tänka?
- Mat är en **del av spelstate**, inte UI
- Positioner räknas i **grid-koordinater**, inte pixlar
- All kollisionslogik ska ligga i `Game`, inte i UI
- `Food` ansvarar endast för:
  - sin position
  - att ritas
  - att slumpas korrekt
- UI reagerar på game over, men **bestämmer inte reglerna**
- Game loop fortsätter tills spelet explicit stoppas

---

## Pseudokod / steg

1. Skapa `Food`-klassen:
   - Spara `cols`, `rows`, `tileSize`, `ctx`
   - Håll reda på `x` och `y`
2. Implementera `randomize(occupiedPositions)`:
   - Slumpa en position inom spelplanen
   - Kontrollera att positionen inte krockar med ormens segment
3. Rita maten som en ruta på canvas:
   - Använd padding för tydligare visuell skillnad
4. I `Game.update()`:
   - Kontrollera om ormens huvud är på samma ruta som maten
   - Om ja:
     - öka ormens längd
     - öka poäng
     - slumpa ny mat
5. Lägg till väggkollision:
   - Om ormens huvud är utanför spelplanen → game over
6. Lägg till kollision med egen kropp:
   - Om huvudet matchar något av kroppens segment → game over
7. Vid game over:
   - Stoppa game loop
   - Anropa `onGameOver`
   - Visa game over-overlay via UI

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Ha ett spel där ormen kan äta mat
- Förstå hur kollisioner implementeras i spel
- Ha tydlig separation mellan spel-logik och UI
- Kunna avsluta spelet korrekt vid regelbrott
- Vara redo att gå vidare till UI-förbättringar och fler spelare
