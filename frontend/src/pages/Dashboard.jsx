import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Sparkles, TrendingUp, FolderOpen, Eye, CheckCircle, Clock } from 'lucide-react';
import { chlorophyTheme } from '../styles/chlorophy-theme';
import { authService, projectsService, profileService } from '../services/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    deployedProjects: 0,
    draftProjects: 0,
    totalViews: 0,
    templatesUsed: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = await authService.getCurrentUser();
      if (!user) return;

      // Get user profile for REAL name
      const userProfile = await profileService.getProfile(user.id);
      setUserName(userProfile?.name || user.email?.split('@')[0] || 'User');

      // Get stats
      const projectStats = await projectsService.getProjectStats(user.id);
      setStats(projectStats);

      // Get recent projects (last 3)
      const allProjects = await projectsService.getUserProjects(user.id);
      setRecentProjects(allProjects.slice(0, 3));

    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      change: stats.draftProjects > 0 ? `${stats.draftProjects} active` : 'No active',
      icon: FolderOpen,
      color: chlorophyTheme.colors.primary,
    },
    {
      label: 'Deployed',
      value: stats.deployedProjects,
      change: stats.totalProjects > 0 ? `${Math.round((stats.deployedProjects / stats.totalProjects) * 100)}% deployed` : '0%',
      icon: CheckCircle,
      color: chlorophyTheme.colors.secondary,
    },
    {
      label: 'Templates Used',
      value: stats.templatesUsed,
      change: 'Premium quality',
      icon: Sparkles,
      color: chlorophyTheme.colors.accent,
    },
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: stats.totalViews > 0 ? '+Analytics' : 'No views yet',
      icon: Eye,
      color: '#00D9FF',
    },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 
          className="text-5xl font-bold mb-2"
          style={{
            fontFamily: chlorophyTheme.fonts.display,
            background: chlorophyTheme.colors.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Welcome back, {userName}! 👋
        </h1>
        <p 
          className="text-xl"
          style={{ 
            color: '#ffffff80',
            fontFamily: chlorophyTheme.fonts.body,
          }}
        >
          Here's what's happening with your projects
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
          className="p-6 rounded-2xl backdrop-blur-xl text-left transition-all"
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: `linear-gradient(135deg, ${chlorophyTheme.colors.primary}20, ${chlorophyTheme.colors.primary}10)`,
            border: `1px solid ${chlorophyTheme.colors.primary}40`,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="p-3 rounded-xl"
              style={{ background: `${chlorophyTheme.colors.primary}30` }}
            >
              <Zap size={24} style={{ color: chlorophyTheme.colors.primary }} />
            </div>
            <h3 
              className="text-2xl font-bold"
              style={{ color: chlorophyTheme.colors.primary }}
            >
              New Project
            </h3>
          </div>
          <p style={{ color: '#ffffff80' }}>
            Start building with AI assistance
          </p>
        </motion.button>

        <motion.button
          onClick={() => navigate('/templates')}
          className="p-6 rounded-2xl backdrop-blur-xl text-left transition-all"
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: `linear-gradient(135deg, ${chlorophyTheme.colors.secondary}20, ${chlorophyTheme.colors.secondary}10)`,
            border: `1px solid ${chlorophyTheme.colors.secondary}40`,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="p-3 rounded-xl"
              style={{ background: `${chlorophyTheme.colors.secondary}30` }}
            >
              <Sparkles size={24} style={{ color: chlorophyTheme.colors.secondary }} />
            </div>
            <h3 
              className="text-2xl font-bold"
              style={{ color: chlorophyTheme.colors.secondary }}
            >
              Browse Templates
            </h3>
          </div>
          <p style={{ color: '#ffffff80' }}>
            Explore premium templates
          </p>
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="p-6 rounded-2xl backdrop-blur-xl"
            whileHover={{ scale: 1.05, y: -5 }}
            style={{
              background: 'rgba(10, 14, 39, 0.6)',
              border: `1px solid ${stat.color}20`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={28} style={{ color: stat.color }} />
              <TrendingUp size={20} style={{ color: stat.color }} />
            </div>
            <h3 
              className="text-3xl font-bold mb-1"
              style={{ 
                color: stat.color,
                fontFamily: chlorophyTheme.fonts.display,
              }}
            >
              {stat.value}
            </h3>
            <p 
              className="text-sm mb-1"
              style={{ color: '#ffffff', fontWeight: 600 }}
            >
              {stat.label}
            </p>
            <p 
              className="text-xs"
              style={{ color: '#ffffff60' }}
            >
              {stat.change}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-2xl font-bold"
            style={{
              color: '#ffffff',
              fontFamily: chlorophyTheme.fonts.display,
            }}
          >
            Recent Projects
          </h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-sm font-medium"
            style={{ color: chlorophyTheme.colors.primary }}
          >
            View all →
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div 
            className="p-12 rounded-2xl backdrop-blur-xl text-center"
            style={{
              background: 'rgba(10, 14, 39, 0.6)',
              border: `1px solid ${chlorophyTheme.colors.primary}20`,
            }}
          >
            <div className="text-6xl mb-4">🚀</div>
            <h3 
              className="text-xl font-bold mb-2"
              style={{ color: '#ffffff' }}
            >
              No projects yet
            </h3>
            <p 
              className="mb-4"
              style={{ color: '#ffffff60' }}
            >
              Start building your first website with AI
            </p>
            <motion.button
              onClick={() => navigate('/builder')}
              className="px-6 py-3 rounded-xl font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: chlorophyTheme.colors.gradients.primary,
                color: chlorophyTheme.colors.dark,
              }}
            >
              Create Your First Project
            </motion.button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 rounded-xl backdrop-blur-xl flex items-center justify-between cursor-pointer transition-all"
                whileHover={{ scale: 1.02, x: 10 }}
                onClick={() => navigate('/projects')}
                style={{
                  background: 'rgba(10, 14, 39, 0.6)',
                  border: `1px solid ${chlorophyTheme.colors.primary}20`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ 
                      background: project.status === 'deployed' 
                        ? `${chlorophyTheme.colors.primary}20`
                        : `${chlorophyTheme.colors.secondary}20`
                    }}
                  >
                    {project.status === 'deployed' ? (
                      <CheckCircle size={24} style={{ color: chlorophyTheme.colors.primary }} />
                    ) : (
                      <Clock size={24} style={{ color: chlorophyTheme.colors.secondary }} />
                    )}
                  </div>
                  <div>
                    <h3 
                      className="font-semibold text-lg"
                      style={{ color: '#ffffff' }}
                    >
                      {project.name}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: '#ffffff60' }}
                    >
                      {project.description || 'No description'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-medium mb-1"
                    style={{
                      background: project.status === 'deployed' 
                        ? `${chlorophyTheme.colors.primary}30`
                        : `${chlorophyTheme.colors.secondary}30`,
                      color: project.status === 'deployed' 
                        ? chlorophyTheme.colors.primary
                        : chlorophyTheme.colors.secondary,
                    }}
                  >
                    {project.status.toUpperCase()}
                  </div>
                  <p 
                    className="text-xs"
                    style={{ color: '#ffffff60' }}
                  >
                    {formatTimeAgo(project.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}