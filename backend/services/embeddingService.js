const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');

// Wraps Hugging Face's embedding model via LangChain's embeddings interface
// Model: sentence-transformers/all-MiniLM-L6-v2 — fast, lightweight, good for RAG
const getEmbeddingsModel = () => {
  return new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACE_API_KEY,
    model: 'sentence-transformers/all-MiniLM-L6-v2',
  });
};

module.exports = { getEmbeddingsModel };