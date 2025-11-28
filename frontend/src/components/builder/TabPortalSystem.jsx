import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Eye, Code2, Globe, Rocket, Sparkles } from 'lucide-react';
import { chlorophyTheme } from '../../styles/chlorophy-theme';

const tabs = [
  { 
    id: 'chat', 
    label: 'Chat', 
    icon: MessageSquare, 
    color: chlorophyTheme.colors.primary,
    description: 'Talk with AI'
  },
  { 
    id: 'preview', 
    label: 'Preview', 
    icon: Eye, 
    color: chlorophyTheme.colors.secondary,
    description: 'Live website'
  },
  { 
    id: 'code', 
    label: 'Code', 
    icon: Code2, 
    color: chlorophyTheme.colors.accent,
    description: 'View files'
  },
  { 
    id: 'galaxy', 
    label: 'Galaxy', 
    icon: Globe, 
    color: '#FF6B9D',
    description: '3D visualization'
  },
  { 
    id: 'deploy', 
    label: 'Deploy', 
    icon: Rocket, 
    color: '#00D9FF',
    description: 'Go live now'
  },
];

export default function TabPortalSystem({ activeTab, onTabChange }) {
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <div 
      className="relative flex items-center justify-center gap-2 p-2 rounded-2xl backdrop-blur-xl border border-white/10"
      style={{
        background: 'rgba(10, 14, 39, 0.8)',
        boxShadow: chlorophyTheme.shadows.glow,
      }}
    >
      {/* Background Glow Effect */}
      <AnimatePresence>
        {hoveredTab !== null && (
          <motion.div
            layoutId="tab-glow"
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${hoveredTab * 20}% 50%, ${tabs[hoveredTab]?.color}30, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Tabs */}
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isHovered = hoveredTab === index;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            onMouseEnter={() => setHoveredTab(index)}
            onMouseLeave={() => setHoveredTab(null)}
            className="relative flex flex-col items-center justify-center px-6 py-3 rounded-xl transition-all group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: isActive 
                ? `linear-gradient(135deg, ${tab.color}20, ${tab.color}10)`
                : 'transparent',
            }}
          >
            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${tab.color}30, ${tab.color}10)`,
                  boxShadow: `0 0 20px ${tab.color}50`,
                }}
                transition={{ 
                  type: 'spring', 
                  bounce: 0.2, 
                  duration: 0.6 
                }}
              />
            )}

            {/* Icon */}
            <motion.div
              className="relative flex items-center justify-center mb-1"
              animate={{
                rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon 
                size={24} 
                style={{ 
                  color: isActive ? tab.color : '#ffffff60',
                  filter: isActive ? `drop-shadow(0 0 8px ${tab.color})` : 'none',
                  transition: 'all 0.3s',
                }}
              />
              
              {/* Sparkle effect on hover */}
              {isHovered && (
                <motion.div
                  className="absolute"
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: [0, 1.5, 0], rotate: 180 }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <Sparkles size={16} style={{ color: tab.color }} />
                </motion.div>
              )}
            </motion.div>

            {/* Label */}
            <span 
              className="relative text-xs font-medium transition-all"
              style={{
                color: isActive ? tab.color : '#ffffff80',
                fontFamily: chlorophyTheme.fonts.display,
              }}
            >
              {tab.label}
            </span>

            {/* Hover Tooltip - FIXED z-index */}
            <AnimatePresence>
              {isHovered && !isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap pointer-events-none z-[9999]"
                  style={{
                    background: `linear-gradient(135deg, ${tab.color}90, ${tab.color}70)`,
                    color: '#fff',
                    boxShadow: `0 4px 12px ${tab.color}40`,
                  }}
                >
                  {tab.description}
                  <div 
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                    style={{ background: `${tab.color}90` }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}

      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: tabs[i]?.color || chlorophyTheme.colors.primary,
              left: `${20 + i * 20}%`,
              top: '50%',
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}