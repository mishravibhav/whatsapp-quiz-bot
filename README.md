Here's how you can split your project into **two separate repos** — one for backend and one for frontend — and create a dedicated `README.md` for **each** with project structure and setup instructions.

---

## ✅ Backend `README.md` (Repo: `whatsapp-quiz-bot`)

**File:** [`backend/README.md`](https://github.com/mishravibhav/whatsapp-quiz-bot)

```markdown
# 🧠 WhatsApp Quiz Bot – Backend

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> This is the backend service for the WhatsApp Quiz Bot — responsible for handling message events, storing analytics, serving APIs, and emitting real-time updates via WebSocket.

---

## 📁 Project Structure

```

backend
    └──src 
        ├── controllers/              # Route handler logic (analytics, survey, etc.)
        │   └── analytics.controller.js
        |   └── user.controller.js
        ├── models/                   # Mongoose schemas
        │   └── AnalyticsEvent.js
        │   └── userSession.js
        ├── routes/                   # Express routers
        │   └── index.route.js
        │   └── user.route.js
        │   └── analytics.route.js
        ├── services/                 # Business logic (Baileys integration, etc.)
        │   └── analytics.service.js
        │   └── user.service.js
        ├── utils/                    # Utility functions
        ├── bot.js                    # bot connection logic
        ├── server.js                 # Main entry point (Express app)
        ├── production.env            # Production Environment config 
        ├── development.env           # Developemnt Environment config 
    └── package.json

````

---

## ⚙️ Setup Instructions

### 1. Clone the repo & install

```bash
git clone https://github.com/mishravibhav/whatsapp-quiz-bot.git
cd whatsapp-quiz-bot/backend
npm install
````

### 2. Configure environment

Create a `production.env` and `developemnt.env` file:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/quizbot
PORT=3001
SOCKET_ORIGIN=https://whatsapp-quiz-bot-frontend.vercel.app
```

### 3. Start the server

```bash
npm run start:dev
```

---

## 🚀 Deployment (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Link your GitHub repo
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables (`MONGO_URI`, `PORT`, etc.)

---

## 📊 API Endpoints

| Method | Endpoint                                               | Description                      | 
| ------ | -------------------------------------------------------| ---------------------------------|
| POST   | `/v1/api/survey/:surveyId/respond`                     | Submit quiz response             |
| GET    | `/v1/api/analytics/aggrigated-report`                  | aggrigated JSON report           |
| GET    | `/v1/api/analytics/survey-logs?page=1&limit=20`        | Get report logs in paginated way |
| GET    | `/v1/api/health`                                       | Get application health status    |

---

## 📄 License

MIT © [Vibhav Mishra](https://github.com/mishravibhav)

````

---