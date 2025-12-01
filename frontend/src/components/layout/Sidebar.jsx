import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  FolderOpen,
  Sparkles,
  BarChart3,
  CreditCard,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { chlorophyTheme } from '../../styles/chlorophy-theme';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard', color: chlorophyTheme.colors.primary },
  { id: 'builder', label: 'AI Builder', icon: Zap, path: '/builder', color: chlorophyTheme.colors.secondary },
  { id: 'projects', label: 'My Projects', icon: FolderOpen, path: '/projects', color: '#FF6B9D' },
  { id: 'templates', label: 'Templates', icon: Sparkles, path: '/templates', color: chlorophyTheme.colors.accent },
  { id: 'stats', label: 'Usage & Stats', icon: BarChart3, path: '/stats', color: '#00D9FF' },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard, path: '/billing', color: '#FFA500' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', color: '#9333EA' },
];

const bottomItems = [
  { id: 'profile', label: 'Profile', icon: User, path: '/profile', color: chlorophyTheme.colors.primary },
  { id: 'logout', label: 'Logout', icon: LogOut, path: '/logout', color: '#FF4757' },
];

export default function Sidebar({ isCollapsed, setIsCollapsed, userEmail = 'user@chlorophy.ai' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleNavigation = async (path, id) => {
  if (id === 'logout') {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        const { authService } = await import('../../services/supabase');
        await authService.signOut();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      } catch (err) {
        console.error('Logout error:', err);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }
  } else {
    navigate(path);
  }
};

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen flex flex-col border-r backdrop-blur-xl relative"
      style={{
        background: 'rgba(10, 14, 39, 0.95)',
        borderColor: `${chlorophyTheme.colors.primary}20`,
      }}
    >
      {/* Logo Section */}
      <div className="p-4 border-b" style={{ borderColor: `${chlorophyTheme.colors.primary}20` }}>
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <span className="text-2xl">🌿</span>
                <span 
                  className="text-xl font-bold"
                  style={{
                    fontFamily: chlorophyTheme.fonts.display,
                    background: chlorophyTheme.colors.gradients.primary,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Chlorophy
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse Button */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: `${chlorophyTheme.colors.primary}20`,
            }}
          >
            {isCollapsed ? (
              <ChevronRight size={18} style={{ color: chlorophyTheme.colors.primary }} />
            ) : (
              <ChevronLeft size={18} style={{ color: chlorophyTheme.colors.primary }} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const hovered = hoveredItem === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="w-full relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="active-sidebar"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `${item.color}20`,
                      border: `1px solid ${item.color}40`,
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Button Content */}
                <div 
                  className="relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all"
                  style={{
                    background: !active && hovered ? `${item.color}10` : 'transparent',
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <Icon 
                      size={20} 
                      style={{ 
                        color: active ? item.color : '#ffffff60',
                        filter: active ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                      }} 
                    />
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-medium whitespace-nowrap"
                        style={{
                          color: active ? item.color : '#ffffff80',
                          fontFamily: chlorophyTheme.fonts.body,
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Glow on active */}
                  {active && (
                    <motion.div
                      className="absolute -inset-1 rounded-lg -z-10"
                      style={{
                        background: `radial-gradient(circle, ${item.color}30, transparent 70%)`,
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
                </div>

                {/* Tooltip when collapsed */}
                {isCollapsed && hovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg whitespace-nowrap z-50 pointer-events-none"
                    style={{
                      background: `${item.color}90`,
                      color: '#fff',
                      boxShadow: `0 4px 12px ${item.color}40`,
                    }}
                  >
                    {item.label}
                    <div 
                      className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45"
                      style={{ background: `${item.color}90` }}
                    />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section - User */}
      <div 
        className="p-4 border-t space-y-1"
        style={{ borderColor: `${chlorophyTheme.colors.primary}20` }}
      >
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const hovered = hoveredItem === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="w-full relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all"
                style={{
                  background: hovered ? `${item.color}10` : 'transparent',
                }}
              >
                <div className="flex-shrink-0">
                  <Icon 
                    size={20} 
                    style={{ color: item.color }} 
                  />
                </div>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium whitespace-nowrap"
                      style={{
                        color: item.color,
                        fontFamily: chlorophyTheme.fonts.body,
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Tooltip when collapsed */}
              {isCollapsed && hovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg whitespace-nowrap z-50 pointer-events-none"
                  style={{
                    background: `${item.color}90`,
                    color: '#fff',
                    boxShadow: `0 4px 12px ${item.color}40`,
                  }}
                >
                  {item.label}
                  <div 
                    className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45"
                    style={{ background: `${item.color}90` }}
                  />
                </motion.div>
              )}
            </motion.button>
          );
        })}

        {/* User Info */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t"
            style={{ borderColor: `${chlorophyTheme.colors.primary}20` }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: chlorophyTheme.colors.gradients.primary,
                }}
              >
                <User size={20} style={{ color: chlorophyTheme.colors.dark }} />
              </div>
              <div className="flex-1 min-w-0">
                <p 
                  className="text-xs truncate"
                  style={{ color: '#ffffff60' }}
                >
                  Signed in as
                </p>
                <p 
                  className="text-sm font-medium truncate"
                  style={{ 
                    color: chlorophyTheme.colors.primary,
                    fontFamily: chlorophyTheme.fonts.body,
                  }}
                >
                  {userEmail}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}