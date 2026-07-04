const asyncHandler = require('express-async-handler');
const { getSession, touchSession } = require('../services/sessionStore');
const { retrieveRelevantChunks } = require('../services/ragService');
const { getLLMModel } = require('../services/llmService');

// @desc    Send a message and get an AI-generated answer using RAG
// @route   POST /api/chat
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    res.status(400);
    throw new Error('Message cannot be empty');
  }

  const userId = req.user._id;
  const session = getSession(userId);

  if (!session || !session.vectorStore) {
    res.status(404);
    throw new Error('No active document session found. Please upload a document first.');
  }

  // Retrieve top relevant chunks from the in-memory FAISS index
  const relevantDocs = await retrieveRelevantChunks(session.vectorStore, message, 4);

  const context = relevantDocs
    .map((doc, i) => `[Source ${i + 1}]: ${doc.pageContent}`)
    .join('\n\n');

  const prompt = `You are a helpful assistant answering questions based ONLY on the provided document context. If the answer isn't in the context, say you don't have enough information.

Context:
${context}

Question: ${message}

Answer clearly and concisely, referencing sources like [Source 1] where relevant.`;

  const model = getLLMModel();
  const result = await model.generateContent(prompt);
  const answer = result.response.text();

  // Update in-memory chat history (RAM only)
  session.chatHistory.push({ role: 'user', content: message });
  session.chatHistory.push({ role: 'assistant', content: answer });
  touchSession(userId);

  res.status(200).json({
    success: true,
    answer,
    sources: relevantDocs.map((doc) => ({
      chunkIndex: doc.metadata.chunkIndex,
      source: doc.metadata.source,
      snippet: doc.pageContent.slice(0, 150) + '...',
    })),
  });
});

// @desc    Get current session's chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = asyncHandler(async (req, res) => {
  const session = getSession(req.user._id);

  res.status(200).json({
    success: true,
    chatHistory: session?.chatHistory || [],
    fileName: session?.fileName || null,
  });
});

module.exports = { sendMessage, getChatHistory };