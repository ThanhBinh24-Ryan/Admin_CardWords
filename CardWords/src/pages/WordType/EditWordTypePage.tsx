import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { 
  ArrowLeft, 
  Save,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const EditWordTypePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentType, 
    fetchTypeById, 
    updateType,
    loading, 
    error, 
    clearError,
    clearCurrentType 
  } = useWordTypeStore();

  const [formData, setFormData] = useState({
    name: '',
  });
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadWordType(parseInt(id));
    }

    return () => {
      clearCurrentType();
      clearError();
    };
  }, [id]);

  useEffect(() => {
    if (currentType) {
      setFormData({
        name: currentType.name,
      });
    }
  }, [currentType]);

  const loadWordType = async (typeId: number) => {
    try {
      await fetchTypeById(typeId);
    } catch (error) {
      console.error('Failed to load word type:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    const trimmedName = formData.name.trim();
    
    if (!trimmedName) {
      setValidationError('Vui lòng nhập tên loại từ');
      return;
    }

    if (trimmedName.length < 2) {
      setValidationError('Tên loại từ phải có ít nhất 2 ký tự');
      return;
    }

    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      setValidationError('Tên loại từ chỉ được chứa chữ cái, số và khoảng trắng');
      return;
    }

    try {
      await updateType(parseInt(id!), { name: trimmedName });
      alert('Cập nhật loại từ thành công!');
      navigate('/admin/word-types');
    } catch (error: any) {
      console.error(' Update failed:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'name' && (validationError || error)) {
      setValidationError('');
      clearError();
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
                <Tag className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Chỉnh sửa Loại từ
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

        {validationError && (
          <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-700 px-6 py-4 rounded-xl mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Lỗi nhập liệu</p>
              <p className="text-sm">{validationError}</p>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Tên Loại từ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ví dụ: noun, verb, adjective, adverb..."
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Chỉ sử dụng chữ cái, số và khoảng trắng. Ví dụ: "noun", "verb", "adjective"
                </p>
              </div>

              {formData.name.trim() && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                    Xem trước
                  </h3>
                  
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-600">Tên loại từ:</span>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        {formData.name.trim()}
                      </span>
                    </div>
                  </div>
                  
                  {currentType?.description && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Mô tả (không thể chỉnh sửa):</span>
                      <p className="mt-1 text-gray-700">{currentType.description}</p>
                    </div>
                  )}
                </div>
              )}

              {currentType && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Thông tin hiện tại</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">ID:</span>
                      <span className="text-gray-900">#{currentType.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Tên gốc:</span>
                      <span className="text-gray-900">{currentType.name}</span>
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
                  type="button"
                  onClick={() => navigate('/admin/word-types')}
                  disabled={loading}
                  className="flex-1 px-8 py-4 text-lg font-bold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!formData.name.trim() || loading || formData.name === currentType?.name}
                  className="flex-1 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Cập nhật
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditWordTypePage;