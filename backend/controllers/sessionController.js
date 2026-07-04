const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const { getSession, deleteSession } = require('../services/sessionStore');

// @desc    Get current session info (file name, type, message count)
// @route   GET /api/session
// @access  Private
const getSessionInfo = asyncHandler(async (req, res) => {
  const session = getSession(req.user._id);

  if (!session) {
    return res.status(200).json({ success: true, active: false });
  }

  res.status(200).json({
    success: true,
    active: true,
    fileName: session.fileName,
    fileType: session.fileType,
    messageCount: session.chatHistory.length,
  });
});

// @desc    End the current conversation — permanently wipe all session data
// @route   DELETE /api/session
// @access  Private
const endSession = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Wipe in-memory data: file buffer, embeddings, FAISS index, chat history
  deleteSession(userId);

  // Remove session metadata from MongoDB
  await Session.findOneAndDelete({ user: userId });

  res.status(200).json({
    success: true,
    message: 'Conversation ended and all data permanently deleted',
  });
});

module.exports = { getSessionInfo, endSession };