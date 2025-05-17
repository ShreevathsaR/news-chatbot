export function chunkText(text, maxWords = 200) {
  if (!text || text.trim() === "") {
    console.log("🚫 Text is empty or undefined. Returning empty chunks.");
    return [];
  }

  console.log(`🔢 Chunking text into chunks of ${maxWords} words...`);

  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += maxWords) {
    const chunk = words.slice(i, i + maxWords).join(" ");
    chunks.push(chunk);
  }

  return chunks;
}
