import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabProgressStore } from '../../store/vocabProgressStore';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  BookOpen,
  CheckCircle,
  XCircle,
  User,
  Book,
  Search,
  Eye
} from 'lucide-react';

const VocabProgressOverview: React.FC = () => {
  const navigate = useNavigate();
  const {
    systemStats,
    difficultWords,
    users,
    vocabs,
    usersTotalElements,
    vocabsTotalElements,
    loadingSystemStats,
    loadingDifficultWords,
    loadingUsers,
    loadingVocabs,
    error,
    fetchSystemStatistics,
    fetchDifficultWords,
    fetchUsers,
    fetchVocabs
  } = useVocabProgressStore();

  const [limit, setLimit] = useState(10);
  const [userSearch, setUserSearch] = useState('');
  const [vocabSearch, setVocabSearch] = useState('');
  const [usersPage, setUsersPage] = useState(0);
  const [vocabsPage, setVocabsPage] = useState(0);

  useEffect(() => {
    fetchSystemStatistics();
    fetchDifficultWords({ limit });
    fetchUsers({ page: 0, size: 10 });
    fetchVocabs({ page: 0, size: 10 });
  }, [limit]);

  useEffect(() => {
    if (vocabSearch) {
      fetchVocabs({ page: 0, size: 1000 }); 
    }
  }, [vocabSearch]);

  const handleViewUserProgress = (userId: string) => {
    navigate(`/admin/vocab-progress/user/${userId}`);
  };

  const handleViewVocabStats = (vocabId: string) => {
    navigate(`/admin/vocab-progress/vocab/${vocabId}`);
  };

  const handleUsersPageChange = (page: number) => {
    setUsersPage(page);
    fetchUsers({ page, size: 10 });
  };

  const handleVocabsPageChange = (page: number) => {
    setVocabsPage(page);
    fetchVocabs({ page, size: 10 });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredVocabs = vocabs.filter(vocab =>
    vocab.word.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    vocab.meaningVi.toLowerCase().includes(vocabSearch.toLowerCase())
  );

  if (loadingSystemStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => fetchSystemStatistics()}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tổng Quan Tiến Độ Học Tập
          </h1>
          <p className="text-gray-600 mt-2">
            Thống kê tổng quan về việc học từ vựng của toàn hệ thống
          </p>
        </div>

        {systemStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng bản ghi</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {systemStats.totalProgressRecords.toLocaleString()}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng câu đúng</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {systemStats.totalCorrect.toLocaleString()}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng câu sai</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {systemStats.totalWrong.toLocaleString()}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Độ chính xác</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {systemStats.overallAccuracy.toFixed(1)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Người Dùng ({usersTotalElements})
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {loadingUsers ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {userSearch ? 'Không tìm thấy người dùng phù hợp' : 'Không có người dùng'}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              user.activated && !user.banned 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.activated && !user.banned ? 'Đang hoạt động' : 'Bị cấm'}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {user.currentLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewUserProgress(user.id)}
                        className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Xem
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!userSearch && usersTotalElements > 10 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    Hiển thị {Math.min((usersPage * 10) + 1, usersTotalElements)}-
                    {Math.min((usersPage + 1) * 10, usersTotalElements)} của {usersTotalElements}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUsersPageChange(usersPage - 1)}
                      disabled={usersPage === 0}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => handleUsersPageChange(usersPage + 1)}
                      disabled={(usersPage + 1) * 10 >= usersTotalElements}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Book className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Từ Vựng ({vocabsTotalElements})
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm từ vựng..."
                  value={vocabSearch}
                  onChange={(e) => setVocabSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {loadingVocabs ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : filteredVocabs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {vocabSearch ? 'Không tìm thấy từ vựng phù hợp' : 'Không có từ vựng'}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredVocabs.map((vocab) => (
                    <div
                      key={vocab.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{vocab.word}</h3>
                            <p className="text-sm text-gray-600">{vocab.meaningVi}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {vocab.cefr}
                              </span>
                              {vocab.topic && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {vocab.topic.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {vocab.exampleSentence && (
                          <p className="text-sm text-gray-500 italic mt-2">
                            "{vocab.exampleSentence}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleViewVocabStats(vocab.id)}
                        className="flex items-center text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors ml-4"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Xem
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!vocabSearch && vocabsTotalElements > 10 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    Hiển thị {Math.min((vocabsPage * 10) + 1, vocabsTotalElements)}-
                    {Math.min((vocabsPage + 1) * 10, vocabsTotalElements)} của {vocabsTotalElements}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVocabsPageChange(vocabsPage - 1)}
                      disabled={vocabsPage === 0}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => handleVocabsPageChange(vocabsPage + 1)}
                      disabled={(vocabsPage + 1) * 10 >= vocabsTotalElements}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Từ Vựng Khó Nhất
                </h2>
              </div>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
              </select>
            </div>
          </div>

          <div className="p-6">
            {loadingDifficultWords ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : difficultWords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu từ vựng khó
              </div>
            ) : (
              <div className="space-y-4">
                {difficultWords.map((word, index) => (
                  <div
                    key={word.vocabId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{word.word}</h3>
                        <p className="text-sm text-gray-600">{word.meaningVi}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {word.cefr}
                          </span>
                          <span className="text-xs text-gray-500">
                            {word.learnerCount} người học
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">
                        Tỷ lệ sai: {word.errorRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {word.timesWrong} sai / {word.timesCorrect + word.timesWrong} tổng
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabProgressOverview;