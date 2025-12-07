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
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Calendar,
  SortAsc,
  SortDesc,
  AlertTriangle
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  
  const [sortBy, setSortBy] = useState<'name' | 'id'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const getFirstLetter = (name: string): string => {
    if (!name || name.trim().length === 0) return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  const TopicAvatar: React.FC<{ topic: Topic; size?: 'small' | 'large' }> = ({ 
    topic, 
    size = 'large' 
  }) => {
    const firstLetter = getFirstLetter(topic.name);
    
    if (topic.img) {
      return (
        <img
          src={topic.img}
          alt={topic.name}
          className={`
            object-cover
            ${size === 'small' ? 'w-10 h-10 rounded-lg' : 'w-full h-48'}
          `}
        />
      );
    }
    
    return (
      <div
        className={`
          flex items-center justify-center text-white font-bold
          bg-gradient-to-r from-purple-600 to-pink-600
          ${size === 'small' 
            ? 'w-10 h-10 rounded-lg text-lg' 
            : 'w-full h-48 text-6xl'
          }
        `}
      >
        {firstLetter}
      </div>
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const filteredAndSortedTopics = topics
    .filter(topic =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'id':
        default:
          aValue = a.id;
          bValue = b.id;
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const totalPages = Math.ceil(filteredAndSortedTopics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTopics = filteredAndSortedTopics.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteClick = (topic: Topic) => {
    setTopicToDelete(topic);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (topicToDelete) {
      try {
        setDeleteLoading(true);
        await deleteTopic(topicToDelete.id);
        setShowDeleteModal(false);
        setTopicToDelete(null);
        if (currentTopics.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error('Failed to delete topic:', error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleSort = (field: 'name' | 'id') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
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
      <div className="text-center relative">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <FolderOpen className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý Chủ đề</h1>
        <p className="text-gray-600 text-lg">Quản lý và tổ chức các chủ đề học tập</p>
      </div>

      <div className="flex justify-center">
        <div className="flex gap-3 bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <Link
            to="/admin/topics/bulk-create"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm nhiều
          </Link>
          <Link
            to="/admin/topics/bulk-edit" 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center transition-colors"
          >
            <Edit className="w-5 h-5 mr-2" />
            Sửa nhiều
          </Link>
          <Link
            to="/admin/topics/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm chủ đề
          </Link>
        </div>
      </div>

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

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm chủ đề theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">

            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleSort('name')}
                className={`px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors ${
                  sortBy === 'name' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tên
                {sortBy === 'name' && (
                  sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                )}
              </button>
              <button
                onClick={() => handleSort('id')}
                className={`px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors ${
                  sortBy === 'id' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ID
                {sortBy === 'id' && (
                  sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />
                )}
              </button>
            </div>

            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            Hiển thị {Math.min(itemsPerPage, currentTopics.length)} trong tổng số {filteredAndSortedTopics.length} chủ đề
            {searchTerm && ` cho "${searchTerm}"`}
          </span>
          <span>Trang {currentPage} / {totalPages}</span>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300"
            >
              <div className="relative">
                <TopicAvatar topic={topic} size="large" />
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  ID: {topic.id}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {topic.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {topic.description || 'Không có mô tả'}
                </p>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
        
                  </div>
                  <div className="flex gap-1">
                    <Link
                      to={`/admin/topics/${topic.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/topics/${topic.id}/edit`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(topic)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      ) : (
        /* List View */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTopics.map((topic) => (
                <tr key={topic.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <TopicAvatar topic={topic} size="small" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{topic.name}</div>
                        <div className="text-sm text-gray-500">ID: {topic.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {topic.description || 'Không có mô tả'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/topics/${topic.id}`}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/topics/${topic.id}/edit`}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(topic)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedTopics.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy chủ đề
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Thử điều chỉnh từ khóa tìm kiếm' : 'Bắt đầu bằng cách tạo chủ đề đầu tiên'}
          </p>
          <Link
            to="/admin/topics/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tạo chủ đề mới
          </Link>
        </div>
      )}

      {/* Modal Delete đã được chỉnh style */}
      {showDeleteModal && topicToDelete && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          {/* Backdrop với hiệu ứng blur và gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-red-50/30 to-purple-50/30 backdrop-blur-sm"
            onClick={() => !deleteLoading && setShowDeleteModal(false)}
          />
          
          {/* Modal container với animation */}
          <div 
            className="relative w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
            style={{
              animation: 'modalAppear 0.3s ease-out'
            }}
          >
            {/* Modal content */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Header với gradient */}
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Xóa Chủ Đề
                    </h3>
                  </div>
                  {!deleteLoading && (
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Warning icon */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-100 rounded-full opacity-75"></div>
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-200 to-red-200 border-4  shadow-lg flex items-center justify-center">
                      <Trash2 className="w-10 h-10 text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Xóa chủ đề "{topicToDelete.name}"?
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Bạn có chắc chắn muốn xóa chủ đề này vĩnh viễn?
                  </p>
                  
                


                  <div className="bg-red-50/50 border-2 border-red-100 rounded-xl p-4 text-left">
                    <div className="flex">
                  
                      <div>
                      
                        <ul className="text-xs text-red-700 space-y-1">
                            <p className="text-sm font-medium text-red-800 mb-1">Cảnh báo quan trọng</p>
                          <li className="flex items-start">
                           
                            <span>Tất cả từ vựng thuộc chủ đề này sẽ bị ảnh hưởng</span>
                          </li>
                        
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-3.5 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl hover:from-gray-200 hover:to-gray-100 disabled:opacity-50 transition-all duration-200 font-medium border border-gray-300 hover:shadow-md flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Hủy bỏ</span>
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-3.5 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang xóa...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        <span>Xóa vĩnh viễn</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicList;