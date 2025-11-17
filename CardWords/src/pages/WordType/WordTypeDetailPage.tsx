import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { WORD_TYPE_COLORS } from '../../constants/wordTypes';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Tag, 
  Calendar,
  Loader2,
  AlertCircle,
  Shield
} from 'lucide-react';

const WordTypeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentType, 
    fetchTypeById, 
    deleteType, 
    loading, 
    error, 
    clearError,
    clearCurrentType 
  } = useWordTypeStore();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadWordType(parseInt(id));
    }

    return () => {
      clearCurrentType();
      clearError();
    };
  }, [id]);

  const loadWordType = async (typeId: number) => {
    try {
      await fetchTypeById(typeId);
    } catch (error) {
      console.error('Failed to load word type:', error);
    }
  };

  const handleDelete = async () => {
    if (!currentType) return;

    try {
      await deleteType(currentType.id);
      alert('Xóa loại từ thành công!');
      navigate('/admin/word-types');
    } catch (error: any) {
      alert('Xóa loại từ thất bại: ' + error.message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = () => {
    if (currentType) {
      navigate(`/admin/word-types/${currentType.id}/edit`);
    }
  };

  const getTypeColor = (typeName: string) => {
    return WORD_TYPE_COLORS[typeName.toLowerCase()] || WORD_TYPE_COLORS.default;
  };

  if (loading && !currentType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang tải thông tin loại từ...</p>
        </div>
      </div>
    );
  }

  if (!currentType && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy loại từ</h3>
          <p className="text-gray-600 mb-4">Loại từ bạn đang tìm kiếm không tồn tại</p>
          <button
            onClick={() => navigate('/admin/word-types')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Quay lại Danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/word-types')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg bg-white hover:bg-gray-50 transition-all shadow-md"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentType?.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  Chi tiết loại từ
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-md flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-md flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Có lỗi xảy ra</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {currentType && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Shield className="w-6 h-6 text-blue-600 mr-3" />
                    Thông tin Loại từ
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Tên Loại từ
                      </label>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-gradient-to-r ${getTypeColor(currentType.name)} text-white shadow-md`}>
                          {currentType.name}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Mô tả
                      </label>
                      <div className="bg-gray-50 rounded-xl p-4 min-h-[100px]">
                        <p className="text-gray-700 text-lg">
                          {currentType.description || 'Chưa có mô tả'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-gray-200">
                      <div>
                        <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          ID Loại từ
                        </label>
                        <p className="text-gray-900 font-mono text-lg bg-gray-100 px-4 py-2 rounded-xl">
                          #{currentType.id}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Trạng thái
                        </label>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                          <span className="text-green-600 font-bold">Đang hoạt động</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Thông tin nhanh
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Ngày tạo</span>
                      <span className="font-medium text-gray-900">---</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Số từ vựng</span>
                      <span className="font-medium text-gray-900">0</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Đang sử dụng</span>
                      <span className="font-medium text-green-600">Có</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Thao tác
                  </h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-md flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </button>
                    
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full px-4 py-3 bg-white text-red-600 border-2 border-red-300 font-bold rounded-xl hover:bg-red-50 transition-all transform hover:scale-105 shadow-md flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa Loại từ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa</h3>
                    <p className="text-gray-600 mt-1">Bạn có chắc chắn muốn xóa?</p>
                  </div>
                </div>

                {currentType && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-700 font-medium text-center">
                      Loại từ: <span className="font-bold">{currentType.name}</span>
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-6 py-3 text-base font-bold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordTypeDetailPage;