export const VOCAB_PROGRESS_CONSTANTS = {
  // Default pagination
  DEFAULT_PAGE: 0,
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_LIMIT: 20,

  // API endpoints
  ENDPOINTS: {
    // Lấy thống kê từ vựng
    VOCAB_STATS: (vocabId: string) => `/api/v1/admin/vocab-progress/vocab/${vocabId}`,
    
    // Lấy tiến độ học từ của user
    USER_PROGRESS: (userId: string) => `/api/v1/admin/vocab-progress/user/${userId}`,
    
    // Tổng quan tiến độ học toàn hệ thống
    SYSTEM_STATISTICS: '/api/v1/admin/vocab-progress/statistics',
    
    // Lấy danh sách từ khó nhất
    DIFFICULT_WORDS: '/api/v1/admin/vocab-progress/difficult-words',
    
    // Xóa bản ghi tiến độ
    DELETE_PROGRESS: (id: string) => `/api/v1/admin/vocab-progress/${id}`,
    
    // Reset tiến độ của user
    RESET_USER_PROGRESS: (userId: string) => `/api/v1/admin/vocab-progress/user/${userId}/reset`,
  },

  // Error messages
  ERROR_MESSAGES: {
    FETCH_VOCAB_STATS_FAILED: 'Không thể tải thống kê từ vựng',
    FETCH_USER_PROGRESS_FAILED: 'Không thể tải tiến độ người dùng',
    FETCH_SYSTEM_STATS_FAILED: 'Không thể tải thống kê hệ thống',
    FETCH_DIFFICULT_WORDS_FAILED: 'Không thể tải danh sách từ khó',
    DELETE_PROGRESS_FAILED: 'Không thể xóa bản ghi tiến độ',
    RESET_PROGRESS_FAILED: 'Không thể reset tiến độ người dùng',
  },

  // Success messages
  SUCCESS_MESSAGES: {
    DELETE_PROGRESS_SUCCESS: 'Xóa bản ghi tiến độ thành công',
    RESET_PROGRESS_SUCCESS: 'Reset tiến độ người dùng thành công',
  },
};