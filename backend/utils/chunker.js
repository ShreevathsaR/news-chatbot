export function chunkText(text, maxWords = 200) {
  if (!text || text.trim() === "") {
    console.log("🚫 Text is empty or undefined. Returning empty chunks.");
    return [];
  }

  console.log(`🔢 Chunking text into sentence-based chunks of approx ${maxWords} words...`);

  const sentences = text.match(/[^.!?]+[.!?]+[\])'"`’”]*|\s*$/g).filter(Boolean);

  const chunks = [];
  let currentChunk = "";
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const sentenceWordCount = sentence.trim().split(/\s+/).length;

    if (currentWordCount + sentenceWordCount <= maxWords) {
      currentChunk += sentence + " ";
      currentWordCount += sentenceWordCount;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + " ";
      currentWordCount = sentenceWordCount;
    }
  }

  if (currentChunk.trim() !== "") {
    chunks.push(currentChunk.trim());
  }

  console.log("Chunks length", chunks.length)

  return chunks;
}
