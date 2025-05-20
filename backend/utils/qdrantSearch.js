import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const QDRANT_URL = process.env.QDRANT_ENDPOINT;
const COLLECTION_NAME = process.env.QDRANT_COLLECTION;

export async function searchQdrant(queryVector, topK) {
    console.log('Searching Qdrant...');
  try {
    const response = await axios.post(
      `${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`,
      {
        vector: queryVector,
        top: topK,
        with_payload: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.QDRANT_API_KEY,
        },
      }
    );

    // console.log("Qdrant search response:", response.data);

    return response.data.result;
  } catch (error) {
    console.error("Error searching Qdrant:", error.response?.data || error.message);
    return [];
  }
}
