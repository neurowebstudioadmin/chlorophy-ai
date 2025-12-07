import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './ChatInterface';
import CodePanel from './CodePanel';
import WebsiteDNA from './WebsiteDNA';
import DeployPanel from './DeployPanel';
import { chlorophyTheme } from '../../styles/chlorophy-theme';
import { Monitor, Tablet, Smartphone, Maximize2, Download, Crown, Zap, AlertCircle, Code, Layers, Rocket } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { downloadProjectZip } from '../../utils/zipUtils';

// CREDITS DISPLAY
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
            Credits
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
            Low credits!
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

// TAB SYSTEM (NO STREAMING)
function TabSystem({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'preview', label: 'Preview', icon: Monitor },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'dna', label: 'DNA', icon: Layers },
    { id: 'deploy', label: 'Deploy', icon: Rocket }
  ];

  return (
    <div 
      className="flex items-center gap-2 rounded-xl p-1.5"
      style={{
        background: 'rgba(10, 14, 39, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            style={{
              background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: isActive ? '#10B981' : '#ffffff60',
              border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.4)' : 'transparent'}`,
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={16} className="relative" />
            <span className="relative">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// MATRIX ANIMATION
function MatrixRain() {
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const columns = 40;
  
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#000' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 text-green-500 font-mono text-sm"
          style={{
            left: `${(i / columns) * 100}%`,
            opacity: 0.8,
          }}
          animate={{
            y: ['0vh', '100vh'],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 2,
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j}>{chars[Math.floor(Math.random() * chars.length)]}</div>
          ))}
        </motion.div>
      ))}
      
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌿
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold mb-2"
            style={{ color: '#00ff41' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Generating Your Website...
          </motion.h2>
          <p className="text-green-400 font-mono text-sm">
            Analyzing • Designing • Coding
          </p>
        </div>
      </div>
    </div>
  );
}

// PREVIEW PANEL
function MagicPreview({ code, isGenerating, projectFiles }) {
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
      
      console.log('ZIP Download - Files check:', {
        html: projectFiles?.html?.length || 0,
        css: projectFiles?.css?.length || 0,
        js: projectFiles?.javascript?.length || 0
      });
      
      await downloadProjectZip(projectFiles, projectName);
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      alert('Error downloading project!');
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
            Preview
          </h2>
          <p 
            className="text-sm"
            style={{
              color: '#ffffff60',
              fontFamily: chlorophyTheme.fonts.body,
            }}
          >
            {currentMode.name} view
          </p>
        </div>
        
        {!isGenerating && code && (
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
        )}
      </div>

      <div 
        className="flex-1 overflow-auto relative"
        style={{
          background: 'rgba(10, 14, 39, 0.5)',
        }}
      >
        {isGenerating ? (
          <MatrixRain />
        ) : code ? (
          <div className="h-full flex items-center justify-center p-6">
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
        ) : (
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

// FALLBACK: Extract files from HTML
function extractFilesFromHTML(htmlCode) {
  if (!htmlCode) return { html: '', css: '', javascript: '' };
  
  // Extract CSS
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let cssContent = '';
  let match;
  while ((match = styleRegex.exec(htmlCode)) !== null) {
    cssContent += match[1] + '\n\n';
  }

  // Extract JS
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let jsContent = '';
  while ((match = scriptRegex.exec(htmlCode)) !== null) {
    if (!match[0].includes('src=')) {
      jsContent += match[1] + '\n\n';
    }
  }

  // Clean HTML
  let cleanHtml = htmlCode
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '  <link rel="stylesheet" href="style.css">')
    .replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, '  <script src="script.js"></script>');

  return {
    html: cleanHtml.trim(),
    css: cssContent.trim() || '/* No CSS found */',
    javascript: jsContent.trim() || '// No JavaScript found\nconsole.log("Website loaded!");'
  };
}

export default function Builder() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [projectFiles, setProjectFiles] = useState({
    html: '',
    css: '',
    javascript: ''
  });
  const [generationData, setGenerationData] = useState(null);
  const [credits, setCredits] = useState(null);
  const [userTier, setUserTier] = useState('free');

  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

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

  // Estrai files quando viene generato nuovo codice
  useEffect(() => {
    if (generatedCode && !generationData?.files) {
      console.log('Extracting files from generated HTML code');
      const extracted = extractFilesFromHTML(generatedCode);
      console.log('Extracted files lengths:', {
        html: extracted.html.length,
        css: extracted.css.length,
        js: extracted.javascript.length
      });
      
      setProjectFiles(extracted);
    }
  }, [generatedCode, generationData]);

  const handleCodeGenerated = (code, backendData) => {
    console.log('Code generated. Full backend response:', backendData);
    
    setGeneratedCode(code);
    setGenerationData(backendData);
    
    // Se il backend ha restituito files separati
    if (backendData?.files?.javascript && backendData.files.javascript.length > 10) {
      console.log('Using files from backend response:', {
        html: backendData.files.html?.length || 0,
        css: backendData.files.css?.length || 0,
        js: backendData.files.javascript?.length || 0
      });
      
      setProjectFiles({
        html: backendData.files.html || code,
        css: backendData.files.css || '',
        javascript: backendData.files.javascript || ''
      });
    } else {
      console.log('Extracting files from HTML code...');
      const extracted = extractFilesFromHTML(code);
      setProjectFiles(extracted);
    }
    
    // Log DNA/generation data
    if (backendData?.generation) {
      console.log('Generation data available:', backendData.generation);
    }
    if (backendData?.dna) {
      console.log('DNA data available, length:', backendData.dna.length);
    }
  };

  const handleGenerationStart = () => {
    console.log('Generation started. Switching to preview...');
    setActiveTab('preview');
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
              Chlorophy AI
            </h1>
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                background: `${chlorophyTheme.colors.primary}20`,
                color: chlorophyTheme.colors.primary,
                border: `1px solid ${chlorophyTheme.colors.primary}40`,
              }}
            >
              AI Website Builder
            </span>
          </div>

          <TabSystem 
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
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-240px)]">
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

          <div className="h-full">
            <AnimatePresence mode="wait">
              {activeTab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full"
                >
                  <MagicPreview 
                    code={generatedCode}
                    isGenerating={isGenerating}
                    projectFiles={projectFiles}
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
                  <WebsiteDNA 
                    generatedCode={generatedCode}
                    generationData={generationData}
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
                    projectName="my-website"
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