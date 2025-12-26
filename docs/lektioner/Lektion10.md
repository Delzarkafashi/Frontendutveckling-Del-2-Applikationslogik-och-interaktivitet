# Lektion 10 – UI: start & game over

## Syfte
Bygga grundläggande UI-flöden runt spelet så att spelaren kan starta spelet, se sitt resultat vid game over och följa sin poäng under spelets gång.

---

## Vad ska vi göra?
- Skapa en **startskärm** med start-knapp
- Låta spelet starta **endast via UI**, inte automatiskt
- Visa en **game-over-skärm** när spelet tar slut
- Visa spelarens **poäng vid game over**
- Visa **live-score under spelets gång**
- (Valfritt) låta spelaren skriva sitt namn vid game over

---

## Hur ska vi tänka?
- UI ska vara separerat från spel-logik
- `Game` ska inte känna till DOM eller UI
- `GameUI` ansvarar för kopplingen mellan spel och UI
- Start- och game-over-skärmar är egna UI-komponenter
- UI styr **när** spelet startar och återstartar

---

## Pseudokod
- Lägg till HTML för startskärm med start-knapp
- Visa startskärmen när sidan laddas
- Vid klick på start-knappen:
  - göm startskärmen
  - starta spelet
- Under spelets gång:
  - uppdatera score-text när poängen ändras
- När spelet är slut:
  - visa game-over-skärm
  - visa spelarens score
- Vid klick på “Spela igen”:
  - (valfritt) hämta spelarens namn
  - spara score
  - återställ spelet
  - starta spelet igen

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Kunna starta spelet via en start-knapp
- Se en game-over-skärm med resultat
- Se poängen uppdateras live under spelet
- Förstå hur UI och spel-logik hålls separerade
- Ha ett spel som känns komplett ur ett användarperspektiv
