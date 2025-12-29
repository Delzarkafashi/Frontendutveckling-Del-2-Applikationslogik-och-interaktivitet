# Lektion 15 – UI för flera spelare

## Syfte
Bygga ett tydligt och korrekt **UI för multiplayer** som visar spelets state utan att innehålla spel-logik.  
UI ska endast spegla vad som redan händer i spelet.

---

## Vad ska vi göra?
- Visa **poäng per spelare** (P1 / P2)
- Visa aktuell **spelstatus**
  - Redo
  - Spelar
  - Paus
  - Game Over
- Visa **matchstart och matchslut** tydligt i UI
- Visa **vinnare eller oavgjort** i multiplayer

---

## Hur ska vi tänka?
- UI ska inte innehålla spel-logik
- All logik för:
  - poäng
  - vinnare
  - oavgjort  
  finns redan i spelets state
- UI ska fungera för både:
  - singleplayer
  - multiplayer
- Befintlig kod ska återanvändas och byggas vidare på

---

## Pseudokod
- Skapa UI-element för:
  - poäng per spelare
  - spelstatus
- När spelet startar:
  - visa rätt UI beroende på antal spelare
  - sätt status till `Spelar`
- Under spelets gång:
  - läs poäng från spelets state
  - uppdatera UI kontinuerligt
- Vid paus:
  - visa pausstatus
- Vid game over:
  - visa `Game Over`
  - visa matchresultat:
    - vinnare
    - oavgjort
    - poäng per spelare

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Kunna bygga UI som fungerar för flera spelare
- Förstå skillnaden mellan **spel-logik och presentation**
- Ha ett tydligt multiplayer-UI med korrekt information
- Vara redo för test och stabilisering i nästa lektion
