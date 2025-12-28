# Lektion 11 – Polish & förbättringar

## Syfte
Göra spelet mer **färdigt och professionellt** genom att förbättra användarupplevelse, spelkänsla och stabilitet. Fokus ligger på polish och edge cases – inte nya stora features.

---

## Vad ska vi göra?
- Förbättra **design och UI** (overlays, spacing, tydlighet)
- Förbättra **spelkänslan** (stabil game loop, paus)
- Lägga till **pausfunktion** med meny (Escape / P)
- Säkerställa att **start alltid ger en ny game-run**
- Fixa **edge cases** i UI- och spel-state
- Säkerställa att **scoreboard sparar rätt namn**

---

## Hur ska vi tänka?
- **UI och spel-logik ska vara separerade**
- `Game` ska inte känna till DOM eller HTML
- `GameUI` ansvarar för flödet mellan start, paus och game over
- Varje overlay (start, pause, game over) är en egen UI-komponent
- Undvik dubbla triggers (t.ex. paus-logik på flera ställen)

---

## Pseudokod
- Byt från `setInterval` till en **stabil game loop**
- Lägg till `isPaused` i `Game`
- Skapa en **PauseScreen** med:
  - Fortsätt
  - Starta om
  - Till start
- Vid `Escape` / `P`:
  - pausa spelet
  - visa pause-menyn
- När spelet är pausat:
  - ormen ska inte röra sig
  - piltangenter ska ignoreras
- Vid “Till start”:
  - stoppa spelet
  - återställ state
  - visa startskärmen
- Vid game over:
  - visa game-over-skärm
  - låt spelaren skriva sitt namn
  - spara score **en gång**

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Ha ett spel som känns **polerat och färdigt**
- Kunna **pausa spelet** och navigera via meny
- Förstå hur UI-state och game-state samverkar
- Kunna identifiera och fixa **edge cases**
- Ha en tydlig struktur där ansvar är uppdelat mellan spel, UI och lagring
