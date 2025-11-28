import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Globe, 
  Share2, 
  QrCode, 
  Github, 
  Check, 
  Loader,
  ExternalLink,
  Copy,
  Zap
} from 'lucide-react';
import { chlorophyTheme } from '../../styles/chlorophy-theme';
import toast, { Toaster } from 'react-hot-toast';

export default function DeployPanel({ projectFiles, projectName, generatedCode }) {
  const [deployStatus, setDeployStatus] = useState('idle'); // idle, deploying, deployed, error
  const [deployUrl, setDeployUrl] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Simulate deploy (in real app, call Vercel API)
  const handleDeploy = async () => {
    setDeployStatus('deploying');
    
    toast.loading('Deploying to Vercel...', {
      id: 'deploy',
      style: {
        background: chlorophyTheme.colors.dark,
        color: chlorophyTheme.colors.primary,
        border: `1px solid ${chlorophyTheme.colors.primary}40`,
      },
    });

    // Simulate API call
    setTimeout(() => {
      const mockUrl = `https://${projectName || 'my-site'}-${Math.random().toString(36).substr(2, 9)}.vercel.app`;
      setDeployUrl(mockUrl);
      setDeployStatus('deployed');
      
      toast.success('Deployed successfully!', {
        id: 'deploy',
        icon: '🚀',
        style: {
          background: chlorophyTheme.colors.dark,
          color: chlorophyTheme.colors.primary,
          border: `1px solid ${chlorophyTheme.colors.primary}40`,
        },
      });
    }, 3000);
  };

  const handleShare = () => {
    const blob = new Blob([generatedCode || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setShareUrl(url);
    
    toast.success('Share link created!', {
      icon: '🔗',
      style: {
        background: chlorophyTheme.colors.dark,
        color: chlorophyTheme.colors.secondary,
        border: `1px solid ${chlorophyTheme.colors.secondary}40`,
      },
    });
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!', {
      icon: '📋',
      style: {
        background: chlorophyTheme.colors.dark,
        color: chlorophyTheme.colors.accent,
        border: `1px solid ${chlorophyTheme.colors.accent}40`,
      },
    });
  };

  const handleGithubExport = () => {
    toast('GitHub export coming soon!', {
      icon: '🔜',
      style: {
        background: chlorophyTheme.colors.dark,
        color: '#ffffff',
        border: `1px solid ${chlorophyTheme.colors.primary}40`,
      },
    });
  };

  return (
    <div 
      className="h-full flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: chlorophyTheme.colors.gradients.hero,
      }}
    >
      <Toaster position="top-right" />

      {/* Header */}
      <div 
        className="px-6 py-4 border-b backdrop-blur-xl"
        style={{
          background: 'rgba(10, 14, 39, 0.6)',
          borderColor: `${chlorophyTheme.colors.primary}20`,
        }}
      >
        <div className="flex items-center gap-3">
          <Rocket 
            size={28} 
            style={{ color: chlorophyTheme.colors.primary }}
          />
          <div>
            <h2 
              className="text-xl font-bold"
              style={{
                color: chlorophyTheme.colors.primary,
                fontFamily: chlorophyTheme.fonts.display,
              }}
            >
              Deploy & Share
            </h2>
            <p 
              className="text-sm"
              style={{
                color: '#ffffff60',
                fontFamily: chlorophyTheme.fonts.body,
              }}
            >
              Launch your website to the world instantly
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        
        {/* Deploy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl rounded-2xl p-6"
          style={{
            background: 'rgba(10, 14, 39, 0.8)',
            border: `1px solid ${chlorophyTheme.colors.primary}20`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 
                className="text-lg font-bold mb-2"
                style={{
                  color: '#ffffff',
                  fontFamily: chlorophyTheme.fonts.display,
                }}
              >
                🚀 Instant Deploy
              </h3>
              <p 
                className="text-sm"
                style={{ color: '#ffffff80' }}
              >
                Deploy to Vercel with one click. Your site will be live in seconds.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {deployStatus === 'idle' && (
              <motion.button
                key="deploy-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleDeploy}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: chlorophyTheme.colors.gradients.primary,
                  color: chlorophyTheme.colors.dark,
                  boxShadow: chlorophyTheme.shadows.glow,
                }}
              >
                <Rocket size={24} />
                Deploy to Vercel
                <Zap size={20} />
              </motion.button>
            )}

            {deployStatus === 'deploying' && (
              <motion.div
                key="deploying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full py-4 rounded-xl flex items-center justify-center gap-3"
                style={{
                  background: `${chlorophyTheme.colors.primary}20`,
                  border: `1px solid ${chlorophyTheme.colors.primary}40`,
                }}
              >
                <Loader 
                  size={24} 
                  style={{ color: chlorophyTheme.colors.primary }} 
                  className="animate-spin"
                />
                <span 
                  className="font-medium"
                  style={{ color: chlorophyTheme.colors.primary }}
                >
                  Deploying your website...
                </span>
              </motion.div>
            )}

            {deployStatus === 'deployed' && (
              <motion.div
                key="deployed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div 
                  className="p-4 rounded-xl flex items-center gap-3"
                  style={{
                    background: `${chlorophyTheme.colors.primary}20`,
                    border: `1px solid ${chlorophyTheme.colors.primary}40`,
                  }}
                >
                  <Check 
                    size={24} 
                    style={{ color: chlorophyTheme.colors.primary }} 
                  />
                  <span 
                    className="font-medium flex-1"
                    style={{ color: chlorophyTheme.colors.primary }}
                  >
                    Deployed successfully!
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={deployUrl}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${chlorophyTheme.colors.primary}20`,
                      color: '#ffffff',
                      fontFamily: chlorophyTheme.fonts.code,
                      fontSize: '14px',
                    }}
                  />
                  <motion.button
                    onClick={() => handleCopyUrl(deployUrl)}
                    className="p-3 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: `${chlorophyTheme.colors.primary}20`,
                      border: `1px solid ${chlorophyTheme.colors.primary}40`,
                    }}
                  >
                    <Copy size={20} style={{ color: chlorophyTheme.colors.primary }} />
                  </motion.button>
                  <motion.a
                    href={deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: `${chlorophyTheme.colors.accent}20`,
                      border: `1px solid ${chlorophyTheme.colors.accent}40`,
                    }}
                  >
                    <ExternalLink size={20} style={{ color: chlorophyTheme.colors.accent }} />
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl rounded-2xl p-6"
          style={{
            background: 'rgba(10, 14, 39, 0.8)',
            border: `1px solid ${chlorophyTheme.colors.secondary}20`,
          }}
        >
          <h3 
            className="text-lg font-bold mb-4"
            style={{
              color: '#ffffff',
              fontFamily: chlorophyTheme.fonts.display,
            }}
          >
            🔗 Quick Share
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={handleShare}
              className="p-4 rounded-xl flex flex-col items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: `${chlorophyTheme.colors.secondary}20`,
                border: `1px solid ${chlorophyTheme.colors.secondary}40`,
              }}
            >
              <Share2 size={24} style={{ color: chlorophyTheme.colors.secondary }} />
              <span 
                className="text-sm font-medium"
                style={{ color: chlorophyTheme.colors.secondary }}
              >
                Share Link
              </span>
            </motion.button>

            <motion.button
              onClick={() => setShowQR(!showQR)}
              className="p-4 rounded-xl flex flex-col items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: `${chlorophyTheme.colors.accent}20`,
                border: `1px solid ${chlorophyTheme.colors.accent}40`,
              }}
            >
              <QrCode size={24} style={{ color: chlorophyTheme.colors.accent }} />
              <span 
                className="text-sm font-medium"
                style={{ color: chlorophyTheme.colors.accent }}
              >
                QR Code
              </span>
            </motion.button>
          </div>

          {shareUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${chlorophyTheme.colors.secondary}20`,
              }}
            >
              <p className="text-xs mb-2" style={{ color: '#ffffff60' }}>
                Preview URL:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 rounded text-xs"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: 'none',
                    color: '#ffffff',
                    fontFamily: chlorophyTheme.fonts.code,
                  }}
                />
                <button
                  onClick={() => handleCopyUrl(shareUrl)}
                  className="p-2 rounded"
                  style={{
                    background: `${chlorophyTheme.colors.secondary}20`,
                  }}
                >
                  <Copy size={14} style={{ color: chlorophyTheme.colors.secondary }} />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* GitHub Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl rounded-2xl p-6"
          style={{
            background: 'rgba(10, 14, 39, 0.8)',
            border: `1px solid #ffffff20`,
          }}
        >
          <h3 
            className="text-lg font-bold mb-4"
            style={{
              color: '#ffffff',
              fontFamily: chlorophyTheme.fonts.display,
            }}
          >
            <Github className="inline mr-2" size={20} />
            Export to GitHub
          </h3>

          <motion.button
            onClick={handleGithubExport}
            className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
            }}
          >
            <Github size={20} />
            Push to GitHub
            <span 
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: chlorophyTheme.colors.accent,
                color: chlorophyTheme.colors.dark,
              }}
            >
              Coming Soon
            </span>
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}