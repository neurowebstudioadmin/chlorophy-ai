import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Download, FileCode, Palette, Zap } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { chlorophyTheme } from '../../styles/chlorophy-theme';
import toast, { Toaster } from 'react-hot-toast';

const files = [
  { name: 'index.html', language: 'html', icon: '🌐', color: '#E34C26' },
  { name: 'style.css', language: 'css', icon: '🎨', color: '#264DE4' },
  { name: 'script.js', language: 'javascript', icon: '⚡', color: '#F7DF1E' },
];

export default function CodePanel({ generatedCode, projectFiles }) {
  const [activeFile, setActiveFile] = useState(0);
  const [copiedFile, setCopiedFile] = useState(null);
  const [hoveredLine, setHoveredLine] = useState(null);

  // Extract files from project data
  const getFileContent = (fileName) => {
    if (!projectFiles) {
      // Fallback: if single HTML, show it in index.html
      if (fileName === 'index.html') return generatedCode || '';
      return '// File not generated yet';
    }
    return projectFiles[fileName] || '// File not available';
  };

  const handleCopy = (fileName, content) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    
    toast.success(`${fileName} copied!`, {
      icon: '📋',
      style: {
        background: chlorophyTheme.colors.dark,
        color: chlorophyTheme.colors.primary,
        border: `1px solid ${chlorophyTheme.colors.primary}40`,
      },
    });
    
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownload = (fileName, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`${fileName} downloaded!`, {
      icon: '💾',
      style: {
        background: chlorophyTheme.colors.dark,
        color: chlorophyTheme.colors.accent,
        border: `1px solid ${chlorophyTheme.colors.accent}40`,
      },
    });
  };

  const currentFile = files[activeFile];
  const currentContent = getFileContent(currentFile.name);
  const lineCount = currentContent.split('\n').length;

  return (
    <div 
      className="h-full flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: chlorophyTheme.colors.dark,
        border: `1px solid ${chlorophyTheme.colors.primary}20`,
      }}
    >
      <Toaster position="top-right" />

      {/* Header with File Tabs */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: 'rgba(26, 31, 58, 0.6)',
          borderColor: `${chlorophyTheme.colors.primary}20`,
        }}
      >
        {/* File Tabs */}
        <div className="flex items-center gap-2">
          {files.map((file, index) => {
            const isActive = activeFile === index;
            return (
              <motion.button
                key={file.name}
                onClick={() => setActiveFile(index)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: isActive 
                    ? `${file.color}20` 
                    : 'transparent',
                  border: `1px solid ${isActive ? file.color : 'transparent'}`,
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-file"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `${file.color}15`,
                      boxShadow: `0 0 20px ${file.color}40`,
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <span className="relative text-xl">{file.icon}</span>
                <span 
                  className="relative text-sm font-medium"
                  style={{
                    color: isActive ? file.color : '#ffffff60',
                    fontFamily: chlorophyTheme.fonts.code,
                  }}
                >
                  {file.name}
                </span>

                {/* Glow effect on active */}
                {isActive && (
                  <motion.div
                    className="absolute -inset-1 rounded-lg -z-10"
                    style={{
                      background: `radial-gradient(circle, ${file.color}30, transparent 70%)`,
                    }}
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => handleCopy(currentFile.name, currentContent)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: `${chlorophyTheme.colors.primary}20`,
              border: `1px solid ${chlorophyTheme.colors.primary}40`,
            }}
          >
            {copiedFile === currentFile.name ? (
              <Check size={16} style={{ color: chlorophyTheme.colors.primary }} />
            ) : (
              <Copy size={16} style={{ color: chlorophyTheme.colors.primary }} />
            )}
            <span 
              className="text-xs font-medium"
              style={{ 
                color: chlorophyTheme.colors.primary,
                fontFamily: chlorophyTheme.fonts.body,
              }}
            >
              {copiedFile === currentFile.name ? 'Copied!' : 'Copy'}
            </span>
          </motion.button>

          <motion.button
            onClick={() => handleDownload(currentFile.name, currentContent)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: `${chlorophyTheme.colors.accent}20`,
              border: `1px solid ${chlorophyTheme.colors.accent}40`,
            }}
          >
            <Download size={16} style={{ color: chlorophyTheme.colors.accent }} />
            <span 
              className="text-xs font-medium"
              style={{ 
                color: chlorophyTheme.colors.accent,
                fontFamily: chlorophyTheme.fonts.body,
              }}
            >
              Download
            </span>
          </motion.button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Line Numbers */}
        <div 
          className="flex flex-col py-4 px-2 text-right select-none border-r"
          style={{
            background: 'rgba(10, 14, 39, 0.5)',
            borderColor: `${chlorophyTheme.colors.primary}10`,
            fontFamily: chlorophyTheme.fonts.code,
            fontSize: '12px',
            color: '#ffffff30',
          }}
        >
          {[...Array(lineCount)].map((_, i) => (
            <div
              key={i}
              className="px-2 leading-6 transition-all"
              onMouseEnter={() => setHoveredLine(i)}
              onMouseLeave={() => setHoveredLine(null)}
              style={{
                color: hoveredLine === i ? currentFile.color : '#ffffff30',
                background: hoveredLine === i ? `${currentFile.color}10` : 'transparent',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFile}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <SyntaxHighlighter
                language={currentFile.language}
                style={vscDarkPlus}
                showLineNumbers={false}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  background: 'transparent',
                  fontSize: '13px',
                  fontFamily: chlorophyTheme.fonts.code,
                  lineHeight: '1.6',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: chlorophyTheme.fonts.code,
                  }
                }}
              >
                {currentContent}
              </SyntaxHighlighter>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Stats */}
      <div 
        className="flex items-center justify-between px-4 py-2 border-t text-xs"
        style={{
          background: 'rgba(26, 31, 58, 0.6)',
          borderColor: `${chlorophyTheme.colors.primary}20`,
          fontFamily: chlorophyTheme.fonts.code,
        }}
      >
        <div className="flex items-center gap-4">
          <span style={{ color: '#ffffff60' }}>
            <FileCode size={14} className="inline mr-1" style={{ color: currentFile.color }} />
            {currentFile.language.toUpperCase()}
          </span>
          <span style={{ color: '#ffffff60' }}>
            {lineCount} lines
          </span>
          <span style={{ color: '#ffffff60' }}>
            {currentContent.length} chars
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Zap size={12} style={{ color: chlorophyTheme.colors.primary }} />
          <span style={{ color: chlorophyTheme.colors.primary }}>
            Live Code
          </span>
        </div>
      </div>
    </div>
  );
}