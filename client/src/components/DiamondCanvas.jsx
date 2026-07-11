import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Diamond Geometry builder (Highly Faceted Brilliant Cut)
function DiamondGeometry() {
  const vertices = [];
  const indices = [];

  // Table Center (top-most middle)
  vertices.push(0, 0.8, 0); // index 0

  const segments = 16; // Increased segments for more facets to capture light reflection
  const rTable = 0.55;
  const rGirdle = 1.15;
  const yTable = 0.75;
  const yGirdle = 0.15;
  const yCulet = -1.15;

  // Table Ring (index 1 to 16)
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push(Math.cos(angle) * rTable, yTable, Math.sin(angle) * rTable);
  }

  // Girdle Ring (index 17 to 32)
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push(Math.cos(angle) * rGirdle, yGirdle, Math.sin(angle) * rGirdle);
  }

  // Culet (bottom point) (index 33)
  vertices.push(0, yCulet, 0);

  // 1. Table center fan
  for (let i = 0; i < segments; i++) {
    const next = ((i + 1) % segments) + 1;
    indices.push(0, i + 1, next);
  }

  // 2. Crown upper facets (Quads split into triangles)
  for (let i = 0; i < segments; i++) {
    const tCurrent = i + 1;
    const tNext = ((i + 1) % segments) + 1;
    const gCurrent = i + segments + 1;
    const gNext = ((i + 1) % segments) + segments + 1;

    indices.push(tCurrent, tNext, gCurrent);
    indices.push(tNext, gNext, gCurrent);
  }

  // 3. Pavilion facets (Girdle to bottom culet)
  const culetIndex = segments * 2 + 1;
  for (let i = 0; i < segments; i++) {
    const gCurrent = i + segments + 1;
    const gNext = ((i + 1) % segments) + segments + 1;
    indices.push(culetIndex, gNext, gCurrent);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

function DiamondMesh() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Automatic smooth rotation
      meshRef.current.rotation.y += 0.005;
      
      // Hardware-accelerated pointer responsiveness without triggering React state re-renders
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.35;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetY,
        0.05
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -targetX,
        0.05
      );
    }
  });

  const geom = DiamondGeometry();

  return (
    <mesh ref={meshRef} geometry={geom} scale={2.1}>
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.0}
        roughness={0.0}
        transmission={1.0} // Perfect glass clarity
        thickness={2.2} // Enhanced depth for refraction
        ior={2.417} // Refractive Index of real diamond
        reflectivity={1.0}
        clearcoat={1.0}
        clearcoatRoughness={0.0}
        side={THREE.DoubleSide}
        flatShading={true} // Crucial to render diamond facets sharply
      />
    </mesh>
  );
}

// Fallback Component: Animated SVG Diamond with shimmering gradients
function ShimmeringSVGDiamond() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/10 via-transparent to-brand-gold/10 rounded-full blur-2xl animate-pulse"></div>
      <svg
        className="w-56 h-56 text-brand-gold drop-shadow-[0_0_25px_rgba(197,155,39,0.4)] animate-bounce-slow"
        style={{ animationDuration: '6s' }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C59B27" />
            <stop offset="50%" stopColor="#FFF2D4" />
            <stop offset="100%" stopColor="#AE851D" />
          </linearGradient>
        </defs>
        <polygon points="6 3, 18 3, 22 9, 12 21, 2 9" fill="url(#diamondGrad)" fillOpacity="0.05" stroke="url(#diamondGrad)" />
        <line x1="6" y1="3" x2="8" y2="9" stroke="url(#diamondGrad)" />
        <line x1="18" y1="3" x2="16" y2="9" stroke="url(#diamondGrad)" />
        <line x1="12" y1="3" x2="12" y2="21" stroke="url(#diamondGrad)" />
        <line x1="2" y1="9" x2="22" y2="9" stroke="url(#diamondGrad)" />
        <line x1="8" y1="9" x2="12" y2="21" stroke="url(#diamondGrad)" />
        <line x1="16" y1="9" x2="12" y2="21" stroke="url(#diamondGrad)" />
        <line x1="8" y1="9" x2="12" y2="9" stroke="url(#diamondGrad)" />
        <line x1="16" y1="9" x2="12" y2="9" stroke="url(#diamondGrad)" />
        <line x1="6" y1="3" x2="12" y2="9" stroke="url(#diamondGrad)" />
        <line x1="18" y1="3" x2="12" y2="9" stroke="url(#diamondGrad)" />
      </svg>
    </div>
  );
}

// Error Boundary for ThreeJS
class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Three.js/R3F initialization failed, showing high-end fallback: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function DiamondCanvas() {
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setWebGlSupported(supported);
    } catch (e) {
      setWebGlSupported(false);
    }
  }, []);

  if (!webGlSupported) {
    return <ShimmeringSVGDiamond />;
  }

  return (
    <ThreeErrorBoundary fallback={<ShimmeringSVGDiamond />}>
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 5.5], fov: 40 }} gl={{ antialias: true, alpha: true }}>
          {/* Multiple High-Intensity Colorful Lights for Specular Diamond Flares */}
          <ambientLight intensity={0.6} />
          
          <pointLight position={[6, 6, 6]} intensity={3.5} color="#ffffff" />
          <pointLight position={[-6, -6, -6]} intensity={1.5} color="#ffd875" /> {/* Gold Specular reflections */}
          <pointLight position={[0, 8, -2]} intensity={2.5} color="#85d7ff" />  {/* Blue-ish Specular refraction */}
          <directionalLight position={[0, 10, 5]} intensity={2.0} color="#ffffff" />

          {/* Environmental reflections maps for real refraction shine */}
          <Environment preset="studio" />

          <DiamondMesh />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>
    </ThreeErrorBoundary>
  );
}
