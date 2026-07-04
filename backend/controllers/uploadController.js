const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const { setSession, getSession, deleteSession } = require('../services/sessionStore');
const { getFileCategory } = require('../utils/fileTypeHelper');

// @desc    Upload a document (PDF/Image/Resume) — replaces any existing session
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

  // If a previous session exists, wipe its in-memory data first (embeddings, buffer, chat)
  const existingSession = getSession(userId);
  if (existingSession) {
    deleteSession(userId);
  }

  // Store raw file buffer in RAM only — embeddings/vectorStore added later in RAG step
  setSession(userId, {
    fileName: req.file.originalname,
    fileType: fileCategory,
    fileBuffer: req.file.buffer,
    mimetype: req.file.mimetype,
    embeddings: null,
    vectorStore: null,
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
    message: 'File uploaded successfully',
    file: {
      name: req.file.originalname,
      type: fileCategory,
      size: req.file.size,
    },
  });
});

module.exports = { uploadFile };