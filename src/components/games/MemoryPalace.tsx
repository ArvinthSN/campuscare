import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const cards = ['🍎','🍌','🍇','🍊','🍉','🍎','🍌','🍇','🍊','🍉'];

export const MemoryPalace = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  useEffect(() => {
    setShuffled(cards.sort(() => Math.random() - 0.5));
  }, []);

  const handleFlip = (index: number) => {
    if (flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (shuffled[first] === shuffled[second]) {
        setMatched([...matched, first, second]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  useEffect(() => {
    if (matched.length === cards.length) {
      onComplete(1000); // Score
    }
  }, [matched]);

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {shuffled.map((c, i) => (
        <div
          key={i}
          className={`h-16 w-16 flex items-center justify-center rounded-lg text-2xl cursor-pointer border ${
            flipped.includes(i) || matched.includes(i) ? 'bg-green-200' : 'bg-gray-200'
          }`}
          onClick={() => handleFlip(i)}
        >
          {(flipped.includes(i) || matched.includes(i)) ? c : '?'}
        </div>
      ))}
    </div>
  );
};
