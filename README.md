# DocMind AI

A privacy-first AI document assistant. Upload a PDF, image, or resume and chat with it using Retrieval-Augmented Generation (RAG) — powered by LangChain.js, Hugging Face embeddings, and Google Gemini.

## Key Features

- 🔒 **Privacy-first**: Embeddings and FAISS vector indexes exist only in server RAM — never persisted to disk or database
- 💬 **RAG-powered chat**: Ask questions about your uploaded document and get context-aware answers with source references
- 📄 **Multi-format support**: PDF, images (with OCR), and resumes (.docx)
- 🔐 **Secure authentication**: JWT-based auth with hashed passwords
- 🧹 **Auto cleanup**: Sessions and all associated data are automatically deleted after 20 minutes of inactivity, or instantly via "End Conversation"
- 🌓 **Light/Dark mode**: Full theme support across the app
- 📱 **Fully responsive**: Mobile, tablet, and desktop optimized

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, React Markdown

**Backend:** Node.js, Express.js, LangChain.js

**Database:** MongoDB (stores only users & minimal session metadata — never embeddings)

**AI:**
- Embeddings — Hugging Face Inference API (`sentence-transformers/all-MiniLM-L6-v2`)
- LLM — Google Gemini API (`gemini-1.5-flash`)
- Vector Store — FAISS (in-memory, RAM only)

**Deployment:** Vercel (frontend), Render (backend)

## Project Structure

DocMind-AI/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth, upload, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # RAG pipeline, embeddings, LLM, session store
│   ├── utils/           # Helper functions
│   └── server.js
└── frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── context/     # Auth & Theme context
│   ├── pages/       # Landing, Login, Signup, Upload, Chat
│   ├── services/    # API service layer
│   └── App.jsx
└── index.html


## Getting Started With Project

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Hugging Face API key
- Google Gemini API key

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`) with your MongoDB URI, JWT secret, and API keys.

```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

**Backend (`.env`)**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
HUGGINGFACE_API_KEY=your_huggingface_api_key
GEMINI_API_KEY=your_gemini_api_key
SESSION_TIMEOUT_MINUTES=**
```

**Frontend (`.env`)**
```env
VITE_API_URL=http://localhost:5000/api
```

## How It Works

1. User uploads a document (PDF/Image/Resume)
2. Text is extracted and split into chunks
3. Chunks are embedded and stored in an in-memory FAISS vector index
4. User asks a question in the chat interface
5. Relevant chunks are retrieved via similarity search
6. Gemini generates an answer using the retrieved context
7. On session end or 20-minute inactivity, all data (file, embeddings, chat history) is permanently deleted from server memory

## License

This project is for educational/personal use.