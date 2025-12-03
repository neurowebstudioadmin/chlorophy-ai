import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './ChatInterface';
import TabPortalSystem from './TabPortalSystem';
import CodePanel from './CodePanel';
import LiveCodeStreaming from './LiveCodeStreaming';
import WebsiteDNA from './WebsiteDNA';
import DeployPanel from './DeployPanel';
import { chlorophyTheme } from '../../styles/chlorophy-theme';
import { Monitor, Tablet, Smartphone, Maximize2, Download, Crown, Zap, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { downloadProjectZip } from '../../utils/zipUtils';

// 🎯 FUNZIONE PER ESTRARRE CSS E JS DALL'HTML
function extractFilesFromHTML(htmlCode) {
  if (!htmlCode) return null;

  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let cssContent = '';
  let match;
  while ((match = styleRegex.exec(htmlCode)) !== null) {
    cssContent += match[1] + '\n\n';
  }

  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let jsContent = '';
  while ((match = scriptRegex.exec(htmlCode)) !== null) {
    if (!match[0].includes('src=')) {
      jsContent += match[1] + '\n\n';
    }
  }

  let cleanHtml = htmlCode
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '  <!-- CSS moved to style.css -->')
    .replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, '  <!-- JavaScript moved to script.js -->');

  return {
    'index.html': cleanHtml.trim(),
    'style.css': cssContent.trim() || '/* No CSS found in HTML */\n\nbody {\n  margin: 0;\n  padding: 0;\n}',
    'script.js': jsContent.trim() || '// No JavaScript found in HTML\n\nconsole.log("Website loaded!");'
  };
}

// 💳 CREDITS DISPLAY COMPONENT
function CreditsDisplay({ credits, tier, onUpgrade }) {
  const tierConfig = {
    free: { name: 'Free', color: '#6B7280', max: 10 },
    pro: { name: 'Pro', color: '#10B981', max: 150 },
    business: { name: 'Business', color: '#3B82F6', max: 500 },
    premium: { name: 'Premium', color: '#8B5CF6', max: 1500 },
    ultra: { name: 'Ultra', color: '#F59E0B', max: 5000 }
  };

  const currentTier = tierConfig[tier] || tierConfig.free;
  const percentage = (credits / currentTier.max) * 100;
  const isLow = percentage < 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 px-6 py-3 rounded-xl backdrop-blur-xl"
      style={{
        background: 'rgba(26, 31, 58, 0.8)',
        border: `1px solid ${currentTier.color}40`,
      }}
    >
      <div 
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{
          background: `${currentTier.color}20`,
          border: `1px solid ${currentTier.color}40`,
        }}
      >
        <Crown size={16} style={{ color: currentTier.color }} />
        <span 
          className="font-semibold text-sm"
          style={{ color: currentTier.color }}
        >
          {currentTier.name}
        </span>
      </div>

      <div className="flex-1 min-w-[200px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium" style={{ color: '#ffffff' }}>
            💳 Crediti
          </span>
          <span 
            className="text-sm font-bold"
            style={{ color: isLow ? '#EF4444' : '#10B981' }}
          >
            {credits} / {currentTier.max}
          </span>
        </div>
        <div 
          className="h-2 rounded-full overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: isLow 
                ? 'linear-gradient(90deg, #EF4444, #F59E0B)'
                : `linear-gradient(90deg, ${currentTier.color}, ${chlorophyTheme.colors.primary})`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {isLow && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
          }}
        >
          <AlertCircle size={16} style={{ color: '#EF4444' }} />
          <span className="text-xs font-medium" style={{ color: '#EF4444' }}>
            Crediti in esaurimento!
          </span>
        </motion.div>
      )}

      {tier === 'free' || isLow ? (
        <motion.button
          onClick={onUpgrade}
          className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: chlorophyTheme.colors.gradients.primary,
            color: chlorophyTheme.colors.dark,
          }}
        >
          <Zap size={16} />
          Upgrade
        </motion.button>
      ) : null}
    </motion.div>
  );
}

// 🎨 ENHANCED PREVIEW PANEL
function MagicPreview({ code, isGenerating }) {
  const [viewMode, setViewMode] = useState('desktop');

  const viewModes = [
    { id: 'desktop', name: 'Desktop', icon: Monitor, width: '100%', height: '100%', color: '#10B981' },
    { id: 'tablet', name: 'Tablet', icon: Tablet, width: '768px', height: '1024px', color: '#F59E0B' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, width: '375px', height: '667px', color: '#8B5CF6' },
  ];

  const currentMode = viewModes.find(m => m.id === viewMode);

  const handleFullScreenPreview = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownloadZip = async () => {
    try {
      const titleMatch = code.match(/<title[^>]*>(.*?)<\/title>/i);
      const projectName = titleMatch ? titleMatch[1].replace(/[^a-z0-9]/gi, '-').toLowerCase() : 'chlorophy-project';
      
      await downloadProjectZip(code, projectName);
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      alert('Errore durante il download del progetto. Riprova!');
    }
  };

  return (
    <div 
      className="h-full flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: chlorophyTheme.colors.dark,
        border: `1px solid ${chlorophyTheme.colors.secondary}20`,
      }}
    >
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
            {currentMode.name} view • {currentMode.width} × {currentMode.height}
          </p>
        </div>
        
        <div 
          className="flex items-center gap-2 rounded-xl p-1.5"
          style={{
            background: 'rgba(10, 14, 39, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {viewModes.map((mode) => {
            const isActive = viewMode === mode.id;
            const Icon = mode.icon;
            
            return (
              <motion.button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: isActive ? `${mode.color}20` : 'transparent',
                  color: isActive ? mode.color : '#ffffff60',
                  border: `1px solid ${isActive ? mode.color + '40' : 'transparent'}`,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-view"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `${mode.color}15`,
                      boxShadow: `0 0 20px ${mode.color}30`,
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={18} className="relative" />
                <span className="relative">{mode.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div 
        className="flex-1 overflow-auto p-6"
        style={{
          background: 'rgba(10, 14, 39, 0.5)',
        }}
      >
        {!code && !isGenerating ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                👁️
              </motion.div>
              <p className="text-lg mb-2" style={{ color: '#ffffff80' }}>
                Preview will appear here
              </p>
              <p className="text-sm" style={{ color: '#ffffff40' }}>
                Generate a website to see the live preview
              </p>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 rounded-full mx-auto mb-4"
                style={{ borderColor: chlorophyTheme.colors.secondary, borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="font-medium" style={{ color: '#ffffff80' }}>
                Generating your website...
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                className="rounded-xl shadow-2xl transition-all"
                style={{ 
                  width: currentMode.width,
                  height: currentMode.height,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  boxShadow: `0 0 60px ${currentMode.color}40`,
                  border: `2px solid ${currentMode.color}30`,
                }}
              >
                <iframe
                  srcDoc={code}
                  title="Website Preview"
                  className="w-full h-full rounded-xl"
                  style={{ background: 'white' }}
                  sandbox="allow-scripts allow-same-origin"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {code && !isGenerating && (
        <div className="px-6 py-4 border-t backdrop-blur-xl flex gap-3">
          <motion.button
            onClick={handleFullScreenPreview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${chlorophyTheme.colors.secondary}40`,
              color: chlorophyTheme.colors.secondary,
            }}
          >
            <Maximize2 size={16} />
            View Preview
          </motion.button>
          
          <motion.button
            onClick={handleDownloadZip}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{
              background: chlorophyTheme.colors.gradients.primary,
              color: chlorophyTheme.colors.dark,
            }}
          >
            <Download size={16} />
            Download ZIP
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default function Builder() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [activeTab, setActiveTab] = useState('streaming');
  const [projectFiles, setProjectFiles] = useState(null);
  const [credits, setCredits] = useState(null);
  const [userTier, setUserTier] = useState('free');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserId(user.id);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/credits/${user.id}`);
        const data = await response.json();

        if (data.success) {
          setCredits(data.credits.remaining);
          setUserTier(data.credits.tier);
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    fetchUserCredits();
  }, []);

  useEffect(() => {
    if (generatedCode) {
      const files = extractFilesFromHTML(generatedCode);
      setProjectFiles(files);
      console.log('✅ Files extracted:', files);
    }
  }, [generatedCode]);

  // 🎯 FLUSSO AUTOMATICO: Genera/Modifica → Streaming → Preview
  const handleCodeGenerated = (code, isModification = false) => {
    console.log('🎯 Code generated/modified. Switching to streaming...');
    setGeneratedCode(code);
    
    if (isModification) {
      setIsRefining(true);
    }
    
    // Already on streaming, just update code
    // Auto-switch to preview will happen in handleStreamComplete
  };

  // Called when user starts generation
  const handleGenerationStart = (isModification = false) => {
    console.log('🎯 Generation started. Switching to streaming...');
    setActiveTab('streaming');
    if (isModification) {
      setIsRefining(true);
    }
  };

  // Callback when streaming completes
  const handleStreamComplete = () => {
    console.log('✅ Streaming complete. Switching to preview in 2 seconds...');
    setIsRefining(false);
    
    // Auto-switch to preview after 2 seconds
    setTimeout(() => {
      console.log('🎯 Now switching to preview!');
      setActiveTab('preview');
    }, 2000);
  };

  const handleCreditsUpdate = (newCredits) => {
    setCredits(newCredits);
  };

  const handleUpgrade = () => {
    window.location.href = '/billing';
  };

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        background: chlorophyTheme.colors.gradients.hero,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1800px] mx-auto mb-6"
      >
        <div className="flex items-center justify-between mb-4">
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

          <TabPortalSystem 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {credits !== null && (
          <CreditsDisplay 
            credits={credits}
            tier={userTier}
            onUpgrade={handleUpgrade}
          />
        )}
      </motion.div>

      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-240px)] relative">
          <div className="h-full">
            <ChatInterface
              onCodeGenerated={handleCodeGenerated}
              onGenerationStart={handleGenerationStart}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              generatedCode={generatedCode}
              onCreditsUpdate={handleCreditsUpdate}
            />
          </div>

          <div className="h-full relative">
            <AnimatePresence mode="wait">
              {activeTab === 'streaming' && (
                <motion.div
                  key="streaming"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full"
                >
                  <LiveCodeStreaming
                    isGenerating={isGenerating}
                    isRefining={isRefining}
                    generatedCode={generatedCode}
                    onStreamComplete={handleStreamComplete}
                  />
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

              {activeTab === 'dna' && (
                <motion.div
                  key="dna"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full"
                >
                  <WebsiteDNA generatedCode={generatedCode} />
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
    </div>
  );
}