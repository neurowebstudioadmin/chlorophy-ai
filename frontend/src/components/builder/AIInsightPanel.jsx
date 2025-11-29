import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { chlorophyTheme } from '../../styles/chlorophy-theme';

// Icon mapping
const iconMap = {
  optimization: Zap,
  seo: TrendingUp,
  accessibility: CheckCircle,
  design: Sparkles,
  mobile: AlertCircle,
};

// Color mapping
const colorMap = {
  optimization: chlorophyTheme.colors.accent,
  seo: chlorophyTheme.colors.primary,
  accessibility: chlorophyTheme.colors.secondary,
  design: '#FF6B9D',
  mobile: '#FFA500',
};

function InsightCard({ insight, isExpanded, onToggle }) {
  const Icon = iconMap[insight.type] || Lightbulb;
  const color = colorMap[insight.type] || '#ffffff';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="backdrop-blur-xl rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(10, 14, 39, 0.6)',
        border: `1px solid ${color}40`,
      }}
      whileHover={{ scale: 1.02 }}
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div 
            className="p-2 rounded-lg flex-shrink-0"
            style={{
              background: `${color}20`,
            }}
          >
            <Icon size={20} style={{ color: color }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 
                className="text-sm font-bold"
                style={{
                  color: color,
                  fontFamily: chlorophyTheme.fonts.display,
                }}
              >
                {insight.title}
              </h4>
              
              {/* Priority Badge */}
              {insight.priority !== 'info' && (
                <span 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: `${color}30`,
                    color: color,
                    fontFamily: chlorophyTheme.fonts.body,
                  }}
                >
                  {insight.priority}
                </span>
              )}
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs mt-2"
                  style={{
                    color: '#ffffff80',
                    fontFamily: chlorophyTheme.fonts.body,
                  }}
                >
                  {insight.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Expand Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={16} style={{ color: '#ffffff40' }} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AIInsightPanel({ generatedCode, isVisible = true, onCodeImproved }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentInsights, setCurrentInsights] = useState([]);
  const [overallScore, setOverallScore] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    // Analyze code with REAL AI
    if (generatedCode) {
      analyzeCode(generatedCode);
    }
  }, [generatedCode]);

  const analyzeCode = async (code) => {
    try {
      setIsAnalyzing(true);
      setCurrentInsights([]);

      const response = await fetch('http://localhost:3001/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentInsights(data.analysis.insights);
        setOverallScore(data.analysis.overallScore);
        console.log('✅ AI Analysis complete! Score:', data.analysis.overallScore);
      } else {
        console.error('❌ Analysis failed:', data.error);
        setCurrentInsights([]);
        setOverallScore(0);
      }
    } catch (error) {
      console.error('❌ Analysis error:', error);
      setCurrentInsights([]);
      setOverallScore(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplySuggestions = async () => {
    if (!generatedCode || currentInsights.length === 0) return;

    try {
      setIsApplying(true);

      // Prepara il prompt con tutti i suggerimenti
      const suggestionsText = currentInsights
        .map((insight, i) => `${i + 1}. ${insight.title}: ${insight.message}`)
        .join('\n');

      const response = await fetch('http://localhost:3001/api/ai/apply-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: generatedCode,
          suggestions: suggestionsText,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update code in parent component
        if (onCodeImproved) {
          onCodeImproved(data.improvedCode);
        }
        
        alert('✅ Suggestions applied successfully! Preview updated.');
        
        // Re-analyze the improved code
        setTimeout(() => {
          analyzeCode(data.improvedCode);
        }, 1000);
      } else {
        alert('❌ Failed to apply suggestions: ' + data.error);
      }
    } catch (error) {
      console.error('❌ Apply suggestions error:', error);
      alert('❌ Error applying suggestions: ' + error.message);
    } finally {
      setIsApplying(false);
    }
  };

  if (!isVisible || isCollapsed) {
    return (
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsCollapsed(false)}
        className="fixed right-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: 'rgba(10, 14, 39, 0.8)',
          border: `1px solid ${chlorophyTheme.colors.primary}40`,
          boxShadow: chlorophyTheme.shadows.glow,
        }}
      >
        <Sparkles size={24} style={{ color: chlorophyTheme.colors.primary }} />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-4 top-24 w-80 max-h-[calc(100vh-200px)] flex flex-col rounded-2xl overflow-hidden backdrop-blur-xl z-50"
      style={{
        background: 'rgba(10, 14, 39, 0.95)',
        border: `1px solid ${chlorophyTheme.colors.primary}20`,
        boxShadow: chlorophyTheme.shadows.glow,
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{
          borderColor: `${chlorophyTheme.colors.primary}20`,
        }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              rotate: (isAnalyzing || isApplying) ? [0, 360] : 0,
            }}
            transition={{
              duration: (isAnalyzing || isApplying) ? 1 : 0,
              repeat: (isAnalyzing || isApplying) ? Infinity : 0,
              ease: 'linear',
            }}
          >
            <Sparkles size={20} style={{ color: chlorophyTheme.colors.primary }} />
          </motion.div>
          <h3 
            className="text-sm font-bold"
            style={{
              color: chlorophyTheme.colors.primary,
              fontFamily: chlorophyTheme.fonts.display,
            }}
          >
            AI Insights
          </h3>
        </div>

        <motion.button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp size={16} style={{ color: '#ffffff60' }} />
        </motion.button>
      </div>

      {/* Insights List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isAnalyzing || currentInsights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Lightbulb size={48} style={{ color: chlorophyTheme.colors.primary, margin: '0 auto' }} />
            </motion.div>
            <p 
              className="text-sm mt-4"
              style={{
                color: '#ffffff60',
                fontFamily: chlorophyTheme.fonts.body,
              }}
            >
              {isAnalyzing ? 'Analyzing your code with AI...' : 'Waiting for analysis...'}
            </p>
          </motion.div>
        ) : (
          <>
            <AnimatePresence>
              {currentInsights.map((insight, index) => (
                <InsightCard
                  key={index}
                  insight={insight}
                  isExpanded={expandedIndex === index}
                  onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
                />
              ))}
            </AnimatePresence>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 rounded-xl text-center"
              style={{
                background: `${chlorophyTheme.colors.primary}10`,
                border: `1px solid ${chlorophyTheme.colors.primary}20`,
              }}
            >
              <Info size={20} style={{ color: chlorophyTheme.colors.primary, margin: '0 auto 8px' }} />
              <p 
                className="text-xs"
                style={{
                  color: '#ffffff80',
                  fontFamily: chlorophyTheme.fonts.body,
                }}
              >
                Your website scores <strong style={{ color: chlorophyTheme.colors.primary }}>{overallScore}/100</strong> on our quality index. {overallScore >= 80 ? 'Great work!' : overallScore >= 60 ? 'Good job!' : 'Needs improvement.'}
              </p>
            </motion.div>
          </>
        )}
      </div>

      {/* Footer CTA */}
      {currentInsights.length > 0 && (
        <div 
          className="px-4 py-3 border-t"
          style={{
            borderColor: `${chlorophyTheme.colors.primary}20`,
          }}
        >
          <motion.button
            disabled={isApplying}
            className="w-full py-2 rounded-lg text-xs font-medium"
            whileHover={{ scale: isApplying ? 1 : 1.02 }}
            whileTap={{ scale: isApplying ? 1 : 0.98 }}
            style={{
              background: isApplying 
                ? 'rgba(255, 255, 255, 0.1)'
                : chlorophyTheme.colors.gradients.primary,
              color: isApplying ? '#ffffff60' : chlorophyTheme.colors.dark,
              cursor: isApplying ? 'not-allowed' : 'pointer',
            }}
            onClick={handleApplySuggestions}
          >
            {isApplying ? 'Applying...' : 'Apply All Suggestions'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}