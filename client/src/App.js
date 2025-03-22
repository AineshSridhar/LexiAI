import { useState } from "react";
import axios from "axios";

export default function LegalAnalysisApp() {
  const [document, setDocument] = useState(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleUpload = async () => {
    if (!document) return alert("Please upload a document");
    const formData = new FormData();
    formData.append("file", document);
    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      alert("Document uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const handleQuery = async () => {
    try {
      const res = await axios.post("http://localhost:5000/query", { query });
      setResponse(res.data.answer);
    } catch (error) {
      console.error(error);
      alert("Error fetching response");
    }
  };

  return (
    <div className="p-5 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Lexi AI - Legal Contract Analyzer</h1>
      <input
        type="file"
        onChange={(e) => setDocument(e.target.files[0])}
        className="mb-3"
      />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload Document</button>

      <input
        type="text"
        placeholder="Ask about contract clauses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 mt-4 w-full max-w-lg"
      />
      <button onClick={handleQuery} className="bg-green-500 text-white px-4 py-2 mt-2 rounded">Analyze</button>

      {response && <p className="mt-4 p-3 bg-gray-100 rounded">{response}</p>}
    </div>
  );
}
