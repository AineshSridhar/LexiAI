const { embedText } = require("./embeddings");
const { retrieveRelevantDocs } = require("./vectorStore");
const axios = require("axios");
require("dotenv").config();

async function queryContracts(question) {
  try {
    const queryEmbeddings = await embedText(question);
    const relevantDocs = await retrieveRelevantDocs(queryEmbeddings);
    
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/text:generate",
      { 
        model: "gemini-1", 
        prompt: `Based on the following contract:\n${relevantDocs}\n\nAnswer this query: ${question}` 
      },
      { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error in queryContracts:", error.response ? error.response.data : error.message);
    throw new Error("Query processing failed. Please check the logs.");
  }
}

module.exports = { queryContracts };
