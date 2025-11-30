import React, { useState, useEffect } from 'react';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { CreateWordTypeRequest } from '../../types/wordType';
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
  CheckCircle2
} from 'lucide-react';

const WordTypeList: React.FC = () => {
  const {
    wordTypes,
    loading,
    error,
    fetchAllTypes,
    createType,
    deleteType,
    clearError
  } = useWordTypeStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newType, setNewType] = useState<CreateWordTypeRequest>({
    name: '',
    description: ''
  });

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

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newType.name.trim()) return;

    try {
      await createType(newType);
      alert('Tạo loại từ thành công!');
      setShowCreateModal(false);
      setNewType({ name: '', description: '' });
      loadWordTypes();
    } catch (error: any) {
      alert('Tạo loại từ thất bại: ' + error.message);
    }
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
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-md flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm Loại từ
            </button>
          </div>
        </div>


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
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-md flex items-center mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm Loại từ Đầu tiên
            </button>
          </div>
        )}

    
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
       
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Plus className="w-6 h-6 text-white mr-3" />
                    <h3 className="text-xl font-bold text-white">
                      Thêm Loại từ Mới
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateType} className="p-6">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tên loại từ *
                    </label>
                    <input
                      type="text"
                      required
                      value={newType.name}
                      onChange={(e) => setNewType(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ví dụ: noun, verb, adjective..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Mô tả (tùy chọn)
                    </label>
                    <textarea
                      value={newType.description}
                      onChange={(e) => setNewType(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Mô tả về loại từ này..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 text-base font-bold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-md"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!newType.name.trim()}
                    className="flex-1 px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Tạo mới
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordTypeList;