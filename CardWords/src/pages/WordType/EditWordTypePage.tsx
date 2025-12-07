import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { 
  ArrowLeft, 
  Save,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

// Toast Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[type];

  const icon = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  }[type];

  return (
    <div className={`fixed top-20 right-6 z-[9999] transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
      <div className={`${bgColor} text-white rounded-lg shadow-xl p-4 min-w-80 max-w-md flex items-start`}>
        <div className="mr-3 mt-0.5">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-3 text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

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
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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
    } catch (error: any) {
      console.error('Failed to load word type:', error);
      showToast('Không thể tải thông tin loại từ', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    const trimmedName = formData.name.trim();
    
    if (!trimmedName) {
      setValidationError('Vui lòng nhập tên loại từ');
      showToast('Vui lòng nhập tên loại từ', 'error');
      return;
    }

    if (trimmedName.length < 2) {
      setValidationError('Tên loại từ phải có ít nhất 2 ký tự');
      showToast('Tên loại từ phải có ít nhất 2 ký tự', 'error');
      return;
    }

    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      setValidationError('Tên loại từ chỉ được chứa chữ cái, số và khoảng trắng');
      showToast('Tên loại từ chỉ được chứa chữ cái, số và khoảng trắng', 'error');
      return;
    }

    if (trimmedName === currentType?.name) {
      showToast('Không có thay đổi nào để cập nhật', 'warning');
      return;
    }

    try {
      await updateType(parseInt(id!), { name: trimmedName });
      showToast('Cập nhật loại từ thành công!', 'success');
      
      setTimeout(() => {
        navigate('/admin/word-types');
      }, 1000);
      
    } catch (error: any) {
      console.error('Update failed:', error);
      showToast('Cập nhật thất bại. Vui lòng thử lại!', 'error');
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
        {/* Render Toasts */}
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
        
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
      {/* Render Toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

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