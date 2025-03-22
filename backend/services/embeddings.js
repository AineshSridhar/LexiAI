const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const TARGET_DIMENSION = 1024; // Ensure it matches Pinecone's dimension

// Function to split text into smaller chunks
function chunkText(text, chunkSize = 3000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}

// Function to pad vectors to match Pinecone's required dimensions
function padVector(vector, targetDim = TARGET_DIMENSION) {
  return vector.length < targetDim
    ? [...vector, ...Array(targetDim - vector.length).fill(0)]
    : vector.slice(0, targetDim);
}

// Function to average multiple vectors into one
function averageVectors(vectors) {
  if (vectors.length === 1) return vectors[0];
  const avgVector = new Array(vectors[0].length).fill(0);
  
  for (const vec of vectors) {
    for (let i = 0; i < vec.length; i++) {
      avgVector[i] += vec[i];
    }
  }

  return avgVector.map(val => val / vectors.length);
}

async function embedText(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const textChunks = chunkText(text);

    let embeddings = [];
    for (const chunk of textChunks) {
      const result = await model.embedContent(chunk);
      if (result?.embedding?.values) {
        embeddings.push(result.embedding.values);
      } else {
        throw new Error("Invalid embedding response");
      }
    }

    if (embeddings.length === 0) throw new Error("No valid embeddings generated.");

    console.log(`Original embedding dimension: ${embeddings[0].length}`);

    let processedEmbeddings = embeddings.map(vec => padVector(vec, TARGET_DIMENSION));

    if (processedEmbeddings.length > 1) {
      processedEmbeddings = [averageVectors(processedEmbeddings)];
    }

    return processedEmbeddings[0]; // Return a single vector
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}

module.exports = { embedText };
