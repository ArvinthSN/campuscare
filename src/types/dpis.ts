// DPIS Type Definitions
export interface UserProfile {
  id: string;
  realName: string;
  nickname: string;
  email: string;
  college: string;
  xp: number;
  level: number;
  house: 'serenity' | 'mindful' | 'harmony' | 'balance';
  achievements: Achievement[];
  loginStreak: number;
  totalLogins: number;
  joinDate: string;
  avatar?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: string;
  xpReward: number;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: 'excellent' | 'good' | 'okay' | 'struggling' | 'difficult';
  intensity: number; // 1-10
  tags: string[];
  note?: string;
  activities?: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type: 'text' | 'assessment' | 'resource' | 'referral';
  metadata?: {
    assessmentType?: string;
    resourceId?: string;
    urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface Assessment {
  id: string;
  type: 'PHQ-9' | 'GAD-7' | 'stress-check' | 'wellbeing';
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  scoring: AssessmentScoring;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'likert' | 'multiple-choice' | 'yes-no';
  options: string[];
  scores: number[];
}

export interface AssessmentScoring {
  ranges: {
    min: number;
    max: number;
    level: string;
    description: string;
    recommendations: string[];
  }[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'article' | 'exercise' | 'book';
  category: 'meditation' | 'breathing' | 'music' | 'reading' | 'coping';
  language: 'english' | 'hindi' | 'tamil' | 'kashmiri' | 'urdu';
  url?: string;
  content?: string;
  duration?: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  rating: number;
  completions: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorNickname: string;
  authorHouse: string;
  timestamp: string;
  category: 'general' | 'academic' | 'relationships' | 'anxiety' | 'depression' | 'memes' | 'achievements';
  upvotes: number;
  comments: ForumComment[];
  tags: string[];
  isAnonymous: boolean;
}

export interface ForumComment {
  id: string;
  content: string;
  authorNickname: string;
  timestamp: string;
  upvotes: number;
  isAnonymous: boolean;
}

export interface GameSession {
  id: string;
  gameType: 'memory' | 'focus' | 'breathing' | 'mindfulness' | 'cognitive';
  score: number;
  duration: number; // in seconds
  completedAt: string;
  xpEarned: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface House {
  id: 'serenity' | 'mindful' | 'harmony' | 'balance';
  name: string;
  description: string;
  color: string;
  element: string;
  values: string[];
  totalMembers: number;
  totalXP: number;
  rank: number;
}

export interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'forum' | 'assessment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  category: 'mindfulness' | 'social' | 'learning' | 'activity';
  xpReward: number;
  requirements: {
    action: string;
    target: number;
    timeframe: string;
  };
  progress: number;
  completed: boolean;
  expiresAt: string;
}

export interface Analytics {
  userId: string;
  sessionStart: string;
  sessionEnd?: string;
  pagesVisited: string[];
  actionsPerformed: {
    action: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }[];
  moodEntries: number;
  chatInteractions: number;
  assessmentsCompleted: number;
  resourcesAccessed: number;
  gamesPlayed: number;
}

export interface CrisisResource {
  id: string;
  type: 'hotline' | 'chat' | 'text' | 'emergency';
  name: string;
  description: string;
  contact: string;
  availability: string;
  languages: string[];
  location?: string;
  priority: number;
}