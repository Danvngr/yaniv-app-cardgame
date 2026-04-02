
yaniv/
├── app/ # Screens and navigation (Expo Router)
├── context/ # Auth, Language, and Sound providers
├── lib/ # Firebase client, socket service, game sounds
└── server/ # Game server — rooms, rules, AI logic
2. Firebase setup
Create a project at console.firebase.google.com and enable:
Authentication — Email/Password and Anonymous providers
Firestore — used for friends, invites, and leaderboard data
Then copy your config values into app.json under expo.extra:
> These values are read at runtime via expo-constants. Never commit real keys — add app.json to .gitignore if it contains them, or use app.config.js with environment variables instead.
3. Run the game server
cd server
npm install
npm run dev
The server starts on http://localhost:3001.
By default the client points to the production server (yaniv-game-server.fly.dev). To use your local server, update SERVER_URL in lib/socketService.ts:
const SERVER_URL = 'http://localhost:3001';
4. Run the client
cd ..
npm install
npx expo start
Scan the QR code with Expo Go, or press a / i for an Android or iOS emulator.
Deploying the Server
The server stores all room state in memory, so it must run as a single instance.
cd server
fly deploy
fly scale count 1
After deployment, revert SERVER_URL in lib/socketService.ts to your Fly.io URL.
Daniel — CS Student
