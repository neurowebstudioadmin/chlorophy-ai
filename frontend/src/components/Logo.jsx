export default function Logo({ size = "normal" }) {
  const sizes = {
    small: { container: "h-8", text: "text-lg" },
    normal: { container: "h-16", text: "text-3xl" },
    large: { container: "h-24", text: "text-5xl" }
  };
  
  const { container, text } = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${container}`}>
      {/* Logo Icon */}
      <div className="relative">
        <svg 
          className={container}
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer glow circle */}
          <circle cx="50" cy="50" r="45" fill="url(#glowGradient)" opacity="0.2" />
          
          {/* Main leaf circle background */}
          <circle cx="50" cy="50" r="40" fill="url(#mainGradient)" />
          
          {/* Stylized leaf design */}
          <path 
            d="M50 20 L50 80 M50 30 Q35 35 30 50 M50 30 Q65 35 70 50 M50 45 Q40 48 35 58 M50 45 Q60 48 65 58 M50 60 Q43 63 40 70 M50 60 Q57 63 60 70"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          
          {/* AI circuit nodes */}
          <circle cx="35" cy="40" r="2" fill="#06B6D4" />
          <circle cx="65" cy="40" r="2" fill="#06B6D4" />
          <circle cx="40" cy="55" r="2" fill="#84CC16" />
          <circle cx="60" cy="55" r="2" fill="#84CC16" />
          <circle cx="45" cy="68" r="2" fill="#06B6D4" />
          <circle cx="55" cy="68" r="2" fill="#06B6D4" />
          
          {/* Connecting lines (subtle) */}
          <line x1="35" y1="40" x2="40" y2="55" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
          <line x1="65" y1="40" x2="60" y2="55" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
          <line x1="40" y1="55" x2="45" y2="68" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
          <line x1="60" y1="55" x2="55" y2="68" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <radialGradient id="glowGradient">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <span className={`font-bold ${text} bg-gradient-to-r from-chlorophy-green via-chlorophy-cyan to-chlorophy-green bg-clip-text text-transparent`}>
          Chlorophy
        </span>
        <span className="text-xs font-semibold tracking-widest text-chlorophy-cyan uppercase">
          AI Studio
        </span>
      </div>
    </div>
  );
}