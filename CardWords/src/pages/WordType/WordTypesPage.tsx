import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { WORD_TYPE_COLORS } from '../../constants/wordTypes';
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X,
  Loader2,
  AlertCircle,
  Eye
} from 'lucide-react';

const WordTypesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    wordTypes,
    loading,
    error,
    fetchAllTypes,
    deleteType,
    clearError
  } = useWordTypeStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWordTypes();
  }, []);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const loadWordTypes = async () => {
    try {
      await fetchAllTypes();
    } catch (error) {
      console.error('Failed to load word types:', error);
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/admin/word-types/${id}`);
  };

  const handleEditType = (id: number) => {
    navigate(`/admin/word-types/${id}/edit`);
  };

  const handleCreateNew = () => {
    navigate('/admin/word-types/create');
  };

  const handleDeleteType = async (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa loại từ "${name}"?`)) {
      try {
        await deleteType(id);
        alert('Xóa loại từ thành công!');
        loadWordTypes();
      } catch (error: any) {
        alert('Xóa loại từ thất bại: ' + error.message);
      }
    }
  };

  const filteredTypes = wordTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (typeName: string) => {
    return WORD_TYPE_COLORS[typeName.toLowerCase()] || WORD_TYPE_COLORS.default;
  };

  if (loading && wordTypes.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] space-y-4">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">Đang tải danh sách loại từ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg mb-4">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quản lý Loại từ
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý các loại từ trong hệ thống (noun, verb, adjective...)
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start justify-between shadow-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Có lỗi xảy ra</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900 font-medium ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Search and Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Tìm kiếm loại từ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-md flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm Loại từ
            </button>
          </div>
        </div>

        {/* Word Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getTypeColor(type.name)} text-white shadow-md`}>
                    {type.name}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewDetails(type.id)}
                      className="p-1 text-blue-600 hover:text-blue-900 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditType(type.id)}
                      className="p-1 text-green-600 hover:text-green-900 rounded-lg bg-green-50 hover:bg-green-100 transition-all"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteType(type.id, type.name)}
                      className="p-1 text-red-600 hover:text-red-900 rounded-lg bg-red-50 hover:bg-red-100 transition-all"
                      title="Xóa loại từ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
            
                
                <div className="text-xs text-gray-500 font-medium">
                  ID: {type.id}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTypes.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'Không tìm thấy loại từ phù hợp' : 'Chưa có loại từ nào'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Thử điều chỉnh từ khóa tìm kiếm' : 'Bắt đầu bằng cách thêm loại từ mới'}
            </p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-md flex items-center mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm Loại từ Đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordTypesPage;