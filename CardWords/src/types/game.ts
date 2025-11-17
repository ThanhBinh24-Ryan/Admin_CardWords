// types/game.ts

// Game
export interface Game {
  id: number;
  name: string;
  description: string;
  sessionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameResponse {
  status: string;
  message: string;
  data: Game;
}

export interface GamesResponse {
  status: string;
  message: string;
  data: Game[];
}

// Game Statistics
export interface GameStatistics {
  gameName: string;
  totalSessions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averageAccuracy: number;
}

export interface GameStatisticsResponse {
  status: string;
  message: string;
  data: GameStatistics;
}

// Game Overview Statistics
export interface GamesOverviewStatistics {
  totalGames: number;
  totalSessions: number;
  overallAverageScore: number;
  overallHighestScore: number;
}

export interface GamesOverviewStatisticsResponse {
  status: string;
  message: string;
  data: GamesOverviewStatistics;
}

// Game Session
export interface GameSession {
  sessionId: number;
  gameName: string;
  userName: string;
  userEmail: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  accuracy: number;
  startedAt: string;
  finishedAt: string;
}

export interface GameSessionDetail extends GameSession {
  details: GameSessionDetailItem[];
}

export interface GameSessionDetailItem {
  word: string;
  meaning: string;
  isCorrect: boolean;
}

// Pagination
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface Pageable {
  paged: boolean;
  unpaged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort;
}

export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface GameSessionsPageResponse {
  status: string;
  message: string;
  data: {
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
    pageable: Pageable;
    last: boolean;
    first: boolean;
    size: number;
    content: GameSession[];
    number: number;
    sort: Sort;
    empty: boolean;
  };
}

export interface GameSessionDetailResponse {
  status: string;
  message: string;
  data: GameSessionDetail;
}

export interface EmptyResponse {
  status: string;
  message: string;
  data: {};
}