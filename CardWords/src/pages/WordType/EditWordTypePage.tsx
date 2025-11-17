import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { 
  ArrowLeft, 
  Tag,
  AlertCircle,
  Ban
} from 'lucide-react';

const EditWordTypePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentType, 
    fetchTypeById, 
    loading, 
    error, 
    clearError,
    clearCurrentType 
  } = useWordTypeStore();

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

  if (loading && !currentType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải thông tin loại từ...</p>
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
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-3 rounded-xl shadow-lg">
                <Ban className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Chức năng không khả dụng
                </h1>
                <p className="text-gray-600 mt-1">
                  Chỉnh sửa loại từ: {currentType?.name}
                </p>
              </div>
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

        {/* Thông báo không hỗ trợ edit */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ban className="w-10 h-10 text-yellow-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Chức năng chỉnh sửa không khả dụng
              </h2>
              
              <p className="text-gray-600 mb-6 text-lg">
                Hiện tại hệ thống không hỗ trợ chỉnh sửa loại từ. 
                <br />
                Nếu cần thay đổi, vui lòng xóa loại từ cũ và tạo mới.
              </p>

              {currentType && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Thông tin loại từ hiện tại</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Tên:</span>
                      <span className="text-gray-900">{currentType.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">ID:</span>
                      <span className="text-gray-900">#{currentType.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Mô tả:</span>
                      <span className="text-gray-900">{currentType.description || 'Không có mô tả'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={() => navigate('/admin/word-types')}
                  className="flex-1 px-8 py-4 text-lg font-bold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-md"
                >
                  Quay lại Danh sách
                </button>
                <button
                  onClick={() => navigate('/admin/word-types/create')}
                  className="flex-1 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <Tag className="w-5 h-5 mr-2" />
                  Tạo Loại từ Mới
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditWordTypePage;