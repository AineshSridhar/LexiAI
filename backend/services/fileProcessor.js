const fs = require("fs");
const { embedText } = require("./embeddings");
const { storeEmbeddings } = require("./vectorStore");
const pdfParse = require("pdf-parse");

async function processFile(filePath) {
  try {
    let text;
    if (filePath.endsWith(".pdf")) {
      const data = await pdfParse(fs.readFileSync(filePath));
      text = data.text;
    } else {
      text = fs.readFileSync(filePath, "utf8");
    }

    const embeddings = await embedText(text);
    await storeEmbeddings(embeddings, text);
    return text;
  } catch (error) {
    throw new Error("Error processing file: " + error.message);
  }
}

module.exports = { processFile };
