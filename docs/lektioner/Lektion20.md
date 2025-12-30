# Lektion 20 – Stöd & felsökning

## Syfte
Ge stöd i att säkerställa att **online multiplayer** fungerar stabilt genom testning och felsökning av server, klient och UI.

---

## Vad ska vi göra?
- Testa online multiplayer:
  - hosta spel
  - gå med i spel
  - starta och avsluta match
- Felsöka vanliga problem i:
  - server–klient-kommunikation
  - synkning av spelstate
  - UI (status, poäng, game over)
- Säkerställa att:
  - båda spelare ser samma spel
  - spelet inte fastnar i fel läge

---

## Hur ska vi tänka?
- Vi bygger inte nya funktioner
- Fokus ligger på:
  - stabilitet
  - tydligt beteende
- Spel-logik ska inte flyttas eller dupliceras
- UI ska bara visa information som redan finns i spelets state
- Felsök steg för steg, inte allt på en gång

---

## Pseudokod
*Ingen ny kod i denna lektion – fokus ligger på testning, genomgång och felsökning.*

---

## Mål efter lektionen
Efter lektionen ska studenten:
- Ha ett fungerande online multiplayer utan blockerande buggar
- Förstå hur server och klient samverkar
- Kunna felsöka enklare nätverksproblem
- Känna sig trygg inför fortsatt stabilisering och polish
