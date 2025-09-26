import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { 
  TrophyIcon, 
  BrainIcon, 
  MessageCircleIcon, 
  HeartIcon,
  GamepadIcon,
  CalendarIcon,
  TargetIcon
} from 'lucide-react';

const Sanctuary = ({ setActiveSection }) => {
  const { profile, moodHistory, addMoodEntry, addXP } = useApp();
  const { toast } = useToast();

  const houseStanding = {
    rank: 2,
    total: 3,
    xp: 2847,
    progress: 68
  };

  const challenges = [
    {
      id: 'meditation',
      icon: '🧘‍♂️',
      title: 'Morning Meditation',
      desc: '5 minutes of mindfulness',
      xp: 50,
      completed: false
    },
    {
      id: 'gratitude',
      icon: '📓',
      title: 'Gratitude Journal',
      desc: "Write 3 things you're grateful for",
      xp: 30,
      completed: false
    },
    {
      id: 'exercise',
      icon: '🏃‍♀️',
      title: 'Physical Activity',
      desc: '20 minutes of movement',
      xp: 40,
      completed: false
    }
  ];

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😄', label: 'Excited', value: 'excited' }
  ];

  const achievements = [
    { icon: '🏅', label: 'Resilience Warrior', unlocked: true },
    { icon: '💎', label: 'Empathy Gem', unlocked: true },
    { icon: '🎯', label: 'Focus Master', unlocked: false },
    { icon: '📖', label: 'Wisdom Seeker', unlocked: true }
  ];

  const completeChallenge = (challenge) => {
    addXP(challenge.xp);
    toast({
      title: "Challenge Completed! 🎉",
      description: `You earned ${challenge.xp} XP for completing ${challenge.title}`,
    });
  };

  const logMood = (mood, emoji) => {
    addMoodEntry(mood, emoji);
    addXP(10);
    toast({
      title: "Mood Logged",
      description: "Thank you for sharing how you're feeling today! +10 XP",
    });
  };

  const getRecentMoods = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const entry = moodHistory.find(m => m.date === dateStr);
      last7Days.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        icon: entry?.icon || '⚪',
        mood: entry?.mood || 'unlogged'
      });
    }
    return last7Days;
  };

  const xpPercentage = Math.min(100, (profile.xp / profile.xpGoal) * 100);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-wellness bg-clip-text text-transparent">
          Your CampusCare Sanctuary
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Welcome back, {profile.name}! Your safe space for mental wellness and growth.
        </p>
        
        {/* XP Progress */}
        <Card className="max-w-md mx-auto glass">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="text-2xl font-bold text-primary">
                {profile.xp.toLocaleString()} / {profile.xpGoal.toLocaleString()} XP
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className="h-3 bg-gradient-wellness transition-all duration-1000 ease-out"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {Math.round(xpPercentage)}% towards your goal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* rest of your JSX remains the same... */}
    </div>
  );
};

export default Sanctuary;
