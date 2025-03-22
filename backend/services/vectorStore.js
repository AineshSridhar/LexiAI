const { Pinecone } = require("@pinecone-database/pinecone");
require("dotenv").config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

async function initializePinecone() {
  return pinecone.index(process.env.PINECONE_INDEX_NAME);
}

let indexPromise = initializePinecone();

async function storeEmbeddings(embeddings, text) {
  try {
    const index = await indexPromise;

    if (!Array.isArray(embeddings)) {
      throw new Error("Embeddings must be an array");
    }

    // Limit metadata to ~1000 characters to fit within 40,960 bytes
    const metadataSnippet = text.slice(0, 1000);

    await index.upsert([
      {
        id: Date.now().toString(),
        values: embeddings, // 1024-dimension vector
        metadata: { snippet: metadataSnippet }, // Store only part of the text
      },
    ]);

  } catch (error) {
    console.error("Error storing embeddings:", error);
    throw error;
  }
}

module.exports = { storeEmbeddings };
