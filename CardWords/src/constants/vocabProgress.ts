export const VOCAB_PROGRESS_CONSTANTS = {

  DEFAULT_PAGE: 0,
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_LIMIT: 20,


  ENDPOINTS: {
    VOCAB_STATS: (vocabId: string) => `/api/v1/admin/vocab-progress/vocab/${vocabId}`,
   
    USER_PROGRESS: (userId: string) => `/api/v1/admin/vocab-progress/user/${userId}`,
    
    SYSTEM_STATISTICS: '/api/v1/admin/vocab-progress/statistics',
    DIFFICULT_WORDS: '/api/v1/admin/vocab-progress/difficult-words',
    
    DELETE_PROGRESS: (id: string) => `/api/v1/admin/vocab-progress/${id}`,
    
    RESET_USER_PROGRESS: (userId: string) => `/api/v1/admin/vocab-progress/user/${userId}/reset`,
    

    USERS: '/api/v1/admin/users',
    

    VOCABS: '/api/v1/admin/vocabs',
  },

  ERROR_MESSAGES: {
    FETCH_VOCAB_STATS_FAILED: 'Không thể tải thống kê từ vựng',
    FETCH_USER_PROGRESS_FAILED: 'Không thể tải tiến độ người dùng',
    FETCH_SYSTEM_STATS_FAILED: 'Không thể tải thống kê hệ thống',
    FETCH_DIFFICULT_WORDS_FAILED: 'Không thể tải danh sách từ khó',
    DELETE_PROGRESS_FAILED: 'Không thể xóa bản ghi tiến độ',
    RESET_PROGRESS_FAILED: 'Không thể reset tiến độ người dùng',
    FETCH_USERS_FAILED: 'Không thể tải danh sách người dùng',
    FETCH_VOCABS_FAILED: 'Không thể tải danh sách từ vựng',
  },

  SUCCESS_MESSAGES: {
    DELETE_PROGRESS_SUCCESS: 'Xóa bản ghi tiến độ thành công',
    RESET_PROGRESS_SUCCESS: 'Reset tiến độ người dùng thành công',
  },
};