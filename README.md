---

# Verifast News Chatbot — RAG-based AI Chat App

A full-stack AI chatbot built for the Verifast internship assignment. It uses a Retrieval-Augmented Generation (RAG) pipeline powered by **Gemini API Flash 1.5**, with Redis for chat history, and a React + Tailwind UI frontend. The chatbot helps users explore the latest news by querying relevant articles and generating intelligent summaries.

---

## Features

### ✅ Back-End (Node.js + Express)
- RESTful chat endpoint using the Gemini API for RAG-based responses.
- Redis-backed **in-memory session history** storage.
- API endpoints to:
  - Send query and get response.
  - Fetch chat history.
  - Clear/reset a session.

### ✅ Front-End (React + Tailwind CSS)
- Clean and modern chat UI with:
  - Bot and user message display.
  - Auto-scroll and message animations.
  - Typing indicator.
  - Reset chat session.
- Sends messages to backend and renders bot replies dynamically.

---

## Architecture

React UI ↔ Express API ↔ Gemini API ↕ Redis (chat history)

---

## API Endpoints

### `POST /api/chat/query`
Send a message to the chatbot.

**Body:**
```json
{
  "query": "What's the latest on OpenAI?",
  "sessionId": "abc123"
}

Response:

{
  "response": "Here's the latest on OpenAI..."
}


---

GET /api/chat/history?sessionId=abc123

Get full chat history of a session.

Response:

{
  "messages": [
    { "sender": "user", "content": "Tell me about Tesla" },
    { "sender": "bot", "content": "Tesla recently announced..." }
  ]
}


---

POST /api/chat/clear

Clear the chat history of a session.

Body:

{
  "sessionId": "abc123"
}


---
```

Tech Stack

Layer	Tech

Frontend	React, Tailwind CSS
Backend	Node.js, Express
AI API	Gemini 1.5 Flash
Memory Store	Redis (in-memory)
Deployment	(optional) Vercel / Netlify + Render / Railway



---

Running Locally

1. Clone the Repo

git clone https://github.com/your-username/news-chatbot.git
cd news-chatbot

2. Backend Setup

cd server
npm install

Create .env file in server/:

GEMINI_API_KEY=your_gemini_key
QDRANT_API_KEY=your_qdrant_key
QDRANT_URL=https://your-qdrant-instance
COLLECTION_NAME=news-chatbot

Start backend:

npm run dev

3. Frontend Setup

cd client
npm install
npm run dev


---

Redis Configuration

Chat history is stored in Redis using per-session keys like:

chat:abc123 => [JSON stringified messages]

Example TTL Setup

To auto-expire sessions after 1 hour:

await redis.expire(`chat:${sessionId}`, 3600)


---

Future Improvements

Streamed bot replies.

Use a vector DB like Qdrant with document indexing.

Admin dashboard for viewing chats.

SQLite/Postgres persistence layer for transcripts.



---

Screenshots

> Add screenshots here if needed




---

Author

Shreevathsa R
Portfolio — Full Stack Developer

---

