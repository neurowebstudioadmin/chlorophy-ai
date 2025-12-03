import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Clock, 
  CheckCircle,
  Eye,
  Download,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import { chlorophyTheme } from '../styles/chlorophy-theme';
import { authService, projectsService } from '../services/supabase';
import { downloadProjectZip } from '../utils/zipUtils';

// 🎨 CUSTOM DROPDOWN COMPONENT
function StatusDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'all', label: 'All Status', icon: '📋', color: '#10B981' },
    { value: 'draft', label: 'Draft', icon: '⏰', color: '#F59E0B' },
    { value: 'deployed', label: 'Deployed', icon: '✅', color: '#10B981' },
  ];

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-3 rounded-xl focus:outline-none cursor-pointer flex items-center gap-3 min-w-[180px]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: 'rgba(10, 14, 39, 0.6)',
          border: `1px solid ${chlorophyTheme.colors.primary}20`,
          color: '#ffffff',
        }}
      >
        <span className="text-xl">{selectedOption.icon}</span>
        <span className="flex-1 text-left font-medium">{selectedOption.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden shadow-2xl z-10"
            style={{
              background: 'rgba(10, 14, 39, 0.95)',
              border: `1px solid ${chlorophyTheme.colors.primary}40`,
              backdropFilter: 'blur(20px)',
            }}
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-6 py-3 flex items-center gap-3 transition-all"
                whileHover={{ 
                  background: `${option.color}20`,
                  x: 5
                }}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  color: value === option.value ? option.color : '#ffffff80',
                }}
              >
                <span className="text-xl">{option.icon}</span>
                <span className="flex-1 text-left font-medium">{option.label}</span>
                {value === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: option.color }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MyProjects() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchQuery, filterStatus, projects]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) return;

      const userProjects = await projectsService.getUserProjects(user.id);
      setProjects(userProjects);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  const handleDelete = async (projectId) => {
    if (!confirm('Sei sicuro di voler eliminare questo progetto?')) return;

    try {
      await projectsService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Errore durante l\'eliminazione del progetto');
    }
  };

  const handleView = (project) => {
    // Open preview in new tab
    const blob = new Blob([project.html_content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownloadZip = async (project) => {
    try {
      await downloadProjectZip(project.html_content, project.name);
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      alert('Errore durante il download del progetto. Riprova!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
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
            My Projects
          </h1>
          <p style={{ color: '#ffffff80' }}>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} created
          </p>
        </div>

        <motion.button
          onClick={() => navigate('/builder')}
          className="px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: chlorophyTheme.colors.gradients.primary,
            color: chlorophyTheme.colors.dark,
          }}
        >
          <Plus size={20} />
          New Project
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search 
            size={20} 
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: '#ffffff60' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none"
            style={{
              background: 'rgba(10, 14, 39, 0.6)',
              border: `1px solid ${chlorophyTheme.colors.primary}20`,
              color: '#ffffff',
            }}
          />
        </div>

        {/* Custom Status Dropdown */}
        <StatusDropdown value={filterStatus} onChange={setFilterStatus} />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div 
          className="p-12 rounded-2xl backdrop-blur-xl text-center"
          style={{
            background: 'rgba(10, 14, 39, 0.6)',
            border: `1px solid ${chlorophyTheme.colors.primary}20`,
          }}
        >
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>
            {searchQuery || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="mb-4" style={{ color: '#ffffff60' }}>
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your filters'
              : 'Create your first project with AI'}
          </p>
          {!searchQuery && filterStatus === 'all' && (
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
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl backdrop-blur-xl overflow-hidden group"
              style={{
                background: 'rgba(10, 14, 39, 0.6)',
                border: `1px solid ${chlorophyTheme.colors.primary}20`,
              }}
            >
              {/* Preview Thumbnail */}
              <div 
                className="h-48 relative overflow-hidden cursor-pointer"
                onClick={() => handleView(project)}
                style={{
                  background: 'rgba(26, 31, 58, 0.8)',
                }}
              >
                {project.preview_image ? (
                  <img 
                    src={project.preview_image} 
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen size={48} style={{ color: chlorophyTheme.colors.primary }} />
                  </div>
                )}
                
                {/* Status Badge */}
                <div 
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  style={{
                    background: project.status === 'deployed'
                      ? `${chlorophyTheme.colors.primary}30`
                      : 'rgba(255, 255, 255, 0.2)',
                    color: project.status === 'deployed'
                      ? chlorophyTheme.colors.primary
                      : '#ffffff',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {project.status === 'deployed' ? (
                    <CheckCircle size={12} />
                  ) : (
                    <Clock size={12} />
                  )}
                  {project.status.toUpperCase()}
                </div>

                {/* Hover Overlay */}
                <div 
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-3 rounded-full"
                    style={{
                      background: chlorophyTheme.colors.primary,
                      color: '#ffffff',
                    }}
                  >
                    <Eye size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 
                  className="text-lg font-bold mb-1 truncate"
                  style={{ color: '#ffffff' }}
                >
                  {project.name}
                </h3>
                <p 
                  className="text-sm mb-3 line-clamp-2"
                  style={{ color: '#ffffff80' }}
                >
                  {project.description || 'No description'}
                </p>

                <div className="flex items-center justify-between text-xs mb-4" style={{ color: '#ffffff60' }}>
                  <span>{formatDate(project.created_at)}</span>
                  {project.views_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {project.views_count} views
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleView(project)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: `${chlorophyTheme.colors.primary}20`,
                      color: chlorophyTheme.colors.primary,
                    }}
                  >
                    <ExternalLink size={14} />
                    View
                  </motion.button>

                  {/* 🆕 DOWNLOAD ZIP BUTTON */}
                  <motion.button
                    onClick={() => handleDownloadZip(project)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10B981',
                    }}
                  >
                    <Download size={14} />
                    ZIP
                  </motion.button>

                  <motion.button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: 'rgba(255, 71, 87, 0.2)',
                      color: '#FF4757',
                    }}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}