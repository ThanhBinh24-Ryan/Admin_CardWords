// constants/game.ts

// Game types (nếu có nhiều loại game)
export const GAME_TYPES = {
  VOCABULARY_QUIZ: 'vocabulary_quiz',
  LISTENING_PRACTICE: 'listening_practice',
  SPELLING_BEE: 'spelling_bee',
  MEMORY_MATCH: 'memory_match'
} as const;

// Game difficulties
export const GAME_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const;

// Session status
export const SESSION_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned'
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 0,
  SIZE: 20,
  SIZES: [10, 20, 50, 100]
} as const;

// Sort options
export const GAME_SORT_OPTIONS = [
  { value: 'name', label: 'Tên game' },
  { value: 'sessionCount', label: 'Số lượt chơi' },
  { value: 'createdAt', label: 'Ngày tạo' }
] as const;

export const SESSION_SORT_OPTIONS = [
  { value: 'startedAt', label: 'Thời gian bắt đầu' },
  { value: 'score', label: 'Điểm số' },
  { value: 'accuracy', label: 'Độ chính xác' }
] as const;

// Accuracy levels for color coding
export const ACCURACY_LEVELS = {
  EXCELLENT: { min: 90, color: 'text-green-600', bgColor: 'bg-green-100' },
  GOOD: { min: 70, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  AVERAGE: { min: 50, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  POOR: { min: 0, color: 'text-red-600', bgColor: 'bg-red-100' }
} as const;

// Score ranges
export const SCORE_RANGES = {
  EXCELLENT: { min: 90, label: 'Xuất sắc' },
  GOOD: { min: 70, label: 'Tốt' },
  AVERAGE: { min: 50, label: 'Trung bình' },
  POOR: { min: 0, label: 'Cần cải thiện' }
} as const;

// Date filter options
export const DATE_FILTER_OPTIONS = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'yesterday', label: 'Hôm qua' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year', label: 'Năm nay' },
  { value: 'all', label: 'Tất cả' }
] as const;

// Export types for the constants
export type GameType = typeof GAME_TYPES[keyof typeof GAME_TYPES];
export type GameDifficulty = typeof GAME_DIFFICULTIES[keyof typeof GAME_DIFFICULTIES];
export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];
export type DateFilterOption = typeof DATE_FILTER_OPTIONS[number]['value'];