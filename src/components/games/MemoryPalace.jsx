import React, { useState, useEffect } from "react";
 // we'll add CSS for flip animation

const cards = ["🍎", "🍌", "🍇", "🍊", "🍉", "🍎", "🍌", "🍇", "🍊", "🍉"];

export const MemoryPalace = ({ onComplete }) => {
  const [shuffled, setShuffled] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);

  // Shuffle cards on mount
  useEffect(() => {
    setShuffled([...cards].sort(() => Math.random() - 0.5));
  }, []);

  const handleFlip = (index) => {
    if (flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);

      const [first, second] = newFlipped;
      if (shuffled[first] === shuffled[second]) {
        setMatched((m) => [...m, first, second]);
        setScore((s) => s + 100); // reward for match
      } else {
        setScore((s) => Math.max(0, s - 20)); // penalty
      }

      setTimeout(() => setFlipped([]), 1000);
    }
  };

  // Game completion
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      onComplete(score);
    }
  }, [matched, score, onComplete]);

  return (
    <div className="memory-palace">
      {/* Score & Moves */}
      <div className="stats">
        <span className="score">🎯 Score: {score}</span>
        <span className="moves">🌀 Moves: {moves}</span>
      </div>

      {/* Game Board */}
      <div className="board">
        {shuffled.map((c, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <div
              key={i}
              className={`card ${isFlipped ? "flipped" : ""}`}
              onClick={() => handleFlip(i)}
            >
              <div className="card-inner">
                {/* Back of card */}
                <div className="card-back">❓</div>
                {/* Front of card */}
                <div className="card-front">{c}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* End Game Overlay */}
      {matched.length === cards.length && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>🎉 You Win!</h2>
            <p>Final Score: {score}</p>
            <p>Moves Taken: {moves}</p>
          </div>
        </div>
      )}
    </div>
  );
};
