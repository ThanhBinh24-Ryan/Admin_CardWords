import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVocabProgressStore } from '../../store/vocabProgressStore';
import {
  User,
  ArrowLeft,
  BarChart3,
  Target,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import DeleteProgressModal from './Modal/DeleteProgressModal';
import ResetProgressModal from './Modal/ResetProgressModal';

const UserProgressDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const {
    userProgress,
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    loadingUserProgress,
    error,
    fetchUserProgress,
    deleteProgress,
    resetUserProgress
  } = useVocabProgressStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgress, setSelectedProgress] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'low'>('all');

  useEffect(() => {
    if (userId) {
      fetchUserProgress(userId, { page: 0, size: 20 });
    }
  }, [userId]);

  const handlePageChange = (page: number) => {
    if (userId) {
      fetchUserProgress(userId, { page, size: pageSize });
    }
  };

  const handleDelete = (progress: any) => {
    setSelectedProgress(progress);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedProgress) {
      await deleteProgress(selectedProgress.id);
      setShowDeleteModal(false);
      setSelectedProgress(null);
    }
  };

  const confirmReset = async () => {
    if (userId) {
      await resetUserProgress(userId);
      setShowResetModal(false);
    }
  };

  const filteredProgress = userProgress.filter(progress => {
    const matchesSearch = progress.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         progress.meaningVi.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'high') return matchesSearch && progress.accuracy >= 70;
    if (filter === 'low') return matchesSearch && progress.accuracy < 70;
    
    return matchesSearch;
  });

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy người dùng</h2>
          <button
            onClick={() => navigate('/admin/vocab-progress')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/vocab-progress')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Quay lại
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <User className="h-8 w-8 mr-3 text-blue-600" />
                  Tiến Độ Học Tập
                </h1>
                <p className="text-gray-600 mt-1">
                  User ID: {userId}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Tiến Độ
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng từ đã học</p>
                <p className="text-2xl font-bold text-gray-900">{totalElements}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Độ chính xác trung bình</p>
                <p className="text-2xl font-bold text-green-600">
                  {userProgress.length > 0 
                    ? (userProgress.reduce((acc, curr) => acc + curr.accuracy, 0) / userProgress.length).toFixed(1)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng lượt làm</p>
                <p className="text-2xl font-bold text-purple-600">
                  {userProgress.reduce((acc, curr) => acc + curr.timesCorrect + curr.timesWrong, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm từ vựng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="high">Độ chính xác cao (≥70%)</option>
                <option value="low">Độ chính xác thấp (&lt;70%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Progress Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loadingUserProgress ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProgress.length === 0 ? (
            <div className="text-center py-16">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu tiến độ'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Hãy thử tìm kiếm với từ khóa khác' : 'Người dùng chưa bắt đầu học từ vựng'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Từ vựng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thống kê
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Độ chính xác
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cập nhật
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProgress.map((progress) => (
                      <tr key={progress.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{progress.word}</div>
                            <div className="text-sm text-gray-600">{progress.meaningVi}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {progress.cefr}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-600 font-medium">{progress.timesCorrect}</span>
                              <span className="text-gray-500 mx-1">đúng</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-red-600 font-medium">{progress.timesWrong}</span>
                              <span className="text-gray-500 mx-1">sai</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div
                                className={`h-2 rounded-full ${
                                  progress.accuracy >= 70 ? 'bg-green-500' : 
                                  progress.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(progress.accuracy, 100)}%` }}
                              ></div>
                            </div>
                            <span className={`font-semibold ${
                              progress.accuracy >= 70 ? 'text-green-600' : 
                              progress.accuracy >= 50 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {progress.accuracy.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(progress.updatedAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(progress)}
                            className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Hiển thị{' '}
                      <span className="font-semibold">
                        {Math.max(currentPage * pageSize + 1, 1)}
                      </span>{' '}
                      đến{' '}
                      <span className="font-semibold">
                        {Math.min(currentPage * pageSize + filteredProgress.length, totalElements)}
                      </span>{' '}
                      của{' '}
                      <span className="font-semibold">{totalElements}</span>{' '}
                      kết quả
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                          currentPage === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        ← Trước
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(index)}
                          className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                            currentPage === index
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                          currentPage === totalPages - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        Sau →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <DeleteProgressModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProgress(null);
        }}
        onConfirm={confirmDelete}
        progress={selectedProgress}
      />

      <ResetProgressModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={confirmReset}
        userId={userId}
      />
    </div>
  );
};

export default UserProgressDetail;