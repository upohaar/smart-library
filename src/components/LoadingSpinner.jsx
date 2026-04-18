import React from 'react';

// Centered animated spinner shown while API data is loading
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin dark:border-blue-800 dark:border-t-blue-400" />
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
