import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const QDRANT_URL = process.env.QDRANT_ENDPOINT;
const COLLECTION_NAME = process.env.QDRANT_COLLECTION;

const createCollection = async () => {
  try {
    const response = await axios.put(
      `${QDRANT_URL}/collections/${COLLECTION_NAME}`,
      {
        vectors: {
          size: 768,
          distance: "Cosine",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.QDRANT_API_KEY,
        },
      }
    );

    console.log("✅ Collection created:", response.data);
  } catch (err) {
    console.error("❌ Failed to create collection:", err.response?.data || err.message);
  }
};

createCollection();
