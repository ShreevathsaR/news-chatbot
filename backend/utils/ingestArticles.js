import { chunkText } from "./chunker.js";
import { getJinaEmbedding } from "./embedder.js";
import { uploadToQdrant } from "./qdrantUploader.js";

export async function ingestArticlesToQdrant(articles) {
    console.log(`Ingesting ${articles.length} articles...`)
  for (const article of articles) {
    const { title, url, content } = article;

    if (!content || content.trim() === "") continue;

    const chunks = chunkText(content);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      try {
        const embedding = await getJinaEmbedding(chunk);

        const metadata = {
          title,
          url,
          chunk,
          chunkIndex: i,
        };

        const id = await uploadToQdrant(embedding, metadata);
        console.log(`✅ Uploaded chunk ${i} from "${title}" as ID: ${id}`);
      } catch (err) {
        console.error(`❌ Failed to embed/upload chunk ${i} from "${title}":`, err.message);
      }
    }
  }

  console.log("🚀 Ingestion complete.");
  return "Ingestion complete.";
}
