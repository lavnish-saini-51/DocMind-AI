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
- Embeddings — gemini embedding model (gemini-embedding-001)
- LLM — Google Gemini API (`gemini-3.8-flash`)
- Vector Store — FAISS (in-memory, RAM only)

**Deployment:** Vercel (frontend), Render (backend)

## Project Structure

DocMind-AI/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── uploadController.js
│   │   ├── chatController.js
│   │   └── sessionController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Session.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── chatRoutes.js
│   │   └── sessionRoutes.js
│   │
│   ├── services/
│   │   ├── sessionStore.js
│   │   ├── embeddingService.js
│   │   ├── llmService.js
│   │   ├── textExtractionService.js
│   │   └── ragService.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── fileTypeHelper.js
│   │
│   ├── uploads/            (empty — never actually used, since files stay in-memory)
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Logo.jsx
    │   │   ├── ChatMessage.jsx
    │   │   └── ProtectedRoute.jsx
    │   │
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   │
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Upload.jsx
    │   │   └── Chat.jsx
    │   │
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js       
    │   │   ├── uploadService.js
    │   │   ├── chatService.js
    │   │   └── sessionService.js
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── .env
    ├── vercel.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
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