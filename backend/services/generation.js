const { retrieveRelevantDocs } = require("./embeddings");
const { generateResponse } = require("./llm");

async function generateAnswer(query) {
  try {
    const relevantDocs = await retrieveRelevantDocs(query);
    const response = await generateResponse(`${relevantDocs}\nUser Query: ${query}`);
    return response;
  } catch (error) {
    console.error("Error in generateAnswer:", error.stack || error);
    throw error;
  }
}

module.exports = { generateAnswer };
