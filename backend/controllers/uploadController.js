const { processFile } = require("../services/fileProcessor");

exports.processFile = async (req, res) => {
    try {
        const text = await processFile(req.file.path);
        res.json({ message: "File processed successfully", text });
    } catch (error) {
        console.error("Error in processFile:", error.stack || error);
        res.status(500).json({ error: error.message || "Error processing file" });
    }
};
