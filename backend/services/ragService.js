const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { Document } = require('@langchain/core/documents');
const { getEmbeddingsModel } = require('./embeddingService');

// Splits extracted text into overlapping chunks suitable for embedding + retrieval
const chunkText = async (text, fileName) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150,
  });

  const chunks = await splitter.splitText(text);

  // Wrap each chunk as a LangChain Document with metadata for source referencing
  return chunks.map(
    (chunk, index) =>
      new Document({
        pageContent: chunk,
        metadata: { source: fileName, chunkIndex: index },
      })
  );
};

// Builds an in-memory FAISS vector store from document chunks
// This index lives ONLY in RAM for the lifetime of the session — never persisted to disk
const buildVectorStore = async (documents) => {
  const embeddings = getEmbeddingsModel();
  const vectorStore = await FaissStore.fromDocuments(documents, embeddings);
  return vectorStore;
};

// Retrieves the top-k most relevant chunks for a given query
const retrieveRelevantChunks = async (vectorStore, query, k = 4) => {
  const results = await vectorStore.similaritySearch(query, k);
  return results;
};

module.exports = { chunkText, buildVectorStore, retrieveRelevantChunks };