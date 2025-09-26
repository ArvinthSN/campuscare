import React, { useState, useEffect } from "react";

export const FocusFlow = ({ onComplete }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState([]);

  // Timer & movement
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(score);
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    const mover = setInterval(() => {
      setPosition({ x: Math.random() * 85, y: Math.random() * 85 });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(mover);
    };
  }, [timeLeft, score, onComplete]);

  const handleHit = (e) => {
    const newScore = score + 10 + combo * 5;
    setScore(newScore);
    setCombo((c) => c + 1);

    // particle burst
    const rect = e.target.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: cx,
      y: cy,
    }));
    setParticles((p) => [...p, ...newParticles]);

    setTimeout(() => setCombo(0), 2000);

    // clear particles
    setTimeout(() => {
      setParticles((p) => p.slice(newParticles.length));
    }, 800);
  };

  return (
    <div className="relative w-full h-72 bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-xl overflow-hidden shadow-xl flex items-center justify-center">
      {/* Timer Bar */}
      <div
        className="absolute top-0 left-0 h-2 bg-blue-500 transition-all"
        style={{ width: `${(timeLeft / 15) * 100}%` }}
      />

      {/* Score & Combo */}
      <div className="absolute top-2 right-4 flex flex-col items-end text-sm font-bold">
        <span className="text-blue-600">Score: {score}</span>
        {combo > 1 && (
          <span className="text-yellow-500 animate-pulse">🔥 Combo x{combo}</span>
        )}
      </div>

      {/* Target */}
      <div
        onClick={handleHit}
        className="absolute w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-all duration-500"
        style={{
          top: `${position.y}%`,
          left: `${position.x}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-6 h-6 bg-white/70 rounded-full animate-ping" />
      </div>

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none"
          style={{
            top: `${p.y}px`,
            left: `${p.x}px`,
            animation: `particle 0.8s forwards`,
          }}
        />
      ))}

      {/* Time Left */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-700 font-medium">
        ⏳ {timeLeft}s
      </div>

      {/* Particle animation */}
      <style>{`
        @keyframes particle {
          from { transform: translate(0,0); opacity: 1; }
          to { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
