const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const { setSession, getSession, deleteSession } = require('../services/sessionStore');
const { getFileCategory } = require('../utils/fileTypeHelper');
const { extractText } = require('../services/textExtractionService');
const { chunkText, buildVectorStore } = require('../services/ragService');

// @desc    Upload a document (PDF/Image/Resume), extract text, and build in-memory RAG index
// @route   POST /api/upload
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const fileCategory = getFileCategory(req.file.mimetype);
  if (!fileCategory) {
    res.status(400);
    throw new Error('Unsupported file type');
  }

  const userId = req.user._id;

  // Wipe any previous session (embeddings, buffer, chat history) before processing new file
  const existingSession = getSession(userId);
  if (existingSession) {
    deleteSession(userId);
  }

  // Extract raw text based on file type
  const rawText = await extractText(req.file.buffer, fileCategory, req.file.mimetype);

  if (!rawText || rawText.trim().length === 0) {
    res.status(400);
    throw new Error('Could not extract any text from this file');
  }

  // Chunk text and build in-memory FAISS vector store (RAM only)
  const documents = await chunkText(rawText, req.file.originalname);
  const vectorStore = await buildVectorStore(documents);

  // Store everything in RAM — never written to disk or MongoDB
  setSession(userId, {
    fileName: req.file.originalname,
    fileType: fileCategory,
    mimetype: req.file.mimetype,
    vectorStore,
    chatHistory: [],
    createdAt: Date.now(),
  });

  // Persist ONLY metadata to MongoDB (upsert — one session per user)
  await Session.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      fileName: req.file.originalname,
      fileType: fileCategory,
      lastActivity: Date.now(),
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    message: 'File processed and ready for chat',
    file: {
      name: req.file.originalname,
      type: fileCategory,
      size: req.file.size,
    },
  });
});

module.exports = { uploadFile };