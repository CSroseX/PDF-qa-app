// src/app/api/upload-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import storage from '../../../lib/storage';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Simple text chunking function
function chunkText(text: string, chunkSize: number = 1000): string[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

// Simple embedding simulation (Gemini doesn't have embedding API like OpenAI)
// In production, you'd use a proper embedding service
async function generateSimpleEmbedding(text: string): Promise<number[]> {
  // Create a simple hash-based embedding for demo purposes
  // In production, use Google's embedding API or another service
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
    hash = hash & hash; // Convert to 32bit integer
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

    const formData = await request.formData();
    const file = formData.get('pdf') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Simple text extraction (for demo - in production use proper PDF parser)
    let pdfContent = '';
    
    try {
      // Try to use pdf-parse if available
      const pdf = require('pdf-parse');
      const pdfData = await pdf(buffer);
      pdfContent = pdfData.text;
    } catch (error) {
      // Fallback: simulate PDF content for demo
      console.log('PDF parsing failed, using fallback content');
      pdfContent = `PDF parsing failed for file: ${file.name}. This is a placeholder. Please install pdf-parse properly or check the PDF file format.`;
    }

    const chunks = chunkText(pdfContent, 800);
    console.log(`Processing ${chunks.length} chunks from PDF`);

    // Generate embeddings for each chunk using simple hash-based approach
    const embeddings = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1}/${chunks.length}`);
      const embedding = await generateSimpleEmbedding(chunks[i]);
      embeddings.push(embedding);
    }

    // Store in memory storage
    storage.setData({ pdfContent, chunks, embeddings });

    return NextResponse.json({
      message: 'PDF processed successfully',
      chunksCount: chunks.length,
      contentPreview: pdfContent.substring(0, 200) + '...'
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' }, 
      { status: 500 }
    );
  }
}