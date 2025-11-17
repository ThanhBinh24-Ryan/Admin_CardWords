import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTopicStore } from '../../store/topicStore';
import { Topic } from '../../types/topic';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Tag,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';

const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentTopic,
    loading,
    error,
    fetchTopicById,
    deleteTopic,
    clearError
  } = useTopicStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadTopic(parseInt(id));
    }
  }, [id]);

  const loadTopic = async (topicId: number) => {
    try {
      await fetchTopicById(topicId);
    } catch (error) {
      console.error('Failed to load topic:', error);
    }
  };

  const handleDelete = async () => {
    if (currentTopic) {
      try {
        await deleteTopic(currentTopic.id);
        navigate('/admin/topics');
      } catch (error) {
        console.error('Failed to delete topic:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Lỗi tải dữ liệu</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
        <Link
          to="/admin/topics"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (!currentTopic) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy chủ đề
        </h3>
        <p className="text-gray-500 mb-4">
          Chủ đề bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          to="/admin/topics"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link
            to="/admin/topics"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{currentTopic.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/admin/topics/${currentTopic.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <img
              src={currentTopic.img || '/default-topic.jpg'}
              alt={currentTopic.name}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Mô tả
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {currentTopic.description || 'Chưa có mô tả cho chủ đề này.'}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin cơ bản
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Tag className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-gray-500">ID</p>
                  <p className="font-medium text-gray-900">#{currentTopic.id}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-gray-500">Ngày tạo</p>
                  <p className="font-medium text-gray-900">
                    {currentTopic.createdAt ? new Date(currentTopic.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-gray-500">Cập nhật lần cuối</p>
                  <p className="font-medium text-gray-900">
                    {currentTopic.updatedAt ? new Date(currentTopic.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hành động nhanh
            </h3>
            <div className="space-y-2">
              <Link
                to={`/admin/topics/${currentTopic.id}/edit`}
                className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa thông tin
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa chủ đề
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc muốn xóa chủ đề "{currentTopic.name}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicDetail;