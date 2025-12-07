import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { 
  ArrowLeft, 
  Save,
  RefreshCw,
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

const BatchUpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    wordTypes,
    fetchAllTypes,
    updateTypesBatch,
    loading, 
    error, 
    clearError
  } = useWordTypeStore();

  const [editableTypes, setEditableTypes] = useState<Array<{ id: number; name: string; originalName: string }>>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    loadWordTypes();
  }, []);

  useEffect(() => {
    if (wordTypes.length > 0) {
      setEditableTypes(wordTypes.map(type => ({
        id: type.id,
        name: type.name,
        originalName: type.name
      })));
    }
  }, [wordTypes]);

  const loadWordTypes = async () => {
    try {
      await fetchAllTypes();
    } catch (error: any) {
      console.error('Failed to load word types:', error);
      showToast('Không thể tải danh sách loại từ', 'error');
    }
  };

  const handleNameChange = (id: number, newName: string) => {
    const updatedTypes = editableTypes.map(type =>
      type.id === id ? { ...type, name: newName } : type
    );
    setEditableTypes(updatedTypes);
    

    const changesExist = updatedTypes.some(type => type.name !== type.originalName);
    setHasChanges(changesExist);
  };

  const handleReset = () => {
    setEditableTypes(wordTypes.map(type => ({
      id: type.id,
      name: type.name,
      originalName: type.name
    })));
    setHasChanges(false);
    clearError();
    showToast('Đã đặt lại tất cả thay đổi', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    for (const type of editableTypes) {
      const trimmedName = type.name.trim();
      
      if (!trimmedName) {
        showToast(`Tên loại từ ID ${type.id} không được để trống`, 'error');
        return;
      }

      if (trimmedName.length < 2) {
        showToast(`Tên loại từ ID ${type.id} phải có ít nhất 2 ký tự`, 'error');
        return;
      }

      const nameRegex = /^[a-zA-Z0-9\s\-_]+$/;
      if (!nameRegex.test(trimmedName)) {
        showToast(`Tên loại từ ID ${type.id} chỉ được chứa chữ cái, số, khoảng trắng, dấu gạch ngang và gạch dưới`, 'error');
        return;
      }
    }

    const changedTypes = editableTypes.filter(type => type.name !== type.originalName);
    
    if (changedTypes.length === 0) {
      showToast('Không có thay đổi nào để cập nhật', 'warning');
      return;
    }

    try {
      await updateTypesBatch(changedTypes.map(type => ({
        id: type.id,
        name: type.name.trim()
      })));
      
      showToast(`Cập nhật ${changedTypes.length} loại từ thành công!`, 'success');
      
      setTimeout(() => {
        navigate('/admin/word-types');
      }, 1000);
      
    } catch (error: any) {
      console.error('Batch update failed:', error);
      showToast('Cập nhật thất bại. Vui lòng thử lại!', 'error');
    }
  };

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
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-3 rounded-xl shadow-lg">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Cập nhật Hàng loạt
                </h1>
                <p className="text-gray-600 mt-1">
                  Cập nhật nhiều loại từ cùng lúc
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

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Danh sách Loại từ ({editableTypes.length})
                </h2>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={!hasChanges || loading}
                    className="px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Đặt lại
                  </button>
                  <button
                    type="submit"
                    disabled={!hasChanges || loading}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Cập nhật Tất cả
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                {editableTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all"
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="text-sm font-bold text-gray-500">
                        #{type.id}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <input
                        type="text"
                        value={type.name}
                        onChange={(e) => handleNameChange(type.id, e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Nhập tên loại từ..."
                      />
                    </div>
                    
                    <div className="flex-shrink-0">
                      {type.name !== type.originalName ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {hasChanges && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-bold text-green-800">
                        Đã thay đổi {editableTypes.filter(t => t.name !== t.originalName).length} loại từ
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 transition-all"
                    >
                      {loading ? 'Đang cập nhật...' : 'Xác nhận Cập nhật'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchUpdatePage;