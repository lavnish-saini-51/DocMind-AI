const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');

// Gemini embedding model via LangChain's embeddings interface
// Uses the same GEMINI_API_KEY already configured for the LLM
const getEmbeddingsModel = () => {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-embedding-001',
  });
};

module.exports = { getEmbeddingsModel };