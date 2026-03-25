# fingerWorkout — Frontend

Vue 3 single-page application for the typing test and multiplayer race experience.

## Tech Stack

Vue 3 · Vite · Pinia · Vue Router · Tailwind CSS · Socket.IO Client · Chart.js

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

## Environment Variables

Create a `.env` file:

```env
VITE_FEATURE_COMPETITION=true   # enable multiplayer mode
```

## Structure

```
src/
├── components/
│   ├── auth/          # Login & signup forms
│   ├── common/        # Reusable UI (Button, Input)
│   ├── competition/   # Race line, lobby, chat, results
│   ├── layout/        # Header, footer
│   └── typing/        # Typing game & test components
├── views/             # Page-level components
├── stores/            # Pinia auth store
├── services/          # Socket.IO service
├── utils/             # API client, auth helpers
└── styles/            # Global CSS & theme definitions
```

## Themes

Three built-in color themes selectable at runtime: **Default** (green), **Blue**, and **Pink**. All use a dark glassmorphism design system.
