export interface SystemOverview {
  totalUsers: number;
  activeUsersToday: number;
  totalVocabs: number;
  totalTopics: number;
  totalGameSessions: number;
  completedGameSessions: number;
  averageScore: number;
  highestScore: number;
  totalWordsLearned: number;
}

export interface UserStatistics {
  totalUsers: number;
  activatedUsers: number;
  bannedUsers: number;
  adminUsers: number;
  normalUsers: number;
}

export interface UserSearchResult {
  id: string;
  email: string;
  name: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
  currentLevel: string;
  activated: boolean;
  banned: boolean;
  status: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationChartData {
  stats: {
    totalUsers: number;
    totalVocabs: number;
    totalNotifications: number;
    totalLearningSession: number;
  };
  userRegistrationChart: Array<{
    date: string;
    count: number;
  }>;
  topLearners: Array<{
    userId: string;
    name: string;
    email: string;
    avatarUrl: string;
    totalWordsLearned: number;
    currentStreak: number;
    totalScore: number;
  }>;
}

export interface GameStats {
  gameId: number;
  gameName: string;
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  highestScore: number;
  averageAccuracy: number;
}

export interface LeaderboardEntry {
  rank: number;
  userName: string;
  avatar: string;
  totalScore: number;
  accuracy: number;
  gamesPlayed: number;
  lastPlayedAt: string;
}

export interface TopPlayersData {
  quickQuizTop10: LeaderboardEntry[];
  imageMatchingTop10: LeaderboardEntry[];
  wordDefinitionTop10: LeaderboardEntry[];
  totalActivePlayers: number;
  cacheExpirySeconds: number;
}

export interface BaseResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  totalPages: number;
  totalElements: number;
  content: T[];
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}