import { useState, useEffect } from 'react';

export default function LoadingAnimation() {
  const [dots, setDots] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => prevDots < 3 ? prevDots + 1 : 1);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <div className="mb-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Your Application</h3>
          <p className="text-gray-600">
            {dots === 1 && "Submiting your application ."}
            {dots === 2 && "Submiting your application .."}
            {dots === 3 && "Submiting your application ..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    </div>
  );
}