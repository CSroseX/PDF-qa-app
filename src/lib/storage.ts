// src/lib/storage.ts
// Simple in-memory storage for demo purposes
// In production, use a proper vector database like Pinecone, Weaviate, or Chroma

interface StorageData {
  chunks: string[];
  embeddings: number[][];
  pdfContent: string;
}

class MemoryStorage {
  private data: StorageData = {
    chunks: [],
    embeddings: [],
    pdfContent: ''
  };

  setData(data: Partial<StorageData>) {
    this.data = { ...this.data, ...data };
    console.log(`Storage updated: ${this.data.chunks.length} chunks stored`);
  }

  getData(): StorageData {
    return this.data;
  }

  clear() {
    this.data = {
      chunks: [],
      embeddings: [],
      pdfContent: ''
    };
    console.log('Storage cleared');
  }

  hasData(): boolean {
    return this.data.chunks.length > 0;
  }

  getStats() {
    return {
      chunksCount: this.data.chunks.length,
      embeddingsCount: this.data.embeddings.length,
      contentLength: this.data.pdfContent.length
    };
  }
}

// Singleton instance
const storage = new MemoryStorage();
export default storage;