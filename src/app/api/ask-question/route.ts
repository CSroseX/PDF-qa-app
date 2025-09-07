// src/app/api/ask-question/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import storage from '../../../lib/storage';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Simple cosine similarity function
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Simple embedding generation (same as upload route)
async function generateSimpleEmbedding(text: string): Promise<number[]> {
  const hash = simpleHash(text);
  const embedding = new Array(384).fill(0).map((_, i) => {
    return Math.sin(hash * (i + 1)) * Math.cos(hash * (i + 1) * 0.1);
  });
  return embedding;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) / 1000000;
}

export async function POST(request: NextRequest) {
  try {
    // Simple API protection
    const apiKey = request.headers.get('authorization');
    if (apiKey !== `Bearer ${process.env.API_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { question } = body;
    
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Check if we have processed content
    if (!storage.hasData()) {
      return NextResponse.json(
        { error: 'No PDF content available. Please upload a PDF first.' }, 
        { status: 400 }
      );
    }

    const { chunks, embeddings } = storage.getData();

    // Generate embedding for the question
    const questionEmbedding = await generateSimpleEmbedding(question);

    // Find most relevant chunks using cosine similarity
    const similarities = embeddings.map((embedding, index) => ({
      index,
      similarity: cosineSimilarity(questionEmbedding, embedding),
      chunk: chunks[index]
    }));

    // Get top 3 most relevant chunks
    const topChunks = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map(item => item.chunk);

    // Create context from top chunks
    const context = topChunks.join('\n\n');

    // Generate answer using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a helpful assistant that answers questions based on the provided context. If the answer cannot be found in the context, say so clearly.

Context: ${context}

Question: ${question}

Answer:`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return NextResponse.json({
      answer,
      relevantChunks: topChunks.length,
      topSimilarity: Math.round(similarities[0].similarity * 100) / 100
    });

  } catch (error) {
    console.error('Error answering question:', error);
    return NextResponse.json(
      { error: 'Failed to answer question' }, 
      { status: 500 }
    );
  }
}