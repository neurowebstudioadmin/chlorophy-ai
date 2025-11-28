import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Trail } from '@react-three/drei';
import { motion } from 'framer-motion';
import { chlorophyTheme } from '../../styles/chlorophy-theme';
import * as THREE from 'three';

// File Planet Component
function FilePlanet({ position, color, label, size, onClick, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate planet
      meshRef.current.rotation.y += 0.01;
      
      // Pulse effect when selected
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
      {/* Planet Sphere */}
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

      {/* Orbiting Ring */}
      {(hovered || isSelected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.02, 16, 100]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}

      {/* Label */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.3}
        color={hovered || isSelected ? color : '#ffffff80'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {label}
      </Text>

      {/* Glow effect */}
      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={hovered || isSelected ? 2 : 1}
        distance={5}
      />
    </group>
  );
}

// Connection Lines between files
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

// Main Galaxy Scene
function GalaxyScene({ onFileSelect, selectedFile }) {
  const files = [
    { 
      name: 'index.html', 
      position: [0, 0, 0], 
      color: '#E34C26', 
      size: 1.5,
      label: 'HTML',
    },
    { 
      name: 'style.css', 
      position: [-4, 2, -2], 
      color: '#264DE4', 
      size: 1.2,
      label: 'CSS',
    },
    { 
      name: 'script.js', 
      position: [4, -2, 2], 
      color: '#F7DF1E', 
      size: 1.2,
      label: 'JS',
    },
  ];

  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />
      
      {/* Main Light */}
      <pointLight position={[10, 10, 10]} intensity={1} />

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

      {/* Connection Lines */}
      <ConnectionLine 
        start={files[0].position} 
        end={files[1].position} 
        color={chlorophyTheme.colors.primary} 
      />
      <ConnectionLine 
        start={files[0].position} 
        end={files[2].position} 
        color={chlorophyTheme.colors.primary} 
      />

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

      {/* Camera Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function GalaxyView({ onFileSelect, projectFiles }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRotating, setIsRotating] = useState(true);

  const handleFileSelect = (index) => {
    setSelectedFile(index);
    onFileSelect(index);
  };

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden">
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
            Your project visualized in 3D space. Click planets to view files.
          </p>
        </motion.div>
      </div>

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
            👆 Click planets to select
          </span>
        </motion.div>
      </div>

      {/* Auto-rotate toggle */}
      <div className="absolute top-4 right-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRotating(!isRotating)}
          className="backdrop-blur-xl rounded-full p-3"
          style={{
            background: isRotating 
              ? `${chlorophyTheme.colors.primary}30`
              : 'rgba(10, 14, 39, 0.8)',
            border: `1px solid ${chlorophyTheme.colors.primary}40`,
          }}
        >
          <span className="text-xl">
            {isRotating ? '⏸️' : '▶️'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}