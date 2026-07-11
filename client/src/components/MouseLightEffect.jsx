import React, { useEffect, useState } from 'react';

export default function MouseLightEffect() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // get coordinates relative to current window
      setCoords({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, rgba(197, 155, 39, 0.04), transparent 80%)`,
      }}
    />
  );
}
