exports.queryContract = async (req, res) => {
    try {
        const { query } = req.body;
        const response = await retrieveSimilarDocs(query); // Ensure this function exists and is correctly imported
        res.json(response);
    } catch (error) {
        console.error("Error in queryContract:", error); // Log error to console
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
