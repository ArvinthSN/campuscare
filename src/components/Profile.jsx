import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { 
  TrophyIcon, 
  ZapIcon, 
  CalendarIcon, 
  AwardIcon,
  EditIcon,
  SaveIcon,
  MoonIcon,
  SunIcon
} from 'lucide-react';

const Profile = () => {
  const { profile, updateProfile, gameProgress, darkMode, toggleDarkMode } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    nickname: profile.nickname,
    xpGoal: profile.xpGoal
  });
  const { toast } = useToast();

  const xpPercentage = Math.min(100, (profile.xp / profile.xpGoal) * 100);

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
    toast({
      title: "Profile Updated! ✨",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditForm({
      name: profile.name,
      nickname: profile.nickname,
      xpGoal: profile.xpGoal
    });
    setIsEditing(false);
  };

  const achievements = [
    { icon: '🏆', title: 'First Steps', description: 'Completed your first wellness activity', unlocked: true, rarity: 'Common' },
    { icon: '🔥', title: 'Streak Master', description: 'Maintained a 7-day wellness streak', unlocked: profile.dayStreak >= 7, rarity: 'Rare' },
    { icon: '💎', title: 'XP Collector', description: 'Earned over 3000 XP', unlocked: profile.xp >= 3000, rarity: 'Epic' },
    { icon: '🧠', title: 'Mind Master', description: 'Played all mind games', unlocked: Object.keys(gameProgress).length >= 4, rarity: 'Legendary' },
    { icon: '🌟', title: 'Wellness Warrior', description: 'Reached 5000 XP milestone', unlocked: profile.xp >= 5000, rarity: 'Legendary' },
    { icon: '💝', title: 'Self-Care Champion', description: 'Logged mood for 30 consecutive days', unlocked: false, rarity: 'Mythic' }
  ];

  const gameStats = Object.entries(gameProgress).map(([gameId, stats]) => ({
    id: gameId,
    name: gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    ...stats
  }));

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'Rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Legendary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Mythic': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-warm bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your wellness journey and celebrate your achievements
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="glass hover:shadow-lg transition-all lg:col-span-1">
          <CardHeader className="text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-purple-pink rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 animate-float">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="space-y-3">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="text-center font-semibold"
                    placeholder="Full Name"
                  />
                  <Input
                    value={editForm.nickname}
                    onChange={(e) => setEditForm({...editForm, nickname: e.target.value})}
                    className="text-center text-sm"
                    placeholder="Nickname"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="flex-1 bg-gradient-success text-white">
                      <SaveIcon className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <CardTitle className="text-xl">{profile.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">@{profile.nickname}</p>
                  <p className="text-xs text-muted-foreground">House {profile.house}</p>
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="mt-2">
                    <EditIcon className="w-4 h-4 mr-1" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* XP Progress */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-teal-blue text-white rounded-full font-semibold">
                <ZapIcon className="w-4 h-4" />
                {profile.xp.toLocaleString()} XP
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">XP Goal</label>
                  <Input
                    type="number"
                    value={editForm.xpGoal}
                    onChange={(e) => setEditForm({...editForm, xpGoal: parseInt(e.target.value) || 5000})}
                    className="text-center"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div className="h-3 bg-gradient-wellness transition-all duration-1000 ease-out" style={{ width: `${xpPercentage}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(xpPercentage)}% towards {profile.xpGoal.toLocaleString()} XP goal
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                  <CalendarIcon className="w-5 h-5" />
                  {profile.dayStreak}
                </div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                  <AwardIcon className="w-5 h-5" />
                  {achievements.filter(a => a.unlocked).length}
                </div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
            </div>

            {/* Theme Toggle */}
            <Button onClick={toggleDarkMode} variant="outline" className="w-full">
              {darkMode ? <SunIcon className="w-4 h-4 mr-2" /> : <MoonIcon className="w-4 h-4 mr-2" />}
              {darkMode ? 'Light' : 'Dark'} Mode
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Statistics */}
          <Card className="glass hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-primary" />
                Game Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gameStats.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {gameStats.map((game) => (
                    <div key={game.id} className="p-4 rounded-lg border bg-muted/20 space-y-2">
                      <h4 className="font-medium text-primary">{game.name}</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between"><span>High Score:</span><span className="font-medium">{game.highScore.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Games Played:</span><span className="font-medium">{game.timesPlayed}</span></div>
                        <div className="flex justify-between"><span>Mastery:</span><span className="font-medium">{game.progress}%</span></div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div className="h-2 bg-gradient-purple-pink transition-all duration-500" style={{ width: `${game.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrophyIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No games played yet!</p>
                  <p className="text-sm">Try some mind games to see your stats here.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="glass hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AwardIcon className="w-5 h-5 text-primary" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:shadow-md'
                        : 'bg-muted/20 border-muted/40 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <Badge variant="secondary" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.unlocked && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            ✓ Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
