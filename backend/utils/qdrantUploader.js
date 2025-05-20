

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const QDRANT_URL = process.env.QDRANT_ENDPOINT;
const COLLECTION_NAME = process.env.QDRANT_COLLECTION;
const API_KEY = process.env.QDRANT_API_KEY;

export async function uploadToQdrant(vector, metadata) {
  console.log('Uploading to Qdrant...');
  
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error("Vector must be a non-empty array of numbers");
  }
  
  if (!metadata || typeof metadata !== 'object') {
    throw new Error("Metadata must be a valid object");
  }

  const id = uuidv4();
  
  const payload = {
    points: [
      {
        id,
        vector,
        payload: metadata
      }
    ]
  };

  try {
    const response = await axios.put(
      `${QDRANT_URL}/collections/${COLLECTION_NAME}/points?wait=true`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY
        }
      }
    );
    
    if (response.status === 200) {
      console.log(`Successfully uploaded vector with ID: ${id}`);
      return id;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error uploading to Qdrant:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    
    throw error;
  }
}