import e from "express";
import { chunkText } from "./chunker.js";
import { getJinaEmbedding } from "./embedder.js";
import { uploadToQdrant } from "./qdrantUploader.js";
import { checkAndNotifyUsers } from "./sendNotifications.js";
import prisma from "../db/prisma.js";

export async function ingestArticlesToQdrant(articles) {
  console.log(`Ingesting ${articles.length} articles...`);

  let queriesWithEmbeddings = [];

  try {
    const savedQueries = await prisma.query.findMany();
    console.log(`Found ${savedQueries.length} saved queries.`);

    for (const query of savedQueries) {
      const queryText = query.query.toLowerCase();
      const queryEmbedding = await getJinaEmbedding(queryText);
      if (queryEmbedding) {
        queriesWithEmbeddings.push({
          ...query,
          embedding: queryEmbedding,
        });
      } else {
        console.error(`Failed to get embedding for query: "${queryText}"`);
      }
    }
  } catch (error) {
    console.error("Error fetching saved queries:", error);
    return "Failed to fetch saved queries.";
  }

  for (const article of articles) {
    const { title, url, content } = article;

    if (!content || content.trim() === "") continue;

    const chunks = chunkText(content);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i].toLowerCase();

      try {
        const embedding = await getJinaEmbedding(chunk);

        const metadata = {
          title,
          url,
          chunk: chunk,
          chunkIndex: i,
        };

        const id = await uploadToQdrant(embedding, metadata);

        await checkAndNotifyUsers(queriesWithEmbeddings, embedding, metadata);

        // console.log(`Uploaded chunk ${i} from "${title}" as ID: ${id}`);
      } catch (err) {
        console.error(
          `Failed to embed/upload chunk ${i} from "${title}":`,
          err.message
        );
      }
    }
  }

  console.log("Ingestion complete.");
  return "Ingestion complete.";
}
