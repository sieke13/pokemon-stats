import React from 'react';

export const UKFlag = () => (
  <svg width="24" height="24" viewBox="0 0 60 30">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#s)" stroke="#C8102E" strokeWidth="4"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

export const SpainFlag = () => (
  <svg width="24" height="24" viewBox="0 0 750 500">
    <rect width="750" height="500" fill="#c60b1e"/>
    <rect width="750" height="250" y="125" fill="#ffc400"/>
  </svg>
);

export const IndiaFlag = () => (
  <svg width="24" height="24" viewBox="0 0 900 600">
    <rect width="900" height="200" fill="#ff9933"/>
    <rect width="900" height="200" y="200" fill="#fff"/>
    <rect width="900" height="200" y="400" fill="#138808"/>
    <circle cx="450" cy="300" r="60" fill="#000080"/>
    <circle cx="450" cy="300" r="55" fill="#fff"/>
    <circle cx="450" cy="300" r="16.5" fill="#000080"/>
    <g transform="rotate(15, 450, 300)">
      {[...Array(24)].map((_, i) => (
        <line key={i} x1="450" y1="245" x2="450" y2="255"
          transform={`rotate(${i * 15}, 450, 300)`}
          stroke="#000080" strokeWidth="1"/>
      ))}
    </g>
  </svg>
);