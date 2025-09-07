// src/app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET_KEY || 'your_secret_key_for_protection';

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    setUploading(true);
    setUploadStatus('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_SECRET}`
        },
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setUploadStatus('PDF uploaded and processed successfully!');
        console.log('Processing result:', result);
      } else {
        setUploadStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setUploadStatus('Error uploading PDF');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleQuestionSubmit = async () => {
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    setAsking(true);
    setAnswer('');

    try {
      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_SECRET}`
        },
        body: JSON.stringify({ question }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setAnswer(result.answer || 'No answer received');
      } else {
        setAnswer(`Error: ${result.error}`);
      }
    } catch (error) {
      setAnswer('Error getting answer');
      console.error('Question error:', error);
    } finally {
      setAsking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleQuestionSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            PDF Q&A Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload any PDF document and ask questions about its content. 
            Our AI will analyze the document and provide accurate answers based on the text.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* PDF Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Step 1: Upload PDF</h2>
                <p className="text-gray-600">Choose a PDF file to analyze</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              
              <button
                onClick={handleFileUpload}
                disabled={uploading || !file}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing PDF...
                  </>
                ) : (
                  'Upload & Process PDF'
                )}
              </button>
              
              {uploadStatus && (
                <div className={`p-4 rounded-lg border ${
                  uploadStatus.includes('Error') 
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                  <div className="flex items-center">
                    {uploadStatus.includes('Error') ? (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {uploadStatus}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Question Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Step 2: Ask Questions</h2>
                <p className="text-gray-600">Ask anything about your PDF content</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask a question about your PDF... (Ctrl+Enter to submit)"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none min-h-[100px] text-gray-700 placeholder-gray-400"
                  rows={3}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  Ctrl+Enter to submit
                </div>
              </div>
              
              <button
                onClick={handleQuestionSubmit}
                disabled={asking || !question.trim()}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                {asking ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Getting Answer...
                  </>
                ) : (
                  'Ask Question'
                )}
              </button>
            </div>

            {/* Answer Display */}
            {answer && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-indigo-100 rounded-full p-2 mr-4 mt-1">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-3">Answer:</h3>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {answer}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How to use:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Upload a PDF file using the upload section above</li>
              <li>Wait for the processing to complete (you'll see a success message)</li>
              <li>Ask questions about the PDF content in natural language</li>
              <li>The AI will provide answers based on the document's content</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}