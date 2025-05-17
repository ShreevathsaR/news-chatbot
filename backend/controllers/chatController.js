import { getJinaEmbedding } from "../utils/embedder.js";
import { searchQdrant } from "../utils/qdrantSearch.js";
import { v4 as uuidv4 } from 'uuid'
import redis from "../lib/redis.js";

async function callGeminiAPI(query, context) {
  console.log("Calling Gemini API with query:", query);
  
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  
  const prompt = `You are a news bot ssing the following context, answer the question concisely and accurately, if there are any points that are not in the context, you can answer them using your own knowledge.
  strictly use the next line if you are providing a list of points.

Context:
${context}

Question:
${query}

Answer:`;

  try {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(`${API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || "Unknown API error");
    }

    // console.log("Gemini API response:", data);
    
    return data.candidates[0].content.parts[0].text || "No answer generated. Response format unexpected.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

export async function answerQuery(req, res) {
  const {query:userQuery, sessionId} = req.body;

  if (!userQuery || !sessionId) return res.status(400).json({ error: "Query & Session ID is required" });

  try {
    const queryEmbedding = await getJinaEmbedding(userQuery);
    const searchResults = await searchQdrant(queryEmbedding, 5);

    console.log("Search Results:", searchResults);

    const contextText = searchResults.map((r) => r.payload.chunk).join("\n\n");

    const answer = await callGeminiAPI(userQuery, contextText);

    const userMessage = { id: uuidv4(), sender: "user", content: userQuery };
    const botMessage = { id: uuidv4(), sender: "bot", content: answer };

    const sessionKey = `chat:${sessionId}`

    await redis.rpush(sessionKey, JSON.stringify(userMessage), JSON.stringify(botMessage))
    await redis.expire(sessionKey, 3600)//1hr

    console.log("AI Answer:", answer);

    res.json({ answer });
  } catch (error) {
    console.error("Error answering query:", error);
    res.status(500).json({ error: "Failed to get answer" });
  }
}

export const getHistory = async (req, res) => {
  const { sessionId } = req.query
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' })

  const sessionKey = `chat:${sessionId}`
  const messages = await redis.lrange(sessionKey, 0, -1)

  const parsed = messages.map(msg => JSON.parse(msg))
  res.json({ messages: parsed })
}

export const deleteHistory = async (req, res) => {
  const { sessionId } = req.query
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' })

  const sessionKey = `chat:${sessionId}`
  console.log(sessionKey)
  await redis.del(sessionKey)

  res.json({ success: true })
}

