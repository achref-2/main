import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from "../components/DarkModeProvider";
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const { isDarkMode } = useDarkMode();
  const [animationStep, setAnimationStep] = useState(0);
  
  // Animate the elements sequentially
  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationStep < 3) {
        setAnimationStep(prev => prev + 1);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [animationStep]);
  
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-4 ${
        isDarkMode ? 'bg-zinc-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="max-w-md w-full space-y-8 text-center">
        {/* SVG Illustration */}
        <div className="w-full flex justify-center mb-6">
          <svg viewBox="0 0 500 200" className="w-64 h-64">
            <g transform="translate(0,-20)">
              {/* "404" Text */}
              <text 
                x="250" 
                y="120" 
                textAnchor="middle" 
                className={`text-9xl font-extrabold ${isDarkMode ? 'fill-blue-400' : 'fill-blue-500'}`} 
                style={{
                  opacity: animationStep >= 0 ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              >
                404
              </text>
              
              {/* Eyes */}
              <circle 
                cx="220" 
                cy="80" 
                r="10" 
                className={isDarkMode ? 'fill-gray-200' : 'fill-gray-800'}
                style={{
                  opacity: animationStep >= 1 ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              />
              <circle 
                cx="280" 
                cy="80" 
                r="10" 
                className={isDarkMode ? 'fill-gray-200' : 'fill-gray-800'}
                style={{
                  opacity: animationStep >= 1 ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              />
              
              {/* Sad mouth */}
              <path 
                d="M 210,130 Q 250,110 290,130" 
                fill="none" 
                strokeWidth="6" 
                className={isDarkMode ? 'stroke-gray-200' : 'stroke-gray-800'}
                style={{
                  opacity: animationStep >= 2 ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              />
            </g>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
        
        <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            to="/"
            className={`flex items-center justify-center px-5 py-3 rounded-lg font-medium transition-all ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Home className="mr-2 w-5 h-5" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className={`flex items-center justify-center px-5 py-3 rounded-lg font-medium transition-all ${
              isDarkMode
                ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
      
      <div className={`mt-16 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Need help? <a href="/contact" className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} hover:underline`}>Contact Support</a>
      </div>
    </div>
  );
};

export default NotFoundPage;