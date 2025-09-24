import React, { useState, useEffect } from 'react';

export const FocusFlow = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => onComplete(score), 8000);
    const move = setInterval(() => {
      setPosition({ x: Math.random() * 90, y: Math.random() * 90 });
    }, 1000);
    return () => { clearInterval(timer); clearInterval(move); };
  }, [score]);

  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      <div
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
        className="absolute w-8 h-8 bg-blue-500 rounded-full cursor-pointer transition-all"
        onClick={() => setScore(score + 10)}
      />
      <div className="absolute bottom-2 left-2 text-sm font-bold">Score: {score}</div>
    </div>
  );
};
