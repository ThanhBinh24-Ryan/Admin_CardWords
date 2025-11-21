import React, { useEffect, useState } from 'react';
import { useVocabProgressStore } from '../../store/vocabProgressStore';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  BookOpen,
  CheckCircle,
  XCircle
} from 'lucide-react';

const VocabProgressOverview: React.FC = () => {
  const {
    systemStats,
    difficultWords,
    loadingSystemStats,
    loadingDifficultWords,
    error,
    fetchSystemStatistics,
    fetchDifficultWords
  } = useVocabProgressStore();

  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchSystemStatistics();
    fetchDifficultWords({ limit });
  }, [limit]);

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
            Tổng Quan Tiến Độ Học Tập
          </h1>
          <p className="text-gray-600 mt-2">
            Thống kê tổng quan về việc học từ vựng của toàn hệ thống
          </p>
        </div>

        {/* Statistics Cards */}
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

        {/* Difficult Words Section */}
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