import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Trail } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { chlorophyTheme } from '../../styles/chlorophy-theme';
import * as THREE from 'three';
import { Play, Pause, Zap } from 'lucide-react';

// Matrix Code Rain Effect
function MatrixRain() {
  const canvasRef = useRef();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]()/*-+=;:';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-20 pointer-events-none"
    />
  );
}

// File Planet Component
function FilePlanet({ position, color, label, size, onClick, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      
      if (isSelected) {
        meshRef.current.scale.setScalar(size + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      } else if (hovered) {
        meshRef.current.scale.setScalar(size * 1.2);
      } else {
        meshRef.current.scale.setScalar(size);
      }
    }
  });

  return (
    <group position={position}>
      <Trail
        width={2}
        length={6}
        color={color}
        attenuation={(t) => t * t}
      >
        <Sphere
          ref={meshRef}
          args={[1, 32, 32]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
            roughness={0.3}
            metalness={0.8}
          />
        </Sphere>
      </Trail>

      {(hovered || isSelected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.02, 16, 100]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}

      <Text
        position={[0, -1.8, 0]}
        fontSize={0.3}
        color={hovered || isSelected ? color : '#ffffff80'}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={hovered || isSelected ? 2 : 1}
        distance={5}
      />
    </group>
  );
}

// Connection Lines
function ConnectionLine({ start, end, color }) {
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ];
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        linewidth={1}
      />
    </line>
  );
}

// 🌟 GALACTIC BUTTON CENTERPIECE
function GalacticCore({ isActive, onClick }) {
  const coreRef = useRef();
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.02;
      coreRef.current.rotation.x += 0.01;
      
      if (isActive) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 1;
        coreRef.current.scale.setScalar(pulse);
      }
    }
  });
  
  return (
    <group position={[0, 0, 0]} onClick={onClick}>
      {/* Core Sphere */}
      <Sphere ref={coreRef} args={[0.8, 32, 32]}>
        <meshStandardMaterial
          color={chlorophyTheme.colors.primary}
          emissive={chlorophyTheme.colors.primary}
          emissiveIntensity={isActive ? 2 : 1}
          roughness={0.1}
          metalness={1}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Orbiting Rings */}
      {[0, 60, 120].map((angle, i) => (
        <mesh 
          key={i} 
          rotation={[
            (angle * Math.PI) / 180,
            (angle * Math.PI) / 180,
            0
          ]}
        >
          <torusGeometry args={[1.2, 0.03, 16, 100]} />
          <meshBasicMaterial 
            color={chlorophyTheme.colors.primary} 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      ))}
      
      {/* Glow */}
      <pointLight
        color={chlorophyTheme.colors.primary}
        intensity={isActive ? 3 : 1.5}
        distance={10}
      />
      
      {/* Icon */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {isActive ? '⏸' : '▶'}
      </Text>
    </group>
  );
}

// Main Galaxy Scene
function GalaxyScene({ onFileSelect, selectedFile, isLiveMode, onCoreClick }) {
  const files = [
    { name: 'index.html', position: [-4, 0, 0], color: '#E34C26', size: 1.5, label: 'HTML' },
    { name: 'style.css', position: [0, 3, -2], color: '#264DE4', size: 1.2, label: 'CSS' },
    { name: 'script.js', position: [4, 0, 2], color: '#F7DF1E', size: 1.2, label: 'JS' },
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* 🌟 GALACTIC CORE BUTTON */}
      <GalacticCore isActive={isLiveMode} onClick={onCoreClick} />

      {/* File Planets */}
      {files.map((file, index) => (
        <FilePlanet
          key={file.name}
          position={file.position}
          color={file.color}
          label={file.label}
          size={file.size}
          onClick={() => onFileSelect(index)}
          isSelected={selectedFile === index}
        />
      ))}

      {/* Connection Lines from Core to Planets */}
      {files.map((file) => (
        <ConnectionLine 
          key={file.name}
          start={[0, 0, 0]} 
          end={file.position} 
          color={file.color} 
        />
      ))}

      {/* Stars Background */}
      {[...Array(200)].map((_, i) => {
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;
        const z = (Math.random() - 0.5) * 50;
        return (
          <Sphere key={i} args={[0.02]} position={[x, y, z]}>
            <meshBasicMaterial color="#ffffff" />
          </Sphere>
        );
      })}

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        autoRotate={!isLiveMode}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Live Code Stream Display
function LiveCodeStream({ isActive, code }) {
  const [displayedCode, setDisplayedCode] = useState('');
  
  useEffect(() => {
    if (!isActive || !code) {
      setDisplayedCode('');
      return;
    }
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode(code.substring(0, index));
        index += Math.floor(Math.random() * 5) + 1;
      } else {
        clearInterval(interval);
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [isActive, code]);
  
  if (!isActive) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-4 top-20 bottom-4 w-96 backdrop-blur-xl rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.9)',
        border: `1px solid ${chlorophyTheme.colors.primary}40`,
        boxShadow: `0 0 40px ${chlorophyTheme.colors.primary}40`,
      }}
    >
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{
          background: 'rgba(26, 31, 58, 0.8)',
          borderColor: `${chlorophyTheme.colors.primary}20`,
        }}
      >
        <div className="flex items-center gap-2">
          <Zap size={18} style={{ color: chlorophyTheme.colors.primary }} />
          <span 
            className="text-sm font-bold"
            style={{ 
              color: chlorophyTheme.colors.primary,
              fontFamily: chlorophyTheme.fonts.display,
            }}
          >
            Live Code Stream
          </span>
        </div>
        <div className="flex items-center gap-1">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: '#10B981' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs" style={{ color: '#10B981' }}>
            LIVE
          </span>
        </div>
      </div>
      
      <div className="p-4 h-full overflow-auto">
        <pre 
          className="text-xs leading-relaxed"
          style={{
            color: '#0F0',
            fontFamily: 'monospace',
            textShadow: `0 0 5px ${chlorophyTheme.colors.primary}`,
          }}
        >
          {displayedCode}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ▋
          </motion.span>
        </pre>
      </div>
    </motion.div>
  );
}

export default function GalaxyView({ onFileSelect, projectFiles }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  // Simulate code for demo
  const sampleCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Generated Site</title>
  <style>
    body {
      margin: 0;
      font-family: system-ui;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .hero {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  </style>
</head>
<body>
  <div class="hero">
    <h1>Welcome to the Future</h1>
  </div>
</body>
</html>`;

  const handleFileSelect = (index) => {
    setSelectedFile(index);
    onFileSelect(index);
  };
  
  const handleCoreClick = () => {
    setIsLiveMode(!isLiveMode);
  };

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden">
      {/* Matrix Rain Effect */}
      {isLiveMode && <MatrixRain />}
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        style={{
          background: chlorophyTheme.colors.gradients.hero,
        }}
      >
        <GalaxyScene 
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          isLiveMode={isLiveMode}
          onCoreClick={handleCoreClick}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 right-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl rounded-2xl p-4"
          style={{
            background: 'rgba(10, 14, 39, 0.8)',
            border: `1px solid ${chlorophyTheme.colors.primary}20`,
          }}
        >
          <h3 
            className="text-lg font-bold mb-2"
            style={{
              color: chlorophyTheme.colors.primary,
              fontFamily: chlorophyTheme.fonts.display,
            }}
          >
            🌌 Code Galaxy
          </h3>
          <p 
            className="text-sm"
            style={{
              color: '#ffffff80',
              fontFamily: chlorophyTheme.fonts.body,
            }}
          >
            {isLiveMode 
              ? '⚡ Live mode activated! Watch the code materialize in real-time.' 
              : 'Your project visualized in 3D space. Click the central core to activate live mode.'}
          </p>
        </motion.div>
      </div>

      {/* Live Code Stream */}
      <AnimatePresence>
        {isLiveMode && (
          <LiveCodeStream 
            isActive={isLiveMode} 
            code={sampleCode}
          />
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl rounded-full px-6 py-3 flex items-center gap-4"
          style={{
            background: 'rgba(10, 14, 39, 0.8)',
            border: `1px solid ${chlorophyTheme.colors.primary}20`,
          }}
        >
          <span className="text-xs" style={{ color: '#ffffff60' }}>
            🖱️ Drag to rotate
          </span>
          <span className="text-xs" style={{ color: '#ffffff60' }}>
            🔍 Scroll to zoom
          </span>
          <span className="text-xs" style={{ color: '#ffffff60' }}>
            ⭐ Click core to activate
          </span>
        </motion.div>
      </div>
    </div>
  );
}