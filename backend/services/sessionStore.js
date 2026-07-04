const mongoose = require('mongoose');
const SESSION_TIMEOUT_MS = (process.env.SESSION_TIMEOUT_MINUTES || 20) * 60 * 1000;

// In-memory store holding raw file buffers, embeddings, and FAISS indexes.
// Keyed by userId. NEVER persisted to disk or MongoDB — RAM only, per privacy requirement.
const sessionStore = new Map();

// Retrieves in-memory session data for a user
const getSession = (userId) => sessionStore.get(userId.toString());

// Creates or overwrites in-memory session data for a user, and starts an inactivity timer
const setSession = (userId, data) => {
  const key = userId.toString();
  clearExistingTimer(key);

  const timer = setTimeout(() => {
    console.log(`Session expired due to inactivity for user: ${key}`);
    deleteSession(userId);
  }, SESSION_TIMEOUT_MS);

  sessionStore.set(key, { ...data, _timer: timer });
};

// Resets the inactivity timer — call this on every chat/upload activity
const touchSession = (userId) => {
  const key = userId.toString();
  const session = sessionStore.get(key);
  if (!session) return;

  clearExistingTimer(key);

  session._timer = setTimeout(() => {
    console.log(`Session expired due to inactivity for user: ${key}`);
    deleteSession(userId);
  }, SESSION_TIMEOUT_MS);

  sessionStore.set(key, session);
};

// Clears any existing timeout for a user to prevent memory leaks
const clearExistingTimer = (key) => {
  const existing = sessionStore.get(key);
  if (existing?._timer) {
    clearTimeout(existing._timer);
  }
};

// Deletes in-memory session data and releases references for GC.
// Also removes the corresponding MongoDB metadata document.
const deleteSession = (userId) => {
  const key = userId.toString();
  const session = sessionStore.get(key);
  if (session) {
    clearExistingTimer(key);
    session.fileBuffer = null;
    session.vectorStore = null;
    session.chatHistory = null;
  }
  sessionStore.delete(key);

  // Lazy require to avoid circular dependency issues at module load time
  const Session = require('../models/Session');
  Session.findOneAndDelete({ user: userId }).catch((err) =>
    console.error('Failed to delete session metadata:', err.message)
  );
};

module.exports = { sessionStore, getSession, setSession, touchSession, deleteSession };