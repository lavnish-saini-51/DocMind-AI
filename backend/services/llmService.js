const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initializes Gemini client for generating chat responses
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Returns the Gemini model instance used for RAG-based answer generation
const getLLMModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

module.exports = { getLLMModel };