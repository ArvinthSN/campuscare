import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const StressBuster = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15s game
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [combo, setCombo] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, onComplete]);

  // Button random movement every second
  useEffect(() => {
    const move = setInterval(() => {
      setPos({ x: Math.random() * 80, y: Math.random() * 80 });
    }, 1000);
    return () => clearInterval(move);
  }, []);

  const handleClick = () => {
    setScore((s) => s + 10 + combo * 2); // combo bonus
    setCombo((c) => c + 1);
    setActive(true);
    setTimeout(() => setActive(false), 200);

    // reset combo if no click in 1s
    setTimeout(() => setCombo(0), 1000);
  };

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden p-4 flex flex-col items-center">
      {/* Score + Timer */}
      <div className="flex justify-between w-full max-w-md mb-4 text-lg font-bold">
        <span className="text-blue-600">⚡ Score: {score}</span>
        <span className="text-red-600">⏳ {timeLeft}s</span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-3 bg-green-500"
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / 15) * 100}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </div>

      {/* Combo Indicator */}
      {combo > 1 && (
        <motion.div
          key={combo}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.2 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 text-2xl font-bold text-yellow-500"
        >
          🔥 Combo x{combo}!
        </motion.div>
      )}

      {/* Moving Button */}
      <motion.button
        style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
        className={`absolute px-6 py-3 rounded-full text-white font-bold shadow-lg ${
          active ? "bg-red-500 scale-110" : "bg-blue-600"
        }`}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
      >
        Tap Me!
      </motion.button>

      {/* End Game Screen */}
      <AnimatePresence>
        {timeLeft <= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-xl text-center shadow-2xl">
              <h2 className="text-2xl font-bold text-green-600">🎉 Time’s Up!</h2>
              <p className="mt-2 text-gray-700">Final Score: {score}</p>
              <button
                onClick={() => {
                  setScore(0);
                  setTimeLeft(15);
                  setCombo(0);
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
              >
                🔄 Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
