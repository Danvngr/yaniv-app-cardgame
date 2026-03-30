# Yaniv Card Game

A mobile implementation of the classic Israeli card game. Supports local play against AI and real-time online multiplayer via private rooms.

![React Native](https://img.shields.io/badge/React%20Native-0.81-blue)
![Expo](https://img.shields.io/badge/Expo-54-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-green)

## Screenshots

| Lobby | Game Setup | Invite Friends | Gameplay |
| :---: | :---: | :---: | :---: |
| ![Lobby](https://github.com/user-attachments/assets/739ec85d-ba4a-43fe-becf-db56cacbaa44) | ![Setup](https://github.com/user-attachments/assets/50aff6dd-2360-4ef8-892f-b52baa0cc3a7) | ![Invite](https://github.com/user-attachments/assets/7346573b-c87b-49e4-b4a9-8467784f7ca2) | ![Game](https://github.com/user-attachments/assets/36809a05-1ce9-4d67-992d-fdf82a45eb5b) |

## Tech Stack

- **Frontend:** React Native, Expo, Expo Router, TypeScript
- **Backend:** Node.js, Express, Socket.io (deployed on [Fly.io](https://fly.io))
- **Auth & Data:** Firebase Authentication + Firestore

## Features

- Online multiplayer via private room codes
- Offline play against AI opponents
- Sticking mechanic — 2-second window to stick a matching card after drawing
- Assaf penalties, Joker substitutions, and card run/set validation
- In-game chat, friend invites, leaderboard, and match statistics

## Project Structure

```
yaniv/
├── app/          # Screens and navigation (Expo Router)
├── context/      # Auth, Language, and Sound providers
├── lib/          # Firebase client, socket service, game sounds
└── server/       # Game server — rooms, rules, AI logic
```

## Running Locally

### Prerequisites

- Node.js 18+
- Expo Go on your phone, or an iOS/Android emulator
- A Firebase project (see step 2)

### 1. Clone the repo

```bash
git clone https://github.com/Danvngr/yaniv-app-cardgame.git
cd yaniv-app-cardgame
```

### 2. Firebase setup

Create a project at [console.firebase.google.com](https://console.firebase.google.com) and enable:
- **Authentication** — Email/Password and Anonymous providers
- **Firestore** — used for friends, invites, and leaderboard data

Then copy your config values into `app.json` under `expo.extra`:

```json
"extra": {
  "firebaseApiKey": "...",
  "firebaseAuthDomain": "...",
  "firebaseProjectId": "...",
  "firebaseStorageBucket": "...",
  "firebaseMessagingSenderId": "...",
  "firebaseAppId": "..."
}
```

> These values are read at runtime via `expo-constants`. Never commit real keys — add `app.json` to `.gitignore` if it contains them, or use `app.config.js` with environment variables instead.

### 3. Run the game server

```bash
cd server
npm install
npm run dev
```

The server starts on `http://localhost:3001`.

By default the client points to the production server (`yaniv-game-server.fly.dev`). To use your local server, update `SERVER_URL` in `lib/socketService.ts`:

```typescript
const SERVER_URL = 'http://localhost:3001';
```

### 4. Run the client

```bash
cd ..
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` / `i` for an Android or iOS emulator.

## Deploying the Server

The server stores all room state in memory, so it must run as a single instance.

```bash
cd server
fly deploy
fly scale count 1
```

After deployment, revert `SERVER_URL` in `lib/socketService.ts` to your Fly.io URL.

---

Daniel — CS Student
