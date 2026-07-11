import React from 'react';

export default function Logo({ className = "h-8 w-auto", ...props }) {
  return (
    <svg 
      viewBox="0 0 100 48" 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Upper Lid: Ultra-fine elegant curve */}
      <path 
        d="M 8,24 C 24,6 76,6 92,24" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
      />
      {/* Lower Lid: Ultra-fine elegant curve */}
      <path 
        d="M 8,24 C 24,42 76,42 92,24" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
      />
      
      {/* Swirling Iris: Sleek mathematical spiral around the diamond */}
      <path 
        d="M 33,26 C 33,16 41.5,11 51,11 C 62,11 71,18 71,28 C 71,37 64,43 55,43 C 46,43 40.5,36 41,28 C 41.5,22 47,17 53.5,17 C 58.5,17.5 61,21.5 61,25" 
        strokeWidth="1.6" 
        strokeLinecap="round" 
      />

      {/* Central Fine-Jewelry Diamond: High-end wireframe illustration */}
      <g strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round">
        {/* Table & Crown Facets */}
        <path d="M 45,19 L 55,19 L 58,22 L 42,22 Z" />
        <path d="M 45,19 L 42,22 L 39,25 L 45,25 L 50,22 L 55,25 L 61,25 L 58,22 L 55,19" />
        <path d="M 45,19 L 50,22 L 55,19" />
        
        {/* Pavilion Facets connecting to Culet */}
        <path d="M 39,25 L 45,25 L 50,35 L 55,25 L 61,25" />
        <path d="M 39,25 L 50,35 L 61,25" />
        <path d="M 50,22 L 50,35" />
      </g>
    </svg>
  );
}
