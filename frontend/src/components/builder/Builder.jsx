import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './ChatInterface';
import TabPortalSystem from './TabPortalSystem';
import CodePanel from './CodePanel';
import GalaxyView from './GalaxyView';
import DeployPanel from './DeployPanel';
import AIInsightPanel from './AIInsightPanel';
import { chlorophyTheme } from '../../styles/chlorophy-theme';

// Enhanced Preview Panel
function MagicPreview({ code, isGenerating }) {
  const [viewMode, setViewMode] = useState('desktop');

  const getPreviewWidth = () => {
    switch(viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const handleFullScreenPreview = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownloadZip = () => {
    if (!window.chlorophyZipData) {
      alert('Nessun progetto ZIP disponibile. Genera prima un sito!');
      return;
    }

    const { zipData, projectName } = window.chlorophyZipData;
    
    const byteCharacters = atob(zipData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/zip' });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div 
      className="h-full flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: chlorophyTheme.colors.dark,
        border: `1px solid ${chlorophyTheme.colors.secondary}20`,
      }}
    >
      {/* Header */}
      <div 
        className="px-6 py-4 border-b backdrop-blur-xl flex items-center justify-between"
        style={{
          background: 'rgba(26, 31, 58, 0.6)',
          borderColor: `${chlorophyTheme.colors.secondary}20`,
        }}
      >
        <div>
          <h2 
            className="text-lg font-semibold"
            style={{
              color: chlorophyTheme.colors.secondary,
              fontFamily: chlorophyTheme.fonts.display,
            }}
          >
            ✨ Magic Preview
          </h2>
          <p 
            className="text-sm"
            style={{
              color: '#ffffff60',
              fontFamily: chlorophyTheme.fonts.body,
            }}
          >
            Live website preview
          </p>
        </div>
        
        {/* View Mode Switcher */}
        <div 
          className="flex items-center gap-2 rounded-lg p-1"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          {['desktop', 'tablet', 'mobile'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
              style={{
                background: viewMode === mode 
                  ? `${chlorophyTheme.colors.secondary}30`
                  : 'transparent',
                color: viewMode === mode 
                  ? chlorophyTheme.colors.secondary
                  : '#ffffff60',
              }}
            >
              {mode === 'desktop' ? '🖥️' : mode === 'tablet' ? '📱' : '📱'} {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Area */}
      <div 
        className="flex-1 overflow-auto p-6"
        style={{
          background: 'rgba(10, 14, 39, 0.5)',
        }}
      >
        {!code && !isGenerating ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-6xl mb-4">👁️</div>
              <p 
                className="text-lg"
                style={{ color: '#ffffff80' }}
              >
                Preview will appear here
              </p>
              <p 
                className="text-sm mt-2"
                style={{ color: '#ffffff40' }}
              >
                Generate a website to see the live preview
              </p>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 rounded-full mx-auto mb-4"
                style={{
                  borderColor: chlorophyTheme.colors.secondary,
                  borderTopColor: 'transparent',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p 
                className="font-medium"
                style={{ color: '#ffffff80' }}
              >
                Generating your website...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg shadow-xl transition-all duration-300"
              style={{ 
                width: getPreviewWidth(), 
                minHeight: '600px',
                boxShadow: `0 0 40px ${chlorophyTheme.colors.secondary}40`,
              }}
            >
              <iframe
                srcDoc={code}
                className="w-full h-full rounded-lg"
                style={{ minHeight: '600px' }}
                title="Website Preview"
                sandbox="allow-scripts"
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {code && (
        <div 
          className="px-6 py-4 border-t flex gap-3"
          style={{
            background: 'rgba(26, 31, 58, 0.6)',
            borderColor: `${chlorophyTheme.colors.secondary}20`,
          }}
        >
          {window.chlorophyZipData && (
            <motion.button
              onClick={handleDownloadZip}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: `${chlorophyTheme.colors.accent}30`,
                border: `1px solid ${chlorophyTheme.colors.accent}40`,
                color: chlorophyTheme.colors.accent,
              }}
            >
              📦 Scarica ZIP
            </motion.button>
          )}
          
          <motion.button
            onClick={handleFullScreenPreview}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: `${chlorophyTheme.colors.secondary}30`,
              border: `1px solid ${chlorophyTheme.colors.secondary}40`,
              color: chlorophyTheme.colors.secondary,
            }}
          >
            🚀 Vedi Anteprima
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default function Builder() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [projectFiles, setProjectFiles] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const handleCodeGenerated = (code) => {
    setGeneratedCode(code);
    setActiveTab('preview');
  };

  const handleFileSelect = (index) => {
    setSelectedFileIndex(index);
    setActiveTab('code');
  };

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        background: chlorophyTheme.colors.gradients.hero,
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1800px] mx-auto mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 
              className="text-4xl font-bold"
              style={{
                fontFamily: chlorophyTheme.fonts.display,
                background: chlorophyTheme.colors.gradients.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              🌿 Chlorophy AI
            </h1>
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                background: `${chlorophyTheme.colors.primary}20`,
                color: chlorophyTheme.colors.primary,
                border: `1px solid ${chlorophyTheme.colors.primary}40`,
              }}
            >
              ✨ Living Code Interface
            </span>
          </div>

          {/* TabPortalSystem con z-index alto */}
          <div className="relative z-50">
            <TabPortalSystem 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-180px)] relative">
          {/* Left Panel - Always Chat */}
          <div className="h-full">
            <ChatInterface
              onCodeGenerated={handleCodeGenerated}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              generatedCode={generatedCode}
            />
          </div>

          {/* Right Panel - Dynamic based on activeTab */}
          <div className="h-full relative">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <motion.div
                  key="chat-placeholder"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full flex items-center justify-center rounded-2xl"
                  style={{
                    background: 'rgba(10, 14, 39, 0.6)',
                    border: `1px solid ${chlorophyTheme.colors.primary}20`,
                  }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                      className="text-6xl mb-4"
                    >
                      ✨
                    </motion.div>
                    <p 
                      className="text-xl font-medium"
                      style={{
                        color: chlorophyTheme.colors.primary,
                        fontFamily: chlorophyTheme.fonts.display,
                      }}
                    >
                      Start chatting to see magic happen!
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <MagicPreview 
                    code={generatedCode}
                    isGenerating={isGenerating}
                  />
                </motion.div>
              )}

              {activeTab === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <CodePanel 
                    generatedCode={generatedCode}
                    projectFiles={projectFiles}
                  />
                </motion.div>
              )}

              {activeTab === 'galaxy' && (
                <motion.div
                  key="galaxy"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full"
                >
                  <GalaxyView 
                    onFileSelect={handleFileSelect}
                    projectFiles={projectFiles}
                  />
                </motion.div>
              )}

              {activeTab === 'deploy' && (
                <motion.div
                  key="deploy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <DeployPanel 
                    projectFiles={projectFiles}
                    projectName={window.chlorophyZipData?.projectName || 'my-website'}
                    generatedCode={generatedCode}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* AI Insight Panel - Floating */}
      <AIInsightPanel 
        generatedCode={generatedCode}
        isVisible={generatedCode && activeTab !== 'chat'}
      />
    </div>
  );
}