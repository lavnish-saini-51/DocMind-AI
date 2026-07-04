// In-memory store holding raw file buffers, embeddings, and FAISS indexes.
// Keyed by userId. NEVER persisted to disk or MongoDB — RAM only, per privacy requirement.
const sessionStore = new Map();

// Retrieves in-memory session data for a user
const getSession = (userId) => sessionStore.get(userId.toString());

// Creates or overwrites in-memory session data for a user
const setSession = (userId, data) => {
  sessionStore.set(userId.toString(), data);
};

// Deletes in-memory session data and releases references for GC
const deleteSession = (userId) => {
  const key = userId.toString();
  const session = sessionStore.get(key);
  if (session) {
    session.fileBuffer = null;
    session.embeddings = null;
    session.vectorStore = null;
    session.chatHistory = null;
  }
  sessionStore.delete(key);
};

module.exports = { sessionStore, getSession, setSession, deleteSession };