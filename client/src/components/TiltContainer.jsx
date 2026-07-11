import React, { useRef, useState } from 'react';

export default function TiltContainer({ children, className = '', maxRotation = 12 }) {
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates to range [-1, 1]
    const normalizedX = x / (rect.width / 2);
    const normalizedY = y / (rect.height / 2);

    // Set tilt angles
    setCoords({
      x: normalizedX * maxRotation,
      y: -normalizedY * maxRotation // negative because moving mouse down tilts card down
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const style = {
    transform: isHovered 
      ? `perspective(1000px) rotateX(${coords.y}deg) rotateY(${coords.x}deg) scale3d(1.02, 1.02, 1.02)`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovered ? 'transform 0.05s linear' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    transformStyle: 'preserve-3d',
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
}
