import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopicStore } from '../../store/topicStore';
import { TopicFormData } from '../../types/topic';
import { 
  validateTopicName, 
  validateTopicDescription, 
  validateImageFile,
  TOPIC_VALIDATION,
  TOPIC_ERRORS 
} from '../../constants/topic';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Toast Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
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

const TopicCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createTopic, loading, error, clearError } = useTopicStore();

  const [formData, setFormData] = useState<TopicFormData>({
    name: '',
    description: '',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
    image?: string;
  }>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageError = validateImageFile(file);
      if (imageError) {
        setValidationErrors(prev => ({ ...prev, image: imageError }));
        showToast(imageError, 'error');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setValidationErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewUrl('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    const nameError = validateTopicName(formData.name);
    if (nameError) errors.name = nameError;

    const descriptionError = validateTopicDescription(formData.description);
    if (descriptionError) errors.description = descriptionError;

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      showToast('Vui lòng kiểm tra lại thông tin đã nhập', 'error');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await createTopic(formData);
      showToast('Tạo chủ đề thành công!', 'success');
      
      setTimeout(() => {
        navigate('/admin/topics');
      }, 1000);
      
    } catch (error: any) {
      console.error('Failed to create topic:', error);
      showToast('Tạo chủ đề thất bại. Vui lòng thử lại!', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Render Toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/admin/topics')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Tạo chủ đề mới</h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Lỗi khi tạo chủ đề</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Tên chủ đề *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập tên chủ đề..."
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập mô tả cho chủ đề..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.description}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/500 ký tự
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <div className="space-y-4">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Kéo thả hình ảnh hoặc click để chọn
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
                    >
                      Chọn hình ảnh
                    </label>
                  </div>
                )}
                {validationErrors.image && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.image}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Định dạng hỗ trợ: JPEG, PNG, GIF, WebP. Tối đa 5MB.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-gray-50 rounded-lg p-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Tạo chủ đề
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TopicCreate;