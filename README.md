# ⌨️ FingerWorkout

A real-time multiplayer typing test app. Practice typing, track your progress, and race friends head-to-head.

## Features

- Typing tests with WPM & accuracy tracking
- Real-time multiplayer races via WebSocket
- In-room chat, live race visualization & leaderboards
- User profiles with avatar upload
- Test history & personal bests
- Multiple color themes (green, blue, pink)
- Feature flags for toggling functionality

## Architecture

| Service                                             | Description                        | Docs                                         |
| --------------------------------------------------- | ---------------------------------- | -------------------------------------------- |
| [fingerWorkout](./fingerWorkout/)                   | Vue 3 + Vite frontend              | [README](./fingerWorkout/README.md)          |
| [fingerWorkoutAPi](./fingerWorkoutAPi/)             | Express + TypeScript REST API      | [README](./fingerWorkoutAPi/README.md)       |
| [fingerWorkoutWebSocket](./fingerWorkoutWebSocket/) | Socket.IO + Redis real-time server | [README](./fingerWorkoutWebSocket/README.md) |
| [feature-flags](./feature-flags/)                   | Shared feature-flag utility        | [README](./feature-flags/README.md)          |

## Quick Start

**Prerequisites:** Node.js ≥ 18, MongoDB, Redis

```bash
# 1. API
cd fingerWorkoutAPi && npm install && npm run build && npm run start

# 2. WebSocket
cd fingerWorkoutWebSocket && npm install && npm run socket

# 3. Frontend
cd fingerWorkout && npm install && npm run dev
```

See each sub-project's README for detailed setup and configuration.

## License

MIT
