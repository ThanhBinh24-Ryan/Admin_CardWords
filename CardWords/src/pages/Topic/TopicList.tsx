import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTopicStore } from '../../store/topicStore';
import { Topic } from '../../types/topic';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  X,
  Loader2,
  AlertCircle,
  Download,
  Upload,
  FolderOpen
} from 'lucide-react';

const TopicList: React.FC = () => {
  const {
    topics,
    loading,
    error,
    fetchTopics,
    deleteTopic,
    clearError
  } = useTopicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      await fetchTopics();
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (topic: Topic) => {
    setTopicToDelete(topic);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (topicToDelete) {
      try {
        await deleteTopic(topicToDelete.id);
        setShowDeleteModal(false);
        setTopicToDelete(null);
      } catch (error) {
        console.error('Failed to delete topic:', error);
      }
    }
  };

  const toggleSelectTopic = (id: number) => {
    setSelectedTopics(prev =>
      prev.includes(id)
        ? prev.filter(topicId => topicId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTopics(
      selectedTopics.length === filteredTopics.length
        ? []
        : filteredTopics.map(topic => topic.id)
    );
  };

  if (loading && topics.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Đang tải chủ đề...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Chủ đề</h1>
          <p className="text-gray-600">Quản lý và tổ chức các chủ đề học tập</p>
        </div>
        <Link
          to="/admin/topics/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm chủ đề
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm chủ đề..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Xuất
            </button>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={topic.img || '/default-topic.jpg'}
                alt={topic.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic.id)}
                  onChange={() => toggleSelectTopic(topic.id)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                {topic.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {topic.description || 'Không có mô tả'}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  ID: {topic.id}
                </span>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/topics/${topic.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/admin/topics/${topic.id}/edit`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(topic)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTopics.length === 0 && !loading && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy chủ đề
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Thử điều chỉnh từ khóa tìm kiếm' : 'Bắt đầu bằng cách tạo chủ đề đầu tiên'}
          </p>
          <Link
            to="/admin/topics/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tạo chủ đề mới
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && topicToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc muốn xóa chủ đề "{topicToDelete.name}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
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

export default TopicList;