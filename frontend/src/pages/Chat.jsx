import { useNavigate } from 'react-router-dom';
import { endSession } from '../services/sessionService';
import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import ChatMessage from '../components/ChatMessage';
import { sendChatMessage, fetchChatHistory } from '../services/chatService';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const handleEndConversation = async () => {
    const confirmed = window.confirm(
        'This will permanently delete your document, chat history, and all data. Continue?'
    );
    if (!confirmed) return;

    try {
        await endSession();
        toast.success('Conversation ended. All data deleted.');
        navigate('/upload');
    } catch (error) {
        toast.error('Failed to end conversation');
    }
  };

  // Load existing chat history for this session on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchChatHistory();
        setMessages(data.chatHistory || []);
        setFileName(data.fileName);
      } catch (error) {
        toast.error('Failed to load chat history');
      }
    };
    loadHistory();
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChatMessage(userMessage.content);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer, sources: data.sources },
      ]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to get a response');
      setMessages((prev) => prev.slice(0, -1)); // rollback user message on failure
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-black">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
         Chatting with: <span className="font-medium text-gray-900 dark:text-white">{fileName || 'your document'}</span>
      </p>
      <button
        onClick={handleEndConversation}
        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        End Conversation
      </button>
    </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Ask a question about your document to get started.
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} sources={msg.sources} />
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about your document..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;