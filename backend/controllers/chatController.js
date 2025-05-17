import { getJinaEmbedding } from "../utils/embedder.js";
import { searchQdrant } from "../utils/qdrantSearch.js";

// async function callGeminiAPI(query, context) {

//     console.log("Calling Gemini API with query:", query, "and context:", context);

//   const prompt = `Using the following context, answer the question concisely and accurately.

// Context:
// ${context}

// Question:
// ${query}

// Answer:`;

//     try {
//         const response = await fetch("https://gemini.api.endpoint/generate", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
//           },
//           body: JSON.stringify({ prompt }),
//         });
        
//         const data = await response.json();
//         return data.answer || "No answer generated.";
//     } catch (error) {
//         console.error("Error calling Gemini API:", error);
//         return "No answer generated.";
//     }
// }

async function callGeminiAPI(query, context) {
  console.log("Calling Gemini API with query:", query);
  
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  
  const prompt = `Using the following context, answer the question concisely and accurately.

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

    // Make the API request
    const response = await fetch(
      `${API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    // Parse the response
    const data = await response.json();
    
    // Check for errors
    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || "Unknown API error");
    }
    
    // Extract the text from the response based on latest Gemini API structure
    // if (data.candidates && 
    //     data.candidates[0] && 
    //     data.candidates[0].content && 
    //     data.candidates[0].content.parts) {
      
    //   // Extract the text from all parts and join them
    //   const textParts = data.candidates[0].content.parts
    //     .filter(part => part.text)
    //     .map(part => part.text);
      
    //   return textParts.join(" ");
    // }
    
    return data || "No answer generated. Response format unexpected.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

export async function answerQuery(req, res) {
  const userQuery = req.body.query;

  if (!userQuery) return res.status(400).json({ error: "Query is required" });

  try {
    const queryEmbedding = await getJinaEmbedding(userQuery);
    const searchResults = await searchQdrant(queryEmbedding, 5);

    console.log("Search Results:", searchResults);

    const contextText = searchResults.map((r) => r.payload.chunk).join("\n\n");

    const answer = await callGeminiAPI(userQuery, contextText);

    console.log("AI Answer:", answer);

    res.json({ answer });
  } catch (error) {
    console.error("Error answering query:", error);
    res.status(500).json({ error: "Failed to get answer" });
  }
}
