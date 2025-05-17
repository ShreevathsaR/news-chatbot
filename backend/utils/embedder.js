import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getJinaEmbedding(text) {
  console.log("Getting embedding for:", text);

  try {
    const response = await axios.post(
      "https://api.jina.ai/v1/embeddings",
      {
        input: [text],
        model: "jina-embeddings-v2-base-en",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data[0].embedding;
  } catch (error) {
    console.error("Error fetching embedding:", error);
    return null;
  }
}
