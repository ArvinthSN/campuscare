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

interface SanctuaryProps {
  setActiveSection: (section: string) => void;
}

const Sanctuary = ({ setActiveSection }: SanctuaryProps) => {
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

  const completeChallenge = (challenge: typeof challenges[0]) => {
    addXP(challenge.xp);
    toast({
      title: "Challenge Completed! 🎉",
      description: `You earned ${challenge.xp} XP for completing ${challenge.title}`,
    });
  };

  const logMood = (mood: string, emoji: string) => {
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* House Standing */}
        <Card className="glass hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <TrophyIcon className="w-5 h-5 text-primary mr-2" />
            <CardTitle className="text-lg">House {profile.house} Standing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold bg-gradient-teal-blue bg-clip-text text-transparent">
                  {houseStanding.rank}
                </span>
                <span className="text-muted-foreground">of {houseStanding.total} Houses</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-teal-blue transition-all duration-1000"
                  style={{ width: `${houseStanding.progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {houseStanding.xp} XP this week
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TargetIcon className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => setActiveSection('games')}
                className="bg-gradient-purple-pink text-white hover:opacity-90 transition-opacity"
                size="sm"
              >
                <GamepadIcon className="w-4 h-4 mr-1" />
                Games
              </Button>
              <Button 
                onClick={() => setActiveSection('oracle')}
                className="bg-gradient-teal-blue text-white hover:opacity-90 transition-opacity"
                size="sm"
              >
                <MessageCircleIcon className="w-4 h-4 mr-1" />
                Oracle
              </Button>
              <Button 
                onClick={() => setActiveSection('profile')}
                className="bg-gradient-warm text-white hover:opacity-90 transition-opacity"
                size="sm"
              >
                <HeartIcon className="w-4 h-4 mr-1" />
                Profile
              </Button>
              <Button 
                variant="outline"
                className="hover:bg-gradient-success hover:text-white transition-all"
                size="sm"
              >
                <BrainIcon className="w-4 h-4 mr-1" />
                Focus
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="glass hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{profile.dayStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{profile.badges}</div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Challenges */}
      <Card className="glass hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-xl">Today's Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {challenges.map((challenge) => (
              <div 
                key={challenge.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 hover:shadow-md transition-all"
              >
                <span className="text-2xl">{challenge.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium">{challenge.title}</h4>
                  <p className="text-sm text-muted-foreground">{challenge.desc}</p>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    +{challenge.xp} XP
                  </Badge>
                  <Button 
                    size="sm"
                    onClick={() => completeChallenge(challenge)}
                    className="bg-gradient-success text-white hover:opacity-90"
                  >
                    Complete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mood Tracker */}
      <Card className="glass hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-xl">Mood Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Weekly Overview */}
            <div>
              <h4 className="font-medium mb-3">This Week</h4>
              <div className="flex justify-between">
                {getRecentMoods().map((day, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-primary/10 transition-colors"
                  >
                    <div className="text-2xl">{day.icon}</div>
                    <span className="text-xs font-medium">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Log Today's Mood */}
            <div>
              <h4 className="font-medium mb-3">How are you feeling today?</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {moods.map((mood) => (
                  <Button
                    key={mood.value}
                    variant="outline"
                    onClick={() => logMood(mood.value, mood.emoji)}
                    className="h-16 flex flex-col gap-1 hover:bg-gradient-wellness hover:text-white transition-all"
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="glass hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-xl">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:shadow-md'
                    : 'bg-muted/20 border-muted/40 opacity-60'
                }`}
              >
                <div className="text-3xl">{achievement.icon}</div>
                <span className="text-xs font-medium text-center">{achievement.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sanctuary;