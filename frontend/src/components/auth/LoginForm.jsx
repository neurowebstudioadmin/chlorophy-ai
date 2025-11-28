import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import Logo from '../Logo';
import { authService } from '../../services/supabase';
import { chlorophyTheme } from '../../styles/chlorophy-theme';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: chlorophyTheme.colors.gradients.hero,
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? chlorophyTheme.colors.primary : chlorophyTheme.colors.secondary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div 
          className="rounded-3xl backdrop-blur-xl p-8 shadow-2xl"
          style={{
            background: 'rgba(10, 14, 39, 0.9)',
            border: `1px solid ${chlorophyTheme.colors.primary}30`,
            boxShadow: `0 0 60px ${chlorophyTheme.colors.primary}20`,
          }}
        >
          {/* Logo */}
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
          >
            <Logo />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 
              className="text-3xl font-bold mb-2"
              style={{
                fontFamily: chlorophyTheme.fonts.display,
                background: chlorophyTheme.colors.gradients.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Welcome Back! 👋
            </h1>
            <p style={{ color: '#ffffff60' }}>
              Sign in to continue to Chlorophy AI
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(255, 71, 87, 0.2)',
                border: '1px solid rgba(255, 71, 87, 0.4)',
                color: '#FF4757',
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label 
                className="block text-sm font-semibold mb-2"
                style={{ 
                  color: '#ffffff',
                  fontFamily: chlorophyTheme.fonts.body,
                }}
              >
                Email
              </label>
              <div className="relative">
                <div 
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: chlorophyTheme.colors.primary }}
                >
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${chlorophyTheme.colors.primary}20`,
                    color: '#ffffff',
                    fontFamily: chlorophyTheme.fonts.body,
                  }}
                  onFocus={(e) => e.target.style.borderColor = chlorophyTheme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = `${chlorophyTheme.colors.primary}20`}
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label 
                className="block text-sm font-semibold mb-2"
                style={{ 
                  color: '#ffffff',
                  fontFamily: chlorophyTheme.fonts.body,
                }}
              >
                Password
              </label>
              <div className="relative">
                <div 
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: chlorophyTheme.colors.primary }}
                >
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${chlorophyTheme.colors.primary}20`,
                    color: '#ffffff',
                    fontFamily: chlorophyTheme.fonts.body,
                  }}
                  onFocus={(e) => e.target.style.borderColor = chlorophyTheme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = `${chlorophyTheme.colors.primary}20`}
                  required
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                background: loading 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : chlorophyTheme.colors.gradients.primary,
                color: loading ? '#ffffff60' : chlorophyTheme.colors.dark,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : `0 0 30px ${chlorophyTheme.colors.primary}40`,
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles size={20} />
                  </motion.div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Login
                </>
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.p 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ color: '#ffffff80' }}
          >
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-bold transition-colors"
              style={{
                color: chlorophyTheme.colors.primary,
              }}
              onMouseEnter={(e) => e.target.style.color = chlorophyTheme.colors.secondary}
              onMouseLeave={(e) => e.target.style.color = chlorophyTheme.colors.primary}
            >
              Sign up
            </button>
          </motion.p>
        </div>

        {/* Bottom Decoration */}
        <motion.div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p style={{ color: '#ffffff40', fontSize: '12px' }}>
            © 2025 Chlorophy AI - Built with 💚
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}