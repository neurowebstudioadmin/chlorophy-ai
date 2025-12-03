import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Zap, CheckCircle, Loader } from 'lucide-react';
import { chlorophyTheme } from '../../styles/chlorophy-theme';

export default function LiveCodeStreaming({ 
  isGenerating, 
  generatedCode, 
  isRefining,
  onStreamComplete 
}) {
  const [streamedCode, setStreamedCode] = useState('');
  const [currentFile, setCurrentFile] = useState('index.html');
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const codeEndRef = useRef(null);
  const streamIntervalRef = useRef(null);
  const lastCodeRef = useRef('');

  // File phases
  const filePhases = [
    { name: 'index.html', icon: '🌐', color: '#E34C26' },
    { name: 'style.css', icon: '🎨', color: '#264DE4' },
    { name: 'script.js', icon: '⚡', color: '#F7DF1E' },
  ];

  const currentFileInfo = filePhases.find(f => f.name === currentFile) || filePhases[0];

  // MAIN STREAMING EFFECT - ascolta SOLO generatedCode
  useEffect(() => {
    // Se non c'è codice O è lo stesso di prima, esci
    if (!generatedCode || generatedCode === lastCodeRef.current) {
      return;
    }

    console.log('🎬 NEW CODE ARRIVED! Starting streaming. Length:', generatedCode.length);
    lastCodeRef.current = generatedCode;

    // Cleanup vecchio intervallo se esiste
    if (streamIntervalRef.current) {
      console.log('🧹 Cleaning up old interval');
      clearInterval(streamIntervalRef.current);
    }

    // Reset stato
    setStreamedCode('');
    setProgress(0);
    setIsComplete(false);
    setCurrentFile('index.html');

    let currentIndex = 0;
    const totalChars = generatedCode.length;
    const baseSpeed = totalChars > 5000 ? 3 : totalChars > 2000 ? 5 : 8;

    console.log('⚡ Starting interval with speed:', baseSpeed);

    streamIntervalRef.current = setInterval(() => {
      if (currentIndex >= totalChars) {
        console.log('✅ STREAMING COMPLETE!');
        clearInterval(streamIntervalRef.current);
        setIsComplete(true);
        setProgress(100);
        
        setTimeout(() => {
          console.log('🔔 Calling onStreamComplete callback');
          if (onStreamComplete) onStreamComplete();
        }, 1000);
        return;
      }

      // Update current file
      const phaseProgress = currentIndex / totalChars;
      if (phaseProgress < 0.4) {
        setCurrentFile('index.html');
      } else if (phaseProgress < 0.7) {
        setCurrentFile('style.css');
      } else {
        setCurrentFile('script.js');
      }

      // Stream characters
      const chunkSize = Math.floor(Math.random() * baseSpeed) + 1;
      const nextIndex = Math.min(currentIndex + chunkSize, totalChars);
      setStreamedCode(generatedCode.substring(0, nextIndex));
      currentIndex = nextIndex;

      // Update progress
      const newProgress = Math.floor((currentIndex / totalChars) * 100);
      setProgress(newProgress);

      // Log every 25%
      if (newProgress % 25 === 0 && newProgress > 0) {
        console.log(`📊 Progress: ${newProgress}%`);
      }

      // Auto-scroll
      if (codeEndRef.current) {
        codeEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 10);

    // Cleanup function
    return () => {
      console.log('🧹 Component cleanup - clearing interval');
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [generatedCode, onStreamComplete]); // SOLO generatedCode!

  return (
    <div 
      className="h-full flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: chlorophyTheme.colors.dark,
        border: `1px solid ${chlorophyTheme.colors.primary}20`,
      }}
    >
      {/* Header */}
      <div 
        className="px-6 py-4 border-b backdrop-blur-xl"
        style={{
          background: 'rgba(26, 31, 58, 0.6)',
          borderColor: `${chlorophyTheme.colors.primary}20`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 
              className="text-xl font-bold flex items-center gap-2"
              style={{
                color: chlorophyTheme.colors.primary,
                fontFamily: chlorophyTheme.fonts.display,
              }}
            >
              <Zap size={24} />
              Live Code Streaming
            </h2>
            <p className="text-sm" style={{ color: '#ffffff60' }}>
              {isComplete 
                ? '✅ Generation complete!' 
                : isRefining
                ? '🔧 Applying modifications...'
                : (isGenerating || isRefining) && !generatedCode
                ? '⚡ AI is working on your code...'
                : streamedCode.length > 0
                ? '⚡ Streaming code live...'
                : 'Ready to stream'}
            </p>
          </div>

          {/* Current File Badge */}
          {streamedCode.length > 0 && (
            <motion.div
              key={currentFile}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: `${currentFileInfo.color}20`,
                border: `1px solid ${currentFileInfo.color}40`,
              }}
            >
              <span className="text-2xl">{currentFileInfo.icon}</span>
              <div>
                <p 
                  className="text-sm font-bold"
                  style={{ 
                    color: currentFileInfo.color,
                    fontFamily: chlorophyTheme.fonts.code,
                  }}
                >
                  {currentFile}
                </p>
                <p className="text-xs" style={{ color: '#ffffff60' }}>
                  {isComplete ? 'Complete' : 'Writing...'}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        {streamedCode.length > 0 && (
          <div className="relative">
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: isComplete
                    ? 'linear-gradient(90deg, #10B981, #059669)'
                    : `linear-gradient(90deg, ${currentFileInfo.color}, ${chlorophyTheme.colors.primary})`,
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs" style={{ color: '#ffffff60' }}>
              <span>{progress}% complete</span>
              <span>{streamedCode.length} / {generatedCode?.length || 0} chars</span>
            </div>
          </div>
        )}
      </div>

      {/* Code Display */}
      <div 
        className="flex-1 overflow-auto p-6"
        style={{
          background: 'rgba(10, 14, 39, 0.8)',
          fontFamily: chlorophyTheme.fonts.code,
        }}
      >
        {!generatedCode || generatedCode.length === 0 ? (
          // IDLE STATE
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                ⚡
              </motion.div>
              <p 
                className="text-xl font-semibold mb-2"
                style={{ 
                  color: chlorophyTheme.colors.primary,
                  fontFamily: chlorophyTheme.fonts.display,
                }}
              >
                Ready to generate!
              </p>
              <p className="text-sm" style={{ color: '#ffffff60' }}>
                Click "Generate Website" to see the magic happen
              </p>
            </div>
          </div>
        ) : streamedCode.length === 0 && (isGenerating || isRefining) ? (
          // WAITING STATE
          <div className="h-full flex flex-col items-center justify-center text-center">
            <motion.div
              className="relative mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="absolute inset-0 w-32 h-32 rounded-full border-4"
                style={{ borderColor: `${currentFileInfo.color}40` }}
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-0 w-32 h-32 rounded-full border-4"
                style={{ borderColor: `${currentFileInfo.color}60` }}
                animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <div className="w-32 h-32 flex items-center justify-center">
                <span className="text-5xl">⚡</span>
              </div>
            </motion.div>

            <p 
              className="text-2xl font-bold mb-2"
              style={{ 
                color: currentFileInfo.color,
                fontFamily: chlorophyTheme.fonts.display,
              }}
            >
              {isRefining ? '🔧 Applying modifications...' : '✨ AI is generating your website...'}
            </p>
            
            <p className="text-sm mb-6" style={{ color: '#ffffff60' }}>
              {isRefining 
                ? 'Analyzing and modifying the existing code...' 
                : 'Creating HTML, CSS, and JavaScript from scratch...'}
            </p>

            <div className="space-y-3 w-full max-w-md">
              {filePhases.map((file, index) => (
                <motion.div
                  key={file.name}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${file.color}20`,
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <span className="text-2xl">{file.icon}</span>
                  </motion.div>
                  <div className="flex-1">
                    <p 
                      className="text-sm font-medium"
                      style={{ color: file.color }}
                    >
                      {file.name}
                    </p>
                    <p className="text-xs" style={{ color: '#ffffff40' }}>
                      Preparing structure...
                    </p>
                  </div>
                  <motion.div className="flex gap-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-2 h-2 rounded-full"
                        style={{ background: file.color }}
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          delay: dot * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs mt-6" style={{ color: '#ffffff40' }}>
              ⏱️ This usually takes 30-60 seconds...
            </p>
          </div>
        ) : (
          // STREAMING STATE
          <div className="relative">
            <div className="flex gap-2 mb-4">
              {filePhases.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                  style={{
                    background: currentFile === file.name 
                      ? `${file.color}20` 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${currentFile === file.name ? file.color + '40' : 'transparent'}`,
                    color: currentFile === file.name ? file.color : '#ffffff40',
                  }}
                >
                  <span>{file.icon}</span>
                  <span className="font-medium">{file.name}</span>
                  {progress >= (file === filePhases[0] ? 40 : file === filePhases[1] ? 70 : 100) && (
                    <CheckCircle size={12} style={{ color: '#10B981' }} />
                  )}
                </div>
              ))}
            </div>

            <pre 
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ 
                color: '#E5E7EB',
                textShadow: `0 0 10px ${currentFileInfo.color}40`,
              }}
            >
              {streamedCode}
              {!isComplete && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-4 ml-1"
                  style={{ 
                    background: currentFileInfo.color,
                    boxShadow: `0 0 10px ${currentFileInfo.color}`,
                  }}
                />
              )}
            </pre>
            <div ref={codeEndRef} />

            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-50"
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle size={24} style={{ color: '#ffffff' }} />
                    <div>
                      <p className="font-bold text-white">Generation Complete!</p>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Switching to preview...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {streamedCode.length > 0 && (
        <div 
          className="px-6 py-3 border-t flex items-center justify-between text-xs"
          style={{
            background: 'rgba(26, 31, 58, 0.6)',
            borderColor: `${chlorophyTheme.colors.primary}20`,
          }}
        >
          <div className="flex items-center gap-4">
            <span style={{ color: '#ffffff60' }}>
              <FileCode size={14} className="inline mr-1" style={{ color: currentFileInfo.color }} />
              {currentFile}
            </span>
            <span style={{ color: '#ffffff60' }}>
              {streamedCode.split('\n').length} lines
            </span>
            <span style={{ color: '#ffffff60' }}>
              {streamedCode.length} characters
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {isComplete ? (
              <CheckCircle size={14} style={{ color: '#10B981' }} />
            ) : (
              <Loader size={14} className="animate-spin" style={{ color: chlorophyTheme.colors.primary }} />
            )}
            <span style={{ color: isComplete ? '#10B981' : chlorophyTheme.colors.primary }}>
              {isComplete ? 'Complete' : 'Streaming...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}