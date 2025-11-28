// 🌿 Chlorophy AI - Design System
// The most beautiful AI website builder ever created

export const chlorophyTheme = {
  // Core Colors - "Chlorophyll Tech"
  colors: {
    primary: '#00FF7F',        // Spring Green - vibrante
    secondary: '#7B68EE',      // Medium Slate Blue - tech
    accent: '#FFD700',         // Gold - premium
    dark: '#0A0E27',          // Deep Space Blue
    darkAlt: '#1a1f3a',       // Dark alternative
    light: '#F0FFF4',         // Honeydew
    white: '#FFFFFF',
    
    // Semantic colors
    success: '#00FF7F',
    warning: '#FFD700',
    error: '#FF4757',
    info: '#7B68EE',
    
    // Glow effects
    glow: {
      primary: 'rgba(0, 255, 127, 0.3)',
      secondary: 'rgba(123, 104, 238, 0.2)',
      accent: 'rgba(255, 215, 0, 0.2)',
    },
    
    // Gradients
    gradients: {
      hero: 'linear-gradient(135deg, #0A0E27 0%, #1a1f3a 50%, #2a3f5f 100%)',
      primary: 'linear-gradient(135deg, #00FF7F 0%, #7B68EE 100%)',
      accent: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      dark: 'linear-gradient(180deg, #0A0E27 0%, #1a1f3a 100%)',
    }
  },
  
  // Typography
  fonts: {
    display: "'Space Grotesk', sans-serif",
    code: "'Fira Code', monospace",
    body: "'Inter', sans-serif",
  },
  
  // Shadows & Effects
  shadows: {
    glow: '0 0 30px rgba(0, 255, 127, 0.3), 0 0 60px rgba(123, 104, 238, 0.2)',
    glowStrong: '0 0 40px rgba(0, 255, 127, 0.5), 0 0 80px rgba(123, 104, 238, 0.3)',
    card: '0 8px 32px rgba(10, 14, 39, 0.2)',
    cardHover: '0 12px 48px rgba(10, 14, 39, 0.3)',
  },
  
  // Border Radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Animations
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    }
  },
  
  // Breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  }
};

// Helper functions
export const getGlowStyle = (color = 'primary') => ({
  boxShadow: chlorophyTheme.shadows.glow,
  transition: `all ${chlorophyTheme.animations.duration.normal} ${chlorophyTheme.animations.easing.smooth}`,
});

export const getGradientText = (gradient = 'primary') => ({
  background: chlorophyTheme.colors.gradients[gradient],
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});