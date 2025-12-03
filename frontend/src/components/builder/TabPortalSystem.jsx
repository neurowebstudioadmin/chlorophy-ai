import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Code2, Dna, Rocket } from 'lucide-react';
import { chlorophyTheme } from '../../styles/chlorophy-theme';

const tabs = [
  { 
    id: 'streaming', 
    label: 'Live Streaming', 
    icon: Sparkles, 
    color: '#10B981',
    description: 'Watch AI write code'
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
    id: 'dna', 
    label: 'Website DNA', 
    icon: Dna, 
    color: '#8B5CF6',
    description: 'Quality & Certificate'
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

            {/* Icon with Special Animations */}
            <motion.div
              className="relative flex items-center justify-center mb-1"
              animate={
                tab.id === 'streaming' && isActive
                  ? {
                      scale: [1, 1.1, 1],
                    }
                  : tab.id === 'dna' && isActive
                  ? {
                      rotate: [0, 360],
                    }
                  : isHovered
                  ? { rotate: [0, -10, 10, -10, 0] }
                  : {}
              }
              transition={{ 
                duration: tab.id === 'streaming' && isActive ? 2 : tab.id === 'dna' && isActive ? 3 : 0.5,
                repeat: (tab.id === 'streaming' || tab.id === 'dna') && isActive ? Infinity : 0,
                ease: tab.id === 'dna' && isActive ? 'linear' : 'easeInOut',
              }}
            >
              <Icon 
                size={24} 
                style={{ 
                  color: isActive ? tab.color : '#ffffff60',
                  filter: isActive ? `drop-shadow(0 0 8px ${tab.color})` : 'none',
                  transition: 'all 0.3s',
                }}
              />
              
              {/* LIVE Badge for Live Streaming when active */}
              {tab.id === 'streaming' && isActive && (
                <motion.div
                  className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[8px] font-black"
                  style={{
                    background: tab.color,
                    color: '#000',
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  LIVE
                </motion.div>
              )}
              
              {/* Extra sparkles for Live Streaming when active */}
              {tab.id === 'streaming' && isActive && (
                <>
                  <motion.div
                    className="absolute"
                    style={{ top: -8, right: -8 }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0,
                    }}
                  >
                    <Sparkles size={12} style={{ color: tab.color }} />
                  </motion.div>
                  <motion.div
                    className="absolute"
                    style={{ bottom: -8, left: -8 }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [360, 180, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1,
                    }}
                  >
                    <Sparkles size={12} style={{ color: tab.color }} />
                  </motion.div>
                </>
              )}

              {/* Orbiting effect for DNA when active */}
              {tab.id === 'dna' && isActive && (
                <>
                  <motion.div
                    className="absolute w-8 h-8 border border-current rounded-full"
                    style={{ color: `${tab.color}40` }}
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 2, repeat: Infinity },
                    }}
                  />
                  <motion.div
                    className="absolute w-6 h-6 border border-current rounded-full"
                    style={{ color: `${tab.color}60` }}
                    animate={{
                      rotate: -360,
                      scale: [1.2, 1, 1.2],
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 2, repeat: Infinity, delay: 0.5 },
                    }}
                  />
                </>
              )}
              
              {/* Sparkle effect on hover for other tabs */}
              {isHovered && tab.id !== 'streaming' && tab.id !== 'dna' && (
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

            {/* Hover Tooltip */}
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