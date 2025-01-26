// src/components/SyringeProgress.jsx
import React from 'react';

const SyringeProgress = () => {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-4">
      <div className="h-12 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: '50%' }}
        />
      </div>
      <p className="text-center mt-2">Progress: 50%</p>
    </div>
  );
};

export default SyringeProgress;