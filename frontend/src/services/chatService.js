import api from './api';

// Sends a user message to the RAG chat endpoint and returns the AI response + sources
export const sendChatMessage = async (message) => {
  const { data } = await api.post('/chat', { message });
  return data;
};

// Fetches existing chat history for the current session
export const fetchChatHistory = async () => {
  const { data } = await api.get('/chat/history');
  return data;
};