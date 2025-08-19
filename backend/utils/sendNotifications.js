import { notifyUser } from "../index.js";

let matchedArticles = [];

export async function checkAndNotifyUsers(
  queriesWithEmbeddings,
  embedding,
  metadata
) {
  console.log("Checking and notifying users for new articles...");


  if (!queriesWithEmbeddings || queriesWithEmbeddings.length === 0) {
    console.log("No saved queries found");
    return;
  }

  for (const query of queriesWithEmbeddings) {
    const queryText = query.query.toLowerCase();
    const queryEmbedding = query.embedding;

    console.log(
      `Checking match for query: "${queryText}" and chunk: "${metadata.chunk}"`
    );

    const isMatch = compareEmbeddings(queryEmbedding, embedding);

    if (isMatch) {
      console.log(
        `Match found for query "${queryText}" with chunk: "${metadata.chunk}"`
      );

      if (!matchedArticles.includes(`${query.userId}:${metadata.url}`)) {
        matchedArticles.push(`${query.userId}:${metadata.url}`);
        notifyUser(query.userId.toString(), {
          title: metadata.title,
          url: metadata.url,
          matchedQuery: queryText,
          content: metadata.chunk,
        });
        console.log(
          `Notification sent to user ${query.userId} of type ${typeof query.userId} for query "${queryText}"`
        );
      } else {
        console.log(
          `Article "${metadata.url}" already notified for user "${query.userId}"`
        );
      }
    } else {
      console.log(`No match found for query: "${queryText}"`);
    }
  }
}

async function compareEmbeddings(embedding1, embedding2) {
  const threshold = 0.65;

  const dotProduct = embedding1.reduce(
    (sum, a, i) => sum + a * embedding2[i],
    0
  );
  const norm1 = Math.sqrt(embedding1.reduce((sum, a) => sum + a * a, 0));
  const norm2 = Math.sqrt(embedding2.reduce((sum, a) => sum + a * a, 0));

  const similarity =
    norm1 === 0 || norm2 === 0 ? 0 : dotProduct / (norm1 * norm2);

  console.log(
    `Comparing embeddings: similarity = ${similarity}, threshold = ${threshold}`
  );
  const matching = similarity >= threshold;
  console.log(`Embeddings match: ${matching}`);
  return similarity >= threshold;
}

export function clearOldNotifications() {
  matchedArticles = [];
  console.log("Cleared notification history");
}