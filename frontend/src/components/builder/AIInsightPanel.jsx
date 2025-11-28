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

const insights = [
  {
    type: 'optimization',
    icon: Zap,
    color: chlorophyTheme.colors.accent,
    title: 'Performance Tip',
    message: 'Your images could be optimized. Consider using WebP format for 30% faster loading.',
    priority: 'medium',
  },
  {
    type: 'seo',
    icon: TrendingUp,
    color: chlorophyTheme.colors.primary,
    title: 'SEO Boost',
    message: 'Add meta descriptions to improve search engine visibility by up to 40%.',
    priority: 'high',
  },
  {
    type: 'accessibility',
    icon: CheckCircle,
    color: chlorophyTheme.colors.secondary,
    title: 'Accessibility',
    message: 'Great! All images have alt text. Your site is accessible to everyone.',
    priority: 'info',
  },
  {
    type: 'design',
    icon: Sparkles,
    color: '#FF6B9D',
    title: 'Design Suggestion',
    message: 'Consider adding smooth scroll animations for a more modern feel.',
    priority: 'low',
  },
  {
    type: 'mobile',
    icon: AlertCircle,
    color: '#FFA500',
    title: 'Mobile Optimization',
    message: 'Font sizes are perfect for mobile devices. Excellent responsive design!',
    priority: 'info',
  },
];

function InsightCard({ insight, isExpanded, onToggle }) {
  const Icon = insight.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="backdrop-blur-xl rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(10, 14, 39, 0.6)',
        border: `1px solid ${insight.color}40`,
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
              background: `${insight.color}20`,
            }}
          >
            <Icon size={20} style={{ color: insight.color }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 
                className="text-sm font-bold"
                style={{
                  color: insight.color,
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
                    background: `${insight.color}30`,
                    color: insight.color,
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

export default function AIInsightPanel({ generatedCode, isVisible = true }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentInsights, setCurrentInsights] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Simulate AI analyzing the code
    if (generatedCode) {
      const timer = setTimeout(() => {
        setCurrentInsights(insights);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [generatedCode]);

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
      className="fixed right-4 top-24 w-80 max-h-[calc(100vh-200px)] flex flex-col rounded-2xl overflow-hidden backdrop-blur-xl"
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
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
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
        {currentInsights.length === 0 ? (
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
              Analyzing your code...
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
                Your website scores <strong style={{ color: chlorophyTheme.colors.primary }}>85/100</strong> on our quality index. Great work!
              </p>
            </motion.div>
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div 
        className="px-4 py-3 border-t"
        style={{
          borderColor: `${chlorophyTheme.colors.primary}20`,
        }}
      >
        <motion.button
          className="w-full py-2 rounded-lg text-xs font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: chlorophyTheme.colors.gradients.primary,
            color: chlorophyTheme.colors.dark,
          }}
        >
          Apply All Suggestions
        </motion.button>
      </div>
    </motion.div>
  );
}