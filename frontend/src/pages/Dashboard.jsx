import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, FolderOpen, Sparkles, TrendingUp, Plus, Clock, Star } from 'lucide-react';
import { chlorophyTheme } from '../styles/chlorophy-theme';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Sites Created', value: '12', icon: Zap, color: chlorophyTheme.colors.primary, trend: '+3 this week' },
    { label: 'Projects', value: '8', icon: FolderOpen, color: '#FF6B9D', trend: '2 active' },
    { label: 'Templates Used', value: '5', icon: Sparkles, color: chlorophyTheme.colors.accent, trend: 'Premium' },
    { label: 'Total Views', value: '1.2K', icon: TrendingUp, color: '#00D9FF', trend: '+24%' },
  ];

  const recentProjects = [
    { name: 'E-commerce Store', type: 'Online Shop', updated: '2 hours ago', status: 'deployed' },
    { name: 'Portfolio Website', type: 'Personal', updated: '1 day ago', status: 'draft' },
    { name: 'Restaurant Menu', type: 'Business', updated: '3 days ago', status: 'deployed' },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 
          className="text-4xl font-bold mb-2"
          style={{
            fontFamily: chlorophyTheme.fonts.display,
            background: chlorophyTheme.colors.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Welcome back! 👋
        </h1>
        <p 
          className="text-lg"
          style={{ 
            color: '#ffffff80',
            fontFamily: chlorophyTheme.fonts.body,
          }}
        >
          Ready to create something amazing today?
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <motion.button
          onClick={() => navigate('/builder')}
          className="p-6 rounded-2xl backdrop-blur-xl flex items-center gap-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: 'rgba(10, 14, 39, 0.8)',
            border: `2px solid ${chlorophyTheme.colors.primary}40`,
            boxShadow: `0 0 30px ${chlorophyTheme.colors.primary}20`,
          }}
        >
          <div 
            className="p-4 rounded-xl"
            style={{
              background: chlorophyTheme.colors.gradients.primary,
            }}
          >
            <Plus size={32} style={{ color: chlorophyTheme.colors.dark }} />
          </div>
          <div className="text-left">
            <h3 
              className="text-xl font-bold mb-1"
              style={{
                color: chlorophyTheme.colors.primary,
                fontFamily: chlorophyTheme.fonts.display,
              }}
            >
              New Project
            </h3>
            <p className="text-sm" style={{ color: '#ffffff60' }}>
              Start with AI Builder
            </p>
          </div>
        </motion.button>

        <motion.button
          onClick={() => navigate('/templates')}
          className="p-6 rounded-2xl backdrop-blur-xl flex items-center gap-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: 'rgba(10, 14, 39, 0.8)',
            border: `2px solid ${chlorophyTheme.colors.accent}40`,
            boxShadow: `0 0 30px ${chlorophyTheme.colors.accent}20`,
          }}
        >
          <div 
            className="p-4 rounded-xl"
            style={{
              background: chlorophyTheme.colors.gradients.accent,
            }}
          >
            <Sparkles size={32} style={{ color: chlorophyTheme.colors.dark }} />
          </div>
          <div className="text-left">
            <h3 
              className="text-xl font-bold mb-1"
              style={{
                color: chlorophyTheme.colors.accent,
                fontFamily: chlorophyTheme.fonts.display,
              }}
            >
              Browse Templates
            </h3>
            <p className="text-sm" style={{ color: '#ffffff60' }}>
              Premium collection
            </p>
          </div>
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="p-6 rounded-2xl backdrop-blur-xl"
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(10, 14, 39, 0.8)',
                border: `1px solid ${stat.color}40`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="p-3 rounded-xl"
                  style={{
                    background: `${stat.color}20`,
                  }}
                >
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: `${stat.color}20`,
                    color: stat.color,
                  }}
                >
                  {stat.trend}
                </span>
              </div>
              <p 
                className="text-3xl font-bold mb-1"
                style={{
                  color: stat.color,
                  fontFamily: chlorophyTheme.fonts.display,
                }}
              >
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: '#ffffff60' }}>
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl backdrop-blur-xl overflow-hidden"
        style={{
          background: 'rgba(10, 14, 39, 0.8)',
          border: `1px solid ${chlorophyTheme.colors.primary}20`,
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: `${chlorophyTheme.colors.primary}20` }}>
          <div className="flex items-center justify-between">
            <h2 
              className="text-2xl font-bold"
              style={{
                color: chlorophyTheme.colors.primary,
                fontFamily: chlorophyTheme.fonts.display,
              }}
            >
              Recent Projects
            </h2>
            <button
              onClick={() => navigate('/projects')}
              className="text-sm font-medium px-4 py-2 rounded-lg"
              style={{
                color: chlorophyTheme.colors.primary,
                background: `${chlorophyTheme.colors.primary}20`,
              }}
            >
              View All
            </button>
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: `${chlorophyTheme.colors.primary}10` }}>
          {recentProjects.map((project, index) => (
            <motion.div
              key={index}
              className="p-6 flex items-center justify-between cursor-pointer"
              whileHover={{ backgroundColor: 'rgba(0, 255, 127, 0.05)' }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${chlorophyTheme.colors.primary}20`,
                  }}
                >
                  <FolderOpen size={24} style={{ color: chlorophyTheme.colors.primary }} />
                </div>
                <div>
                  <h3 
                    className="font-semibold mb-1"
                    style={{
                      color: '#ffffff',
                      fontFamily: chlorophyTheme.fonts.body,
                    }}
                  >
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm" style={{ color: '#ffffff60' }}>
                    <span>{project.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {project.updated}
                    </span>
                  </div>
                </div>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: project.status === 'deployed' 
                    ? `${chlorophyTheme.colors.primary}20`
                    : 'rgba(255, 255, 255, 0.1)',
                  color: project.status === 'deployed' 
                    ? chlorophyTheme.colors.primary
                    : '#ffffff60',
                }}
              >
                {project.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}