import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const scenarios = [
  { question: 'Someone cuts in line, you feel?', options: ['Angry', 'Happy', 'Relaxed'], answer: 'Angry' },
  { question: 'You got a compliment, you feel?', options: ['Sad', 'Pleased', 'Tired'], answer: 'Pleased' },
  { question: 'You missed deadline, you feel?', options: ['Panicked','Calm','Excited'], answer: 'Panicked' },
];

export const EmotionNavigator = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleClick = (option: string) => {
    if (option === scenarios[index].answer) setScore(score + 100);
    if (index + 1 < scenarios.length) setIndex(index + 1);
    else onComplete(score + 100);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="font-bold text-lg">{scenarios[index].question}</div>
      <div className="grid grid-cols-3 gap-2">
        {scenarios[index].options.map(opt => (
          <Button key={opt} onClick={() => handleClick(opt)}>{opt}</Button>
        ))}
      </div>
    </div>
  );
};
