import { useState } from 'react';
import ChatInterface from './ChatInterface';
import LivePreview from './LivePreview';

export default function Builder() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCodeGenerated = (code) => {
    setGeneratedCode(code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🌿</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-chlorophy-green via-chlorophy-cyan to-chlorophy-green bg-clip-text text-transparent">Chlorophy AI Builder</h1>
                <p className="text-sm text-gray-500">Powered by Anthropic</p>
              </div>
            </div>
            <a 
              href="/dashboard"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Interface */}
          <ChatInterface 
            onCodeGenerated={handleCodeGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            generatedCode={generatedCode}
          />

          {/* Live Preview */}
          <LivePreview 
            code={generatedCode}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}