import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Download, Copy, Check, ChevronDown } from 'lucide-react';
import { chlorophyTheme } from '../../styles/chlorophy-theme';
import { downloadProjectZip } from '../../utils/zipUtils';

const CodePanel = ({ generatedCode, projectFiles }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const downloadRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setDownloadMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = [
    { id: 'html', label: 'HTML', icon: '📄', language: 'html', code: projectFiles?.html || '' },
    { id: 'css', label: 'CSS', icon: '🎨', language: 'css', code: projectFiles?.css || '' },
    { id: 'javascript', label: 'JavaScript', icon: '⚡', language: 'javascript', code: projectFiles?.javascript || '' }
  ];

  const currentTab = tabs.find(t => t.id === activeTab);
  const currentCode = currentTab?.code || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadSingle = (fileType) => {
    const fileMap = {
      html: { name: 'index.html', code: projectFiles?.html || '' },
      css: { name: 'style.css', code: projectFiles?.css || '' },
      javascript: { name: 'script.js', code: projectFiles?.javascript || '' }
    };

    const file = fileMap[fileType];
    const blob = new Blob([file.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadMenuOpen(false);
  };

  const handleDownloadAll = async () => {
    try {
      const titleMatch = generatedCode.match(/<title[^>]*>(.*?)<\/title>/i);
      const projectName = titleMatch ? titleMatch[1].replace(/[^a-z0-9]/gi, '-').toLowerCase() : 'chlorophy-project';
      
      console.log('Downloading ZIP with files:', {
        html: projectFiles?.html?.length || 0,
        css: projectFiles?.css?.length || 0,
        js: projectFiles?.javascript?.length || 0
      });
      
      await downloadProjectZip(projectFiles, projectName);
      setDownloadMenuOpen(false);
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      alert('Error downloading project!');
    }
  };

  const getFileSize = (code) => {
    if (!code) return '0 B';
    const bytes = new Blob([code]).size;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const downloadOptions = [
    { id: 'html', label: 'Download HTML', icon: '📄', action: () => handleDownloadSingle('html') },
    { id: 'css', label: 'Download CSS', icon: '🎨', action: () => handleDownloadSingle('css') },
    { id: 'javascript', label: 'Download JavaScript', icon: '⚡', action: () => handleDownloadSingle('javascript') },
    { id: 'divider', isDivider: true },
    { id: 'all', label: 'Download All (ZIP)', icon: '📦', action: handleDownloadAll }
  ];

  return (
    <div 
      className="h-full flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: chlorophyTheme.colors.dark,
        border: `1px solid ${chlorophyTheme.colors.secondary}20`,
      }}
    >
      <div 
        className="px-6 py-4 border-b backdrop-blur-xl"
        style={{
          background: 'rgba(26, 31, 58, 0.6)',
          borderColor: `${chlorophyTheme.colors.secondary}20`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 
              className="text-lg font-semibold"
              style={{
                color: chlorophyTheme.colors.secondary,
                fontFamily: chlorophyTheme.fonts.display,
              }}
            >
              Source Code
            </h2>
            <p 
              className="text-sm"
              style={{
                color: '#ffffff60',
                fontFamily: chlorophyTheme.fonts.body,
              }}
            >
              View and download your files
            </p>
          </div>

          {currentCode && (
            <div className="flex gap-2">
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${chlorophyTheme.colors.secondary}40`,
                  color: chlorophyTheme.colors.secondary,
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>

              <div className="relative" ref={downloadRef}>
                <motion.button
                  onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                  style={{
                    background: chlorophyTheme.colors.gradients.primary,
                    color: chlorophyTheme.colors.dark,
                  }}
                >
                  <Download size={16} />
                  Download
                  <ChevronDown size={16} />
                </motion.button>

                <AnimatePresence>
                  {downloadMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 rounded-xl overflow-hidden shadow-2xl z-50"
                      style={{
                        background: 'rgba(26, 31, 58, 0.95)',
                        border: `1px solid ${chlorophyTheme.colors.secondary}40`,
                        backdropFilter: 'blur(20px)',
                        minWidth: '220px',
                      }}
                    >
                      {downloadOptions.map((option) => {
                        if (option.isDivider) {
                          return (
                            <div
                              key={option.id}
                              className="my-1"
                              style={{
                                height: '1px',
                                background: 'rgba(255, 255, 255, 0.1)',
                              }}
                            />
                          );
                        }

                        return (
                          <motion.button
                            key={option.id}
                            onClick={option.action}
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm font-medium transition-colors"
                            style={{
                              color: option.id === 'all' ? chlorophyTheme.colors.primary : '#ffffff',
                            }}
                          >
                            <span className="text-lg">{option.icon}</span>
                            <span>{option.label}</span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {tabs.map(tab => {
            const hasCode = tab.code && tab.code.length > 50;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all"
                style={{
                  background: activeTab === tab.id 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${activeTab === tab.id 
                    ? 'rgba(16, 185, 129, 0.4)' 
                    : 'rgba(255, 255, 255, 0.1)'}`,
                  color: activeTab === tab.id ? '#10B981' : '#ffffff80',
                }}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="text-xs opacity-60">
                  {getFileSize(tab.code)}
                </span>
                {hasCode && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-900">
        {!generatedCode ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💻
              </motion.div>
              <p className="text-lg mb-2" style={{ color: '#ffffff80' }}>
                No code generated yet
              </p>
              <p className="text-sm" style={{ color: '#ffffff40' }}>
                Generate a website to view the source code
              </p>
            </div>
          </div>
        ) : currentCode ? (
          <SyntaxHighlighter
            language={currentTab.language}
            style={vscDarkPlus}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: 'transparent',
              fontSize: '0.875rem',
            }}
          >
            {currentCode}
          </SyntaxHighlighter>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4 opacity-50">{currentTab?.icon}</div>
              <p className="text-gray-500">No {currentTab?.label} code</p>
            </div>
          </div>
        )}
      </div>

      {currentCode && (
        <div 
          className="px-6 py-3 border-t flex items-center justify-between text-sm"
          style={{
            background: 'rgba(26, 31, 58, 0.6)',
            borderColor: `${chlorophyTheme.colors.secondary}20`,
            color: '#ffffff80',
          }}
        >
          <div className="flex gap-6">
            <span>{currentCode.split('\n').length} lines</span>
            <span>{currentCode.length.toLocaleString()} chars</span>
            <span>{getFileSize(currentCode)}</span>
          </div>
          <span 
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10B981',
            }}
          >
            {currentTab?.language.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

export default CodePanel;