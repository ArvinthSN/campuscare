import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle,
  Users,
  Heart,
  Brain,
  GamepadIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDPIS } from '@/hooks/useDPIS';

const Dashboard = ({ setActiveSection }) => {
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

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      excellent: '😊',
      good: '🙂',
      okay: '😐',
      struggling: '😔',
      difficult: '😞'
    };
    return moodEmojis[mood] || '😐';
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
      color: 'bg-indigo-500',
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className={`cursor-pointer hover:shadow-lg transition ${action.color}`}
              onClick={action.action}
            >
              <CardHeader className="flex flex-row items-center space-x-4">
                {action.icon}
                <CardTitle>{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly Mood Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Weekly Mood Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {weeklyMoods.map((mood, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-2xl">{getMoodEmoji(mood)}</span>
                  <span className="text-sm capitalize">{mood}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Challenges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            {activeChallenges.length > 0 ? (
              <ul className="list-disc list-inside">
                {activeChallenges.map((ch, idx) => (
                  <li key={idx}>{ch}</li>
                ))}
              </ul>
            ) : (
              <p>No active challenges right now.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Chats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Chats</CardTitle>
          </CardHeader>
          <CardContent>
            {recentChats.length > 0 ? (
              <ul className="space-y-2">
                {recentChats.map((chat, idx) => (
                  <li key={idx} className="text-sm">
                    {chat.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent chats.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Games */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Games</CardTitle>
          </CardHeader>
          <CardContent>
            {recentGames.length > 0 ? (
              <ul className="space-y-2">
                {recentGames.map((game, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{game.name}</span>
                    <Badge>{game.score}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No games played recently.</p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
