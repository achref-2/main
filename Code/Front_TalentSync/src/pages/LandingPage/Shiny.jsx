import React from "react";

export const ShinyText = ({ text, disabled = false, speed = 3, className = '' }) => {
  return (
    <span
      className={`relative inline-block bg-clip-text text-transparent 
                 ${disabled ? 'text-gray-400' : 'animate-shine'} 
                 ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '1100% 100%',
        WebkitBackgroundClip: 'text',
        animation: disabled ? 'none' : `shine ${speed}s linear infinite`,
      }}
    >
      {text}
    </span>
  );
};
