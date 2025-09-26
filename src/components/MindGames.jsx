import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { PlayIcon, TrophyIcon, ZapIcon, XIcon } from 'lucide-react';

// Import all functional games
import { MemoryPalace } from '@/components/games/MemoryPalace';
import { EmotionNavigator } from '@/components/games/EmotionNavigator';
import { StressBuster } from '@/components/games/StressBuster';
import { FocusFlow } from '@/components/games/FocusFlow';
import AnxietyEase from '@/components/games/AnxietyEase';

const games = [
  { id: 'memory-palace', title: 'Memory Palace', desc: 'Strengthen your memory and focus through spatial visualization techniques.', xpReward: 75, color: 'from-purple-400 to-purple-600', difficulty: 'Medium', duration: '5-10 min' },
  { id: 'zen-garden', title: 'Zen Garden', desc: 'Practice mindfulness through peaceful pattern-matching and meditation.', xpReward: 50, color: 'from-teal-400 to-teal-600', difficulty: 'Easy', duration: '3-5 min' },
  { id: 'emotion-navigator', title: 'Emotion Navigator', desc: 'Learn to identify and manage emotions through interactive scenarios.', xpReward: 100, color: 'from-amber-400 to-amber-600', difficulty: 'Hard', duration: '10-15 min' },
  { id: 'stress-buster', title: 'Stress Buster', desc: 'Quick mini-games to release tension and boost your mood instantly.', xpReward: 25, color: 'from-pink-400 to-pink-600', difficulty: 'Easy', duration: '2-3 min' },
  { id: 'focus-flow', title: 'Focus Flow', desc: 'Enhance concentration through rhythmic breathing and visual exercises.', xpReward: 60, color: 'from-blue-400 to-blue-600', difficulty: 'Medium', duration: '5-8 min' },
  { id: 'anxiety-ease', title: 'Anxiety Ease', desc: 'Gentle exercises designed to reduce anxiety and promote calm.', xpReward: 80, color: 'from-green-400 to-green-600', difficulty: 'Easy', duration: '5-10 min' }
];

const MindGames = () => {
  const [playing, setPlaying] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [gameResults, setGameResults] = useState({});
  const { gameProgress, updateGameProgress, addXP } = useApp();
  const { toast } = useToast();

  const handleGameComplete = (gameId, score) => {
    const game = games.find(g => g.id === gameId);
    updateGameProgress(gameId, score);
    addXP(game.xpReward);
    setGameResults(prev => ({ ...prev, [gameId]: score }));
    toast({
      title: `${game.title} Completed! 🎮`,
      description: `Score: ${score.toLocaleString()} | +${game.xpReward} XP earned`,
    });
    setPlaying(null);
    setActiveGame(null);
  };

  const playGame = (gameId) => {
    setPlaying(gameId);
    switch (gameId) {
      case 'memory-palace':
        setActiveGame(<MemoryPalace onComplete={(score) => handleGameComplete(gameId, score)} />);
        break;
      case 'zen-garden':
        setActiveGame(<ZenGarden onComplete={(score) => handleGameComplete(gameId, score)} />);
        break;
      case 'emotion-navigator':
        setActiveGame(<EmotionNavigator onComplete={(score) => handleGameComplete(gameId, score)} />);
        break;
      case 'stress-buster':
        setActiveGame(<StressBuster onComplete={(score) => handleGameComplete(gameId, score)} />);
        break;
      case 'focus-flow':
        setActiveGame(<FocusFlow onComplete={(score) => handleGameComplete(gameId, score)} />);
        break;
      case 'anxiety-ease':
        setActiveGame(<AnxietyEase onComplete={(score) => handleGameComplete(gameId, score)} />);
        break;
      default:
        setActiveGame(null);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-purple-pink bg-clip-text text-transparent">Mind Games</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Boost your cognitive wellness through engaging brain training games designed for mental health.
        </p>
      </div>

      {/* Active Game */}
      {activeGame && (
        <Card className="glass mb-6 p-4 relative">
          <Button onClick={() => setActiveGame(null)} className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white">
            <XIcon className="w-4 h-4"/>
          </Button>
          {activeGame}
        </Card>
      )}

      {/* Games Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => {
          const progress = gameProgress[game.id];
          const isPlaying = playing === game.id;
          const lastScore = gameResults[game.id];

          return (
            <Card key={game.id} className={`relative glass hover:shadow-xl transition-all duration-300 group overflow-hidden ${isPlaying ? 'animate-pulse-glow' : 'hover:scale-105'}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{game.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                      <Badge variant="outline">{game.duration}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary">+{game.xpReward} XP</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{game.desc}</p>

                {progress && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1"><TrophyIcon className="w-4 h-4 text-yellow-500" /> Best: {progress.highScore.toLocaleString()}</span>
                      <span>Played {progress.timesPlayed} times</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs"><span>Mastery Progress</span><span>{progress.progress}%</span></div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${game.color} transition-all duration-1000 ease-out`} style={{ width: `${progress.progress}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {lastScore > 0 && !isPlaying && (
                  <div className="p-3 rounded-lg bg-gradient-success text-white text-center animate-float">
                    <div className="text-sm font-medium">Latest Score</div>
                    <div className="text-xl font-bold">{lastScore.toLocaleString()}</div>
                  </div>
                )}

                <Button onClick={() => !isPlaying && playGame(game.id)} disabled={isPlaying} className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white font-medium transition-all`}>
                  {isPlaying ? (
                    <>
                      <ZapIcon className="w-4 h-4 mr-2 animate-spin" /> Playing...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-4 h-4 mr-2" /> Play Game
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MindGames;
