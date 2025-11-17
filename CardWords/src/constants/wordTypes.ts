export const DEFAULT_WORD_TYPES = [
  { id: 1, name: 'noun', description: 'Danh từ' },
  { id: 2, name: 'verb', description: 'Động từ' },
  { id: 3, name: 'adjective', description: 'Tính từ' },
  { id: 4, name: 'adverb', description: 'Trạng từ' },
  { id: 5, name: 'preposition', description: 'Giới từ' },
  { id: 6, name: 'conjunction', description: 'Liên từ' },
  { id: 7, name: 'pronoun', description: 'Đại từ' },
  { id: 8, name: 'interjection', description: 'Thán từ' },
];

export const WORD_TYPE_COLORS: { [key: string]: string } = {
  noun: 'from-blue-500 to-blue-600',
  verb: 'from-green-500 to-green-600',
  adjective: 'from-purple-500 to-purple-600',
  adverb: 'from-yellow-500 to-yellow-600',
  preposition: 'from-red-500 to-red-600',
  conjunction: 'from-indigo-500 to-indigo-600',
  pronoun: 'from-pink-500 to-pink-600',
  interjection: 'from-orange-500 to-orange-600',
  default: 'from-gray-500 to-gray-600'
};