# Lektion 19 – Online multiplayer (från början, steg-för-steg)

## Syfte
Bygga en **stabil och enkel online-multiplayer** för Snake där:
- befintlig singleplayer + lokal multiplayer lämnas **orörd**
- all online-kod ligger i en **egen mapp**: `src/online-multiplayer/`
- två spelare spelar **samma match** synkat via WebSocket (host = server-authority)

---

## Förutsättningar
- Spelet har redan:
  - `Game`, `Snake`, `Food`, `Board`
  - UI (start, pause, game over, HUD) för single/lokal multiplayer
- Vi har en Node-server med `ws` (WebSocket) som kan:
  - skapa rum (host)
  - låta klient gå med (join)
  - relaya game-meddelanden i rummet

---

## Översikt – vad vi byggde
- Ny mapp: `src/online-multiplayer/`
  - `index.html` (egen sida för online multiplayer)
  - `online.js` (host/join/start/restart + WebSocket + UI/ritning)
  - `hostEngine.js` (host kör riktig Game-loop och skickar state)
  - `OnlineSnakeGame.js` (om ni använder en wrapper/klass för state-format)
- Navigation från startsidan:
  - knappen **“Spela multiplayer online”** skickar till: `src/online-multiplayer/index.html`

---

# Steg-för-steg (med egen pseudokod per steg)

## Steg 1 – Skapa online-mappen och separera allt
**Mål:** All online-kod ska ligga i en egen mapp utan att röra resten av spelet.

**Gör:**
- Skapa `src/online-multiplayer/`
- Lägg in `index.html` och `online.js` där

### Pseudokod
- skapa mapp `src/online-multiplayer/`
- skapa `index.html`
- skapa `online.js`
- se till att inga imports går in i gamla filer i onödan

---

## Steg 2 – Navigering från startskärm till online-sidan
**Mål:** Klick på “Spela multiplayer online” skickar användaren till online-sidan.

**Gör:**
- Lägg till knapp i root `index.html` (om den inte fanns)
- I `StartScreen.js`: `window.location.href = "src/online-multiplayer/index.html"`

### Pseudokod
- hitta online-knappen i StartScreen
- vid click:
  - navigera till `src/online-multiplayer/index.html`

---

## Steg 3 – Enkel lobby-UI (host/join)
**Mål:** En lobby där man kan:
- hosta och få en room code
- gå med i room code

**Gör:**
- UI: host-knapp, join-input, join-knapp
- Visa room code + roll (host/client)

### Pseudokod
- visa lobby med:
  - host button
  - input för room code
  - join button
  - box som visar room + roll
- när host klickas:
  - skapa rum (via server)
  - visa room code
- när join klickas:
  - skicka room code till server
  - visa roll = client

---

## Steg 4 – WebSocket-server (återanvänd lektion 18)
**Mål:** Använd samma server men se till att den stödjer:
- `host` -> skapar session
- `join` -> går med i session
- `player_joined` -> uppdatera antal spelare
- `start` -> host startar match
- `restart` -> host startar om match
- `game` -> relayar input/state

### Pseudokod
- vid `host`:
  - skapa sessionId
  - sessions[sessionId] = set(ws)
  - skicka `hosted`
- vid `join`:
  - om session finns:
    - lägg till ws i rummet
    - skicka `joined`
    - broadcast `player_joined`
  - annars:
    - skicka `error`
- vid `start`:
  - broadcast `started` till rummet
- vid `restart`:
  - broadcast `restarted` till rummet
- vid `game`:
  - relay till andra i samma session

---

## Steg 5 – Start-knapp endast för host
**Mål:** Bara host ska kunna starta matchen.

**Gör:**
- Visa `Starta match` bara om roll = host
- `online.js` skickar `{ type: "start" }` till server

### Pseudokod
- när showRoom(role):
  - om role == host:
    - visa startBtn
  - annars:
    - göm startBtn
- vid klick startBtn:
  - ws.send({type:"start"})

---

## Steg 6 – Host kör spelet (server-authority)
**Mål:** Host kör “riktig” game loop lokalt och skickar state till klienten.

**Gör:**
- `hostEngine.js` skapar Game och uppdaterar varje tick
- varje tick skickas `{ kind:"state", state }` via WS

### Pseudokod
- createHostEngine():
  - init Game(cols=50, rows=20, tile=20)
  - setPlayers(2)
- startLoop(onTick):
  - loop
  - game.update()
  - state = serialize(game)
  - onTick(state)
- i online.js (host):
  - onTick(state):
    - ws.send({type:"game", data:{kind:"state", state}})

---

## Steg 7 – Client skickar input, host applicerar input
**Mål:** Klienten styr P2 genom att skicka input till host.

**Gör:**
- Client: vid piltangent -> skicka `{ kind:"input", dir }`
- Host: tar emot input -> `hostEngine.setP2Dir(dir)`

### Pseudokod
- client keydown:
  - if dir:
    - sendGame({kind:"input", dir})
- server relayar `game`
- host tar emot `game`:
  - if data.kind == "input":
    - hostEngine.setP2Dir(data.dir)

---

## Steg 8 – Client renderar state (utan spel-logik)
**Mål:** Klienten ska inte köra `Game.update()`, bara rita det hosten skickar.

**Gör:**
- Client tar emot `{ kind:"state" }`
- Client ritar canvas baserat på state
- **Alternativ A (rekommenderad):** client använder `Board` för samma grid/utseende

### Pseudokod
- client onMessage(state):
  - renderState = state
  - board.clear()
  - board.drawGrid()
  - drawFood(state.food)
  - drawSnakes(state.snakes)

---

## Steg 9 – HUD: poäng och status synkas
**Mål:** HUD visar P1/P2 score och status på båda klienter.

**Gör:**
- vid varje state: uppdatera `#p1-score` och `#p2-score`
- status text:
  - “Match igång” under spel
  - “Game over” när state.isGameOver

### Pseudokod
- onState(state):
  - setScore(p1=state.scores[0], p2=state.scores[1])
  - if state.isGameOver:
    - status = "Game over"
  - else:
    - status = "Match igång"

---

## Steg 10 – Game Over UI: återanvänd din `GameOverScreen`
**Mål:** Visa samma modal-UI som i vanliga spelet.

**Gör:**
- Importera `GameOverScreen`
- Visa modal när state.isGameOver blir true
- Endast host får starta om match (restart)

### Pseudokod
- onState(state):
  - if state.isGameOver:
    - showGameOver(messageFrom(state))
    - if role == host:
      - visa restart-knapp
    - else:
      - göm restart-knapp

---

## Steg 11 – Endast vinnaren får skriva namn (online)
**Mål:** Bara den som vann ska kunna skriva sitt namn i game over.

**Gör:**
- host = P1, client = P2
- om winner==1 och role==host -> visa input
- om winner==2 och role==client -> visa input
- annars göm input

### Pseudokod
- amIWinner(state):
  - if state.result.winner==1 and role==host: return true
  - if state.result.winner==2 and role==client: return true
  - return false
- applyGameOverUI(state):
  - nameInput.display = amIWinner(state) ? "block" : "none"

---

## Steg 12 – Tillbaka-knappar utan buggar
**Mål:** “Tillbaka” i online går till root-menu, och i vanlig multiplayer fastnar inte.

**Gör (online):**
- `backBtn` i lobby: `window.location.href = "../../index.html"`
- `gameover-back-btn`: stäng modal + visa lobby (eller gå till root om du vill)

**Gör (vanliga spelet):**
- `GameOverScreen` behöver `onBack` vara kopplad i main/UI så den faktiskt navigerar tillbaka till start-menyn

### Pseudokod
- online backBtn click:
  - navigate("../../index.html")
- online gameover back click:
  - hide gameover
  - show lobby (eller navigate)
- main gameover back click:
  - call onBack()
  - onBack() ska:
    - stoppa game loop
    - visa start-screen

---

## Steg 13 – Flytta inline-CSS till styles
**Mål:** Ingen CSS i HTML-attribut (`style="..."`). Allt ska in i `styles/*.css`.

**Gör:**
- Ta bort inline `style=` i online `index.html`
- Lägg klasser och definiera i `styles/ui.css` eller motsvarande

### Pseudokod
- hitta element med `style="..."`
- ersätt med className
- lägg CSS-regler i `styles/ui.css`

---

## Vanliga buggar vi löste
- **“meLabelEl is null”**: `online.js` försöker använda element som inte finns i HTML  
  → lös med null-check eller lägg in elementen.
- **Role-info visar `?`**: saknade `id="role-info"` eller uppdateringsanrop  
  → lägg id och kör `updateRoleInfo()` i `showRoom()`.
- **Client canvas ser annorlunda ut**: client ritade utan `Board`  
  → använd `Board` på client också (Alternativ A).
- **Tillbaka funkar inte i multiplayer**: `onBack` kopplas inte i main  
  → se till att `GameOverScreen({ onBack })` får en riktig callback.

---

## Mål efter lektionen
Efter lektionen ska studenten kunna:
- bygga en **ren online-multiplayer** som inte förstör befintlig kod
- förstå “host-authority”:
  - host kör spelet
  - client skickar input
  - client renderar state
- återanvända UI-komponenter (HUD + GameOverScreen)
- hantera edge cases (tillbaka, restart, game over, synk)
