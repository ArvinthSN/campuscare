import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  MessageCircle,
  Users,
  Heart,
  Brain,
  Zap,
  GamepadIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDPIS } from '@/hooks/useDPIS';

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveSection }) => {
  const { 
    user, 
    getActiveChallenges, 
    getWeeklyMoodTrend, 
    getTodaysMoods,
    chatHistory,
    gameHistory 
  } = useDPIS();

  const activeChallenges = getActiveChallenges();
  const weeklyMoods = getWeeklyMoodTrend();
  const todaysMoods = getTodaysMoods();
  const recentChats = chatHistory.slice(-5);
  const recentGames = gameHistory.slice(0, 3);

  const welcomeMessages = [
    "Welcome back! Ready to continue your wellness journey?",
    "Great to see you again! How are you feeling today?",
    "Your mental health matters. Let's check in!",
    "Ready to grow and thrive today?"
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis = {
      excellent: '😊',
      good: '🙂',
      okay: '😐',
      struggling: '😔',
      difficult: '😞'
    };
    return moodEmojis[mood as keyof typeof moodEmojis] || '😐';
  };

  const quickActions = [
    {
      title: 'Check In',
      description: 'Log your current mood',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-wellness-calm',
      action: () => setActiveSection('mood-check')
    },
    {
      title: 'AI Support',
      description: 'Chat with our AI companion',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-primary',
      action: () => setActiveSection('chatbot')
    },
    {
      title: 'Mind Games',
      description: 'Play games for a healthy mind',
      icon: <GamepadIcon className="w-6 h-6" />,
      color: 'bg-indigo-500', // A new, fitting color for games
      action: () => setActiveSection('games')
    },
    {
      title: 'Mindful Moment',
      description: 'Quick breathing exercise',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-wellness-focus',
      action: () => setActiveSection('resources')
    },
    {
      title: 'Community',
      description: 'Connect with peers',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-wellness-balance',
      action: () => setActiveSection('community')
    }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-calm pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Good {getTimeOfDay()}, {user.nickname}! ✨
          </h1>
          <p className="text-lg text-muted-foreground">
            {welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="dpis-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold text-primary">{user.xp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="dpis-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-game-gold/20 p-3 rounded-full">
                    <Award className="w-6 h-6 text-game-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-2xl font-bold text-game-gold">{user.level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="dpis-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-status-success/20 p-3 rounded-full">
                    <Calendar className="w-6 h-6 text-status-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-2xl font-bold text-status-success">{user.loginStreak} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="dpis-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className={`bg-house-${user.house}/20 p-3 rounded-full`}>
                    <Target className={`w-6 h-6 text-house-${user.house}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">House</p>
                    <p className={`text-2xl font-bold text-house-${user.house} capitalize`}>
                      {user.house}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="dpis-card hover-lift cursor-pointer"
                  onClick={action.action}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`${action.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-white`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Challenges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="dpis-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Today's Challenges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeChallenges.length > 0 ? (
                  <div className="space-y-4">
                    {activeChallenges.slice(0, 3).map((challenge) => (
                      <div key={challenge.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{challenge.title}</h4>
                          <Badge variant="secondary">
                            {challenge.xpReward} XP
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{challenge.description}</p>
                        <Progress 
                          value={(challenge.progress / challenge.requirements.target) * 100} 
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {challenge.progress}/{challenge.requirements.target}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    All challenges completed! 🎉
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Mood Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="dpis-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-wellness-calm" />
                  <span>Mood Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysMoods.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {getMoodEmoji(todaysMoods[0].mood)}
                      </div>
                      <p className="font-medium capitalize">{todaysMoods[0].mood}</p>
                      <p className="text-sm text-muted-foreground">Today's mood</p>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">This week</p>
                      <div className="flex justify-between">
                        {weeklyMoods.slice(-7).map((mood, index) => (
                          <div key={index} className="text-center">
                            <div className="text-lg">{getMoodEmoji(mood.mood)}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(mood.date).toLocaleDateString('en', { weekday: 'short' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Heart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground mb-3">How are you feeling today?</p>
                    <Button 
                      onClick={() => setActiveSection('mood-check')}
                      className="bg-wellness-calm text-white"
                    >
                      Log Mood
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="dpis-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentChats.length > 0 && (
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">AI Support conversation</span>
                    </div>
                  )}
                  
                  {recentGames.length > 0 && recentGames.map((game, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                      <Brain className="w-4 h-4 text-wellness-focus" />
                      <div className="flex-1">
                        <span className="text-sm capitalize">{game.gameType} game</span>
                        <p className="text-xs text-muted-foreground">+{game.xpEarned} XP</p>
                      </div>
                    </div>
                  ))}
                  
                  {weeklyMoods.length > 0 && (
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                      <Heart className="w-4 h-4 text-wellness-calm" />
                      <span className="text-sm">Mood tracking</span>
                    </div>
                  )}
                  
                  {recentChats.length === 0 && recentGames.length === 0 && weeklyMoods.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground text-sm">No recent activity</p>
                      <p className="text-muted-foreground text-xs">Start your wellness journey!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;