# Lektion 14 – Kollisioner & matchlogik

## Syfte
Utöka spelet med riktig **matchlogik** för multiplayer genom att hantera kollisioner mellan ormar och avgöra matchens utgång: vinnare, förlorare eller oavgjort.

---

## Vad ska vi göra?
- Hantera **kollision mellan ormar**
- Avgöra **vinnare och förlorare**
- Hantera **oavgjort**
- Spara matchens resultat i spelets state
- Kunna **resetta matchen** på ett kontrollerat sätt

---

## Hur ska vi tänka?
- All matchlogik ska ligga i **`Game.js`**
- UI ska inte avgöra vem som vann – bara visa resultatet
- Spelet ska alltid veta:
  - vem som förlorade
  - vem som vann
  - om matchen slutade oavgjort
- Singleplayer ska fortsätta fungera som innan

---

## Pseudokod
- Lägg till state för matchresultat (`lastResult`)
- När spelet uppdateras:
  - kontrollera väggkollision per orm
  - kontrollera självkollision per orm
  - kontrollera orm ↔ orm-kollision:
    - huvud mot huvud → oavgjort
    - huvud mot motståndarens kropp → förlust
- När en match tar slut:
  - stoppa spelet
  - skapa ett resultatobjekt:
    - vinnare
    - förlorare
    - oavgjort (true/false)
    - poäng per spelare
- Exponera resultatet till UI via `onGameOver`
- Skapa metoder för:
  - reset av hel match
  - (valfritt) reset av enskild spelare

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Kunna hantera **kollisioner mellan flera ormar**
- Förstå skillnaden mellan **spel-logik och UI**
- Kunna avgöra **vinnare, förlorare och oavgjort**
- Ha ett spel som fungerar korrekt i både singleplayer och multiplayer
- Vara redo att bygga vidare med **UI för flera spelare** i nästa lektion
