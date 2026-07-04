import api from './api';

// Fetches current session status (active document, file info)
export const getSessionInfo = async () => {
  const { data } = await api.get('/session');
  return data;
};

// Ends the current conversation — triggers full server-side cleanup
export const endSession = async () => {
  const { data } = await api.delete('/session');
  return data;
};