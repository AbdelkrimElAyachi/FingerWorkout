# fingerWorkoutWebSocket — Real-Time Server

Socket.IO server handling multiplayer rooms, live race progress, and in-game chat.

## Tech Stack

Socket.IO · Redis · Express

## Setup

**Requires Redis** running locally on port `6379`.

```bash
npm install
npm run socket     # http://localhost:3001
```

## Socket Events

### Rooms

| Event          | Direction       | Description            |
| -------------- | --------------- | ---------------------- |
| `createRoom`   | Client → Server | Create a new room      |
| `joinRoom`     | Client → Server | Join an existing room  |
| `leaveRoom`    | Client → Server | Leave current room     |
| `checkRoom`    | Client → Server | Check if a room exists |
| `getRoomUsers` | Client → Server | Get users in a room    |

### Game

| Event             | Direction       | Description                                |
| ----------------- | --------------- | ------------------------------------------ |
| `userReady`       | Client → Server | Mark player as ready                       |
| `finishWord`      | Client → Server | Report word completion                     |
| `checkGameState`  | Client → Server | Get current game state                     |
| `gameStateUpdate` | Server → Client | Game state changed (idle/started/finished) |
| `roomUsersUpdate` | Server → Client | User progress updated                      |

### Chat

| Event         | Direction       | Description          |
| ------------- | --------------- | -------------------- |
| `sendMessage` | Client → Server | Send chat message    |
| `newMessage`  | Server → Client | Receive chat message |

## Structure

```
├── socket.js              # Server entry point
├── events/
│   ├── room-handlers.js   # Room create/join/leave logic
│   ├── gameHandlers.js    # Ready, race progress, finish
│   └── chatHandlers.js    # In-room messaging
├── services/
│   └── redisService.js    # Redis operations for room & game state
└── utils/
    └── getWords.js        # Word generation
```
