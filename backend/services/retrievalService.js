const { pineconeIndex } = require("./pineconeClient"); // Ensure this is correctly set up

async function retrieveSimilarDocs(queryVector, topK = 5) {
    try {
        if (!queryVector || !Array.isArray(queryVector)) {
            throw new Error("Invalid query vector provided");
        }

        const queryResult = await pineconeIndex.query({
            vector: queryVector,
            topK: topK,
            includeMetadata: true, // Include metadata if needed
        });

        return queryResult.matches.map(match => ({
            id: match.id,
            score: match.score,
            metadata: match.metadata
        }));
    } catch (error) {
        console.error("Error retrieving similar documents:", error);
        throw error;
    }
}

module.exports = { retrieveSimilarDocs };
