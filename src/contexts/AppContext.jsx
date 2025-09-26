import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(undefined);

const defaultProfile = {
  name: 'Alex Knight',
  nickname: 'WellnessSeeker',
  xp: 3650,
  xpGoal: 5000,
  dayStreak: 15,
  badges: 8,
  house: 'Astra'
};

const defaultGameProgress = {
  'memory-palace': { highScore: 2450, timesPlayed: 12, progress: 85 },
  'zen-garden': { highScore: 1890, timesPlayed: 8, progress: 60 },
  'emotion-navigator': { highScore: 3120, timesPlayed: 15, progress: 40 },
  'stress-buster': { highScore: 1650, timesPlayed: 20, progress: 95 }
};

export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('campuscare-profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [gameProgress, setGameProgress] = useState(() => {
    const saved = localStorage.getItem('campuscare-games');
    return saved ? JSON.parse(saved) : defaultGameProgress;
  });

  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem('campuscare-moods');
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('campuscare-darkmode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('campuscare-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('campuscare-games', JSON.stringify(gameProgress));
  }, [gameProgress]);

  useEffect(() => {
    localStorage.setItem('campuscare-moods', JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => {
    localStorage.setItem('campuscare-darkmode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateGameProgress = (gameId, score) => {
    setGameProgress(prev => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        highScore: Math.max(prev[gameId]?.highScore || 0, score),
        timesPlayed: (prev[gameId]?.timesPlayed || 0) + 1,
        progress: Math.min(100, (prev[gameId]?.progress || 0) + 5)
      }
    }));
  };

  const addMoodEntry = (mood, icon) => {
    const today = new Date().toDateString();
    setMoodHistory(prev => [
      ...prev.filter(entry => entry.date !== today),
      { date: today, mood, icon }
    ]);
  };

  const addXP = (amount) => {
    setProfile(prev => ({
      ...prev,
      xp: prev.xp + amount
    }));
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        gameProgress,
        updateGameProgress,
        moodHistory,
        addMoodEntry,
        darkMode,
        toggleDarkMode,
        addXP
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
