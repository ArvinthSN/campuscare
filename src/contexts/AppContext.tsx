import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  name: string;
  nickname: string;
  xp: number;
  xpGoal: number;
  dayStreak: number;
  badges: number;
  house: string;
}

interface GameProgress {
  [gameId: string]: {
    highScore: number;
    timesPlayed: number;
    progress: number;
  };
}

interface MoodEntry {
  date: string;
  mood: string;
  icon: string;
}

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  gameProgress: GameProgress;
  updateGameProgress: (gameId: string, score: number) => void;
  moodHistory: MoodEntry[];
  addMoodEntry: (mood: string, icon: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  addXP: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  name: 'Alex Knight',
  nickname: 'WellnessSeeker',
  xp: 3650,
  xpGoal: 5000,
  dayStreak: 15,
  badges: 8,
  house: 'Astra'
};

const defaultGameProgress: GameProgress = {
  'memory-palace': { highScore: 2450, timesPlayed: 12, progress: 85 },
  'zen-garden': { highScore: 1890, timesPlayed: 8, progress: 60 },
  'emotion-navigator': { highScore: 3120, timesPlayed: 15, progress: 40 },
  'stress-buster': { highScore: 1650, timesPlayed: 20, progress: 95 }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('campuscare-profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [gameProgress, setGameProgress] = useState<GameProgress>(() => {
    const saved = localStorage.getItem('campuscare-games');
    return saved ? JSON.parse(saved) : defaultGameProgress;
  });

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
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

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateGameProgress = (gameId: string, score: number) => {
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

  const addMoodEntry = (mood: string, icon: string) => {
    const today = new Date().toDateString();
    setMoodHistory(prev => [
      ...prev.filter(entry => entry.date !== today),
      { date: today, mood, icon }
    ]);
  };

  const addXP = (amount: number) => {
    setProfile(prev => ({
      ...prev,
      xp: prev.xp + amount
    }));
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <AppContext.Provider value={{
      profile,
      updateProfile,
      gameProgress,
      updateGameProgress,
      moodHistory,
      addMoodEntry,
      darkMode,
      toggleDarkMode,
      addXP
    }}>
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