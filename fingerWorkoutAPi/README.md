# fingerWorkoutAPi — REST API

Express + TypeScript backend handling authentication, user profiles, and test results.

## Tech Stack

Express 5 · TypeScript · Mongoose · JWT · Zod · Multer · bcrypt

## Setup

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/fingerWorkoutDB
PORT=9999
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

Build and run:

```bash
npm run build      # compile TypeScript
npm run start      # http://localhost:9999
npm run dev        # start with nodemon
```

## API Routes

| Method | Route                 | Auth | Description                |
| ------ | --------------------- | ---- | -------------------------- |
| POST   | `/api/json/register`  | ✗    | Register a new user        |
| POST   | `/api/json/login`     | ✗    | Login & get JWT            |
| GET    | `/api/json/profile`   | ✓    | Get current user profile   |
| POST   | `/api/profile/update` | ✓    | Update profile (multipart) |
| POST   | `/api/json/test/save` | ✓    | Save a test result         |
| GET    | `/api/json/test/all`  | ✓    | Get paginated test results |
| GET    | `/api/json/test/top`  | ✓    | Get best test result       |

## Structure

```
src/
├── controllers/    # Auth, User, TestResult controllers
├── middleware/      # Zod validation, JWT verify, error handling
├── models/          # Mongoose schemas (User, TestResult)
├── routes/          # Route definitions
└── db/              # MongoDB connection
```
