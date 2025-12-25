# Lektion 6 – Snake

## Syfte
Skapa spelets orm och lägga till grundläggande rörelse. Fokus ligger på hur ormen representeras som data och hur den uppdateras varje tick.

---

## Vad ska vi göra?
- Skapa `Snake`-klassen
- Representera ormen som en lista med segment (`{ x, y }`)
- Lägga till rörelse per tick
- Se till att kroppen följer huvudet
- Förhindra 180°-vändningar
- Rita ormen på spelplanen

---

## Hur ska vi tänka?
- Ormen är **data**, inte grafik
- Varje segment är en position i gridet
- Rörelse sker i två steg:
  1. Ett nytt huvud läggs till
  2. Sista segmentet tas bort
- Input hanteras i `Game`, inte i `Snake`
- `Snake` ansvarar för sitt eget beteende

---

## Pseudokod
1. Skapa `Snake` med:
   - `segments`
   - `direction`
   - `nextDirection`
2. När input sker:
   - kontrollera att riktningen inte är motsatt
   - spara ny riktning
3. Vid varje tick:
   - uppdatera aktuell riktning
   - skapa nytt huvud
   - ta bort sista segmentet
4. Rita varje segment på rätt ruta i gridet

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Förstå hur en orm representeras i kod
- Kunna förklara hur rörelse per tick fungerar
- Ha en styrbar orm som rör sig korrekt
- Vara redo att lägga till mat och kollisioner i nästa lektion
