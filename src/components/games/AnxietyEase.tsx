import React, { useEffect, useState } from 'react';

export const AnxietyEase = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
      if (count >= 8) { onComplete(100); clearInterval(interval); }
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-24 h-24 bg-blue-300 rounded-full animate-pulse"></div>
      <div className="text-lg">Follow the breathing rhythm...</div>
    </div>
  );
};
