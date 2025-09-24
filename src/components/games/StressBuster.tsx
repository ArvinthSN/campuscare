import React, { useState, useEffect } from 'react';

export const StressBuster = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => onComplete(score), 5000);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <button
        className={`px-4 py-2 rounded-lg text-white font-bold ${active ? 'bg-red-500' : 'bg-blue-500'}`}
        onClick={() => setScore(score + 1)}
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
      >
        Click Me!
      </button>
      <div>Score: {score}</div>
    </div>
  );
};
