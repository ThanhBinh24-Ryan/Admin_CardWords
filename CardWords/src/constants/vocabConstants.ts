export const CEFR_LEVELS = [
  'A1', 'A2', 'B1', 'B2', 'C1', 'C2'
] as const;

export type CefrLevel = typeof CEFR_LEVELS[number];

export const VOCAB_TYPES = [
  'noun', 'verb', 'adjective', 'adverb', 'preposition', 
  'conjunction', 'interjection', 'pronoun', 'determiner'
] as const;

export type VocabType = typeof VOCAB_TYPES[number];

export const SORT_FIELDS = [
  'word',
  'createdAt',
  'updatedAt',
  'cefr'
] as const;

export type SortField = typeof SORT_FIELDS[number];

// File upload constants
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB