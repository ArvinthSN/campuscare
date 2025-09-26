import { useState, useEffect, useCallback } from 'react';

// DPIS Custom Hook for state management
export const useDPIS = () => {
  const [user, setUser] = useState(null);
  const [moods, setMoods] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user data
  useEffect(() => {
    const savedUser = localStorage.getItem('dpis-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Create default user for demo
      const defaultUser = {
        id: '1',
        realName: 'Anonymous User',
        nickname: 'MindfulSeeker',
        email: 'user@college.edu',
        college: 'Example University',
        xp: 1250,
        level: 5,
        house: 'serenity',
        achievements: [],
        loginStreak: 7,
        totalLogins: 42,
        joinDate: new Date().toISOString(),
      };
      setUser(defaultUser);
      localStorage.setItem('dpis-user', JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  // Load persisted data
  useEffect(() => {
    const savedMoods = localStorage.getItem('dpis-moods');
    if (savedMoods) setMoods(JSON.parse(savedMoods));

    const savedChat = localStorage.getItem('dpis-chat');
    if (savedChat) setChatHistory(JSON.parse(savedChat));

    const savedGames = localStorage.getItem('dpis-games');
    if (savedGames) setGameHistory(JSON.parse(savedGames));

    const savedAchievements = localStorage.getItem('dpis-achievements');
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

    const savedChallenges = localStorage.getItem('dpis-challenges');
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    } else {
      // Initialize default challenges
      const defaultChallenges = [
        {
          id: '1',
          title: 'Daily Mood Check',
          description: 'Log your mood once today',
          type: 'daily',
          category: 'mindfulness',
          xpReward: 50,
          requirements: { action: 'log_mood', target: 1, timeframe: 'day' },
          progress: 0,
          completed: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          title: 'Mindful Breathing',
          description: 'Complete a 5-minute breathing exercise',
          type: 'daily',
          category: 'mindfulness',
          xpReward: 75,
          requirements: { action: 'breathing_exercise', target: 5, timeframe: 'day' },
          progress: 0,
          completed: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          title: 'Community Helper',
          description: 'Help someone in the peer support forum',
          type: 'weekly',
          category: 'social',
          xpReward: 150,
          requirements: { action: 'forum_comment', target: 3, timeframe: 'week' },
          progress: 0,
          completed: false,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setChallenges(defaultChallenges);
      localStorage.setItem('dpis-challenges', JSON.stringify(defaultChallenges));
    }
  }, []);

  // Save data when changed
  useEffect(() => {
    if (user) localStorage.setItem('dpis-user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('dpis-moods', JSON.stringify(moods));
  }, [moods]);

  useEffect(() => {
    localStorage.setItem('dpis-chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('dpis-games', JSON.stringify(gameHistory));
  }, [gameHistory]);

  useEffect(() => {
    localStorage.setItem('dpis-achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('dpis-challenges', JSON.stringify(challenges));
  }, [challenges]);

  // Actions
  const addMoodEntry = useCallback(
    (mood) => {
      const newMood = {
        ...mood,
        id: Date.now().toString(),
      };
      setMoods((prev) => [newMood, ...prev]);

      // Award XP and update challenge progress
      if (user) {
        setUser((prev) => (prev ? { ...prev, xp: prev.xp + 25 } : null));
        updateChallengeProgress('log_mood', 1);
      }
    },
    [user]
  );

  const addChatMessage = useCallback((message) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, newMessage]);
  }, []);

  const addGameSession = useCallback(
    (session) => {
      const newSession = {
        ...session,
        id: Date.now().toString(),
        completedAt: new Date().toISOString(),
      };
      setGameHistory((prev) => [newSession, ...prev]);

      // Award XP
      if (user) {
        setUser((prev) =>
          prev ? { ...prev, xp: prev.xp + session.xpEarned } : null
        );
      }
    },
    [user]
  );

  const updateChallengeProgress = useCallback(
    (action, amount) => {
      setChallenges((prev) =>
        prev.map((challenge) => {
          if (challenge.requirements.action === action && !challenge.completed) {
            const newProgress = Math.min(
              challenge.progress + amount,
              challenge.requirements.target
            );
            const completed = newProgress >= challenge.requirements.target;

            // Award XP if completed
            if (completed && user) {
              setUser((prevUser) =>
                prevUser ? { ...prevUser, xp: prevUser.xp + challenge.xpReward } : null
              );
            }

            return {
              ...challenge,
              progress: newProgress,
              completed,
            };
          }
          return challenge;
        })
      );
    },
    [user]
  );

  const unlockAchievement = useCallback(
    (achievementId) => {
      const achievement = achievements.find((a) => a.id === achievementId);
      if (achievement && !achievement.unlockedAt) {
        setAchievements((prev) =>
          prev.map((a) =>
            a.id === achievementId
              ? { ...a, unlockedAt: new Date().toISOString() }
              : a
          )
        );

        // Award XP
        if (user) {
          setUser((prev) =>
            prev ? { ...prev, xp: prev.xp + achievement.xpReward } : null
          );
        }
      }
    },
    [achievements, user]
  );

  const updateUserProfile = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  // Analytics helpers
  const getTodaysMoods = useCallback(() => {
    const today = new Date().toDateString();
    return moods.filter(
      (mood) => new Date(mood.date).toDateString() === today
    );
  }, [moods]);

  const getWeeklyMoodTrend = useCallback(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return moods.filter((mood) => new Date(mood.date) >= weekAgo);
  }, [moods]);

  const getCompletedChallenges = useCallback(() => {
    return challenges.filter((c) => c.completed);
  }, [challenges]);

  const getActiveChallenges = useCallback(() => {
    const now = new Date();
    return challenges.filter(
      (c) => !c.completed && new Date(c.expiresAt) > now
    );
  }, [challenges]);

  return {
    // State
    user,
    moods,
    chatHistory,
    gameHistory,
    achievements,
    challenges,
    isLoading,

    // Actions
    addMoodEntry,
    addChatMessage,
    addGameSession,
    updateChallengeProgress,
    unlockAchievement,
    updateUserProfile,

    // Analytics
    getTodaysMoods,
    getWeeklyMoodTrend,
    getCompletedChallenges,
    getActiveChallenges,
  };
};
