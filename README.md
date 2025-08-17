---

# News Chatbot — RAG-based AI Chat App

Deployed app link - https://chatbot.vathsa.site

A full-stack AI chatbot. It uses a Retrieval-Augmented Generation (RAG) pipeline powered by **Gemini API Flash 1.5**, with Redis for chat history, and a React + Tailwind UI frontend. The chatbot helps users explore the latest news by querying relevant articles and generating intelligent summaries.

---

## Features

### ✅ Back-End (Node.js + Express)
- RESTful chat endpoint using the Gemini API for RAG-based responses.
- Redis-backed **in-memory session history** storage.
- API endpoints to:
  - Send query and get response.
  - Fetch chat history.
  - Clear/reset a session.

### ✅ Front-End (React + Tailwind CSS + TypeScript)
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

### RAG Pipeline

1. **Collect News Articles**
   - Fetched top 100 news headlines used `@extractus/article-extractor` npm package to extract news from https://theguardian.com

2. **Generate Embeddings (Jina AI)**
   - Used `jina-embeddings-v2-base-en` via Jina API.
   - Each news: `title + url + content` → vector.

3. **Store in Qdrant**
   - Vectors + metadata stored in `news` collection.
   - Tech: Qdrant Cloud (free-tier, fast vector DB).

4. **User Query Flow**
   - Query → embed via Jina API.
   - Search top 5 similar vectors from Qdrant.
   - Combine matched article contents.
   - Final prompt = context + user question → send to LLM.

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
```
Response:
```json
{
  "response": "Here's the latest on OpenAI..."
}
```

---

### `GET /api/chat/history?sessionId=abc123`

Get full chat history of a session.

Response:
```json
{
  "messages": [
    { "sender": "user", "content": "Tell me about Tesla" },
    { "sender": "bot", "content": "Tesla recently announced..." }
  ]
}
```

---

### `DELETE /api/chat/history?sessionId=user_sessionId`

Clear the chat history of a session.

Body:
```json
{
  "sessionId": "abc123"
}
```
---

### Running Locally

#### 1. Clone the Repo
```bash
git clone https://github.com/your-username/news-chatbot.git
cd news-chatbot
```
#### 2. Backend Setup
```bash
cd server
npm install
```
#### Create .env file in server/:
```bash
GEMINI_API_KEY=your_gemini_key
QDRANT_API_KEY=your_qdrant_key
QDRANT_URL=https://your-qdrant-instance
COLLECTION_NAME=news-chatbot
```
#### Start backend:
```bash
npm run dev
```
#### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

#### Redis Configuration

Chat history is stored in Redis using per-session keys like:
```bash
chat:abc123 => [JSON stringified messages]
```
#### TTL Setup

To auto-expire sessions after 1 hour:
```bash
await redis.expire(`chat:${sessionId}`, 3600)
```
---

### Future Improvements

> Streamed bot replies.

> Cache warming has to be implemented to preload welcoming messages. 

> Use a vector DB like Qdrant with document indexing.

> Admin dashboard for viewing chats.

> SQLite/Postgres persistence layer for transcripts.


---

Author

Shreevathsa R
Portfolio — https://vathsa.site

---

