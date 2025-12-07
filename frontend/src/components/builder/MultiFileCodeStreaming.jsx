import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MultiFileCodeStreaming = ({ generationData, isGenerating }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [displayedCode, setDisplayedCode] = useState({
    html: '',
    css: '',
    javascript: ''
  });

  useEffect(() => {
    if (!generationData) return;

    console.log('MultiFileCodeStreaming received data:', {
      hasHtml: !!generationData.html,
      hasCSS: !!generationData.css,
      hasJS: !!generationData.javascript,
      htmlLength: generationData.html?.length || 0,
      cssLength: generationData.css?.length || 0,
      jsLength: generationData.javascript?.length || 0
    });

    // Set the code immediately
    setDisplayedCode({
      html: generationData.html || '',
      css: generationData.css || '',
      javascript: generationData.javascript || ''
    });

  }, [generationData]);

  const getFileSize = (code) => {
    if (!code) return '0 B';
    const bytes = new Blob([code]).size;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const tabs = [
    { id: 'html', label: 'HTML', icon: '📄', language: 'html' },
    { id: 'css', label: 'CSS', icon: '🎨', language: 'css' },
    { id: 'javascript', label: 'JavaScript', icon: '⚡', language: 'javascript' }
  ];

  const currentCode = displayedCode[activeTab] || '';
  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        {tabs.map(tab => {
          const code = displayedCode[tab.id];
          const hasCode = code && code.length > 50;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 flex items-center gap-2 border-b-2 transition-colors
                ${activeTab === tab.id 
                  ? 'border-blue-500 bg-gray-900 text-white' 
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
              <span className="text-xs opacity-60">
                {getFileSize(code)}
              </span>
              {hasCode && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-auto">
        {isGenerating && !currentCode ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">{currentTab?.icon}</div>
              <p>Generating {currentTab?.label}...</p>
            </div>
          </div>
        ) : currentCode ? (
          <SyntaxHighlighter
            language={currentTab?.language}
            style={vscDarkPlus}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '0.875rem'
            }}
          >
            {currentCode}
          </SyntaxHighlighter>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4 opacity-50">{currentTab?.icon}</div>
              <p>No {currentTab?.label} code generated</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {currentCode && (
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
          <div className="flex gap-4">
            <span>{currentCode.split('\n').length} lines</span>
            <span>{currentCode.length} characters</span>
            <span>{getFileSize(currentCode)}</span>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-gray-700 rounded">
              {currentTab?.language.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiFileCodeStreaming;