import React, { useState, useEffect } from 'react';

export default function HoverImage({ images, alt, tiltStyle }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setCurrentIndex(0);
      return;
    }
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1000); // Cycle images every 1.0 seconds
      return () => clearInterval(interval);
    }
  }, [isHovered, images]);

  return (
    <div 
      className="w-full h-full flex items-center justify-center relative group/img"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={images?.[currentIndex] || 'https://via.placeholder.com/300'}
        alt={alt}
        className="max-h-[70%] max-w-[70%] object-contain transition-all duration-300 ease-out"
        style={tiltStyle}
      />
    </div>
  );
}
