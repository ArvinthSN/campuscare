import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

const scenarios = [
  {
    question: "Someone cuts in line, you feel?",
    options: ["Angry", "Happy", "Relaxed"],
    answer: "Angry",
  },
  {
    question: "You got a compliment, you feel?",
    options: ["Sad", "Pleased", "Tired"],
    answer: "Pleased",
  },
  {
    question: "You missed deadline, you feel?",
    options: ["Panicked", "Calm", "Excited"],
    answer: "Panicked",
  },
];

export const EmotionNavigator = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showFeedback, setShowFeedback] = useState(null);

  const handleClick = (option) => {
    const correct = option === scenarios[index].answer;
    if (correct) {
      setScore((s) => s + 100);
      setShowFeedback("correct");
    } else {
      setLives((l) => l - 1);
      setShowFeedback("wrong");
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (index + 1 < scenarios.length && lives > 1) {
        setIndex(index + 1);
      } else {
        onComplete(correct ? score + 100 : score);
      }
    }, 1200);
  };

  return (
    <div className="relative p-6 w-full max-w-xl mx-auto bg-background rounded-xl shadow-lg">
      {/* Score & Lives */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2 text-primary font-semibold">
          <Star className="w-5 h-5 text-yellow-500" />
          <span>{score}</span>
        </div>
        <div className="flex space-x-1">
          {Array.from({ length: lives }).map((_, i) => (
            <Heart key={i} className="w-5 h-5 text-red-500" fill="red" />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center">
          {scenarios[index].question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {scenarios[index].options.map((opt) => (
            <div key={opt}>
              <Button
                variant="outline"
                onClick={() => handleClick(opt)}
                className="w-full py-6 text-lg font-semibold hover-lift"
              >
                {opt}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback overlay */}
      {showFeedback && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${
            showFeedback === "correct" ? "text-green-500" : "text-red-500"
          }`}
        >
          {showFeedback === "correct" ? "✅ Correct!" : "❌ Wrong!"}
        </div>
      )}
    </div>
  );
};
