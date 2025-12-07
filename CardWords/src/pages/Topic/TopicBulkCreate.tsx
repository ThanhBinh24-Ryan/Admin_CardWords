import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopicStore } from '../../store/topicStore';
import { BulkOperationResult } from '../../types/topic';
import { 
  validateTopicName, 
  validateTopicDescription,
  validateImageFile,
  TOPIC_ERRORS
} from '../../constants/topic';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  Eye,
  Info,
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
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 4000); // Auto close after 4 seconds

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
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  }[type];

  return (
    <div className={`fixed top-13 right-6 z-5000 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
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

interface TopicInput {
  name: string;
  description: string;
  imageFile: File | null;
  imageUrl: string;
  uploading: boolean;
  imagePreview?: string;
}

const TopicBulkCreate: React.FC = () => {
  const navigate = useNavigate();
  const { bulkCreateTopics, uploadImage, loading, error, clearError, topics: existingTopics, fetchTopics } = useTopicStore();

  const [topics, setTopics] = useState<TopicInput[]>([
    { name: '', description: '', imageFile: null, imageUrl: '', uploading: false }
  ]);
  const [results, setResults] = useState<BulkOperationResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [index: number]: { name?: string; description?: string; imageFile?: string };
  }>({});
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const addTopic = () => {
    if (topics.length >= 20) {
      showToast('Tối đa 20 chủ đề mỗi lần tạo', 'warning');
      return;
    }
    setTopics(prev => [...prev, { name: '', description: '', imageFile: null, imageUrl: '', uploading: false }]);
  };

  const removeTopic = (index: number) => {
    if (topics.length > 1) {
      if (topics[index].imagePreview) {
        URL.revokeObjectURL(topics[index].imagePreview!);
      }
      
      setTopics(prev => prev.filter((_, i) => i !== index));
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        Object.keys(newErrors).forEach(key => {
          const numKey = parseInt(key);
          if (numKey > index) {
            newErrors[numKey - 1] = newErrors[numKey];
            delete newErrors[numKey];
          }
        });
        return newErrors;
      });
    }
  };

  const updateTopic = (index: number, field: keyof TopicInput, value: string | File | null | boolean) => {
    setTopics(prev => prev.map((topic, i) => 
      i === index ? { ...topic, [field]: value } : topic
    ));

    if (validationErrors[index]?.[field as keyof typeof validationErrors[number]]) {
      setValidationErrors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: undefined
        }
      }));
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setValidationErrors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          imageFile: validationError
        }
      }));
      showToast(validationError, 'error');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    updateTopic(index, 'uploading', true);
    updateTopic(index, 'imageFile', file);
    updateTopic(index, 'imagePreview', previewUrl);

    try {
      const response = await uploadImage(file);
      
      if (response.status === 'success' || response.status === '200') {
        const imageUrl = response.data?.url;
        if (imageUrl && typeof imageUrl === 'string') {
          updateTopic(index, 'imageUrl', imageUrl);
          showToast('Upload ảnh thành công!', 'success');
        } else {
          throw new Error('Không thể lấy URL ảnh từ response');
        }
      } else {
        throw new Error(response.message || 'Upload thất bại');
      }
    } catch (error: any) {
      console.error('Upload ảnh thất bại:', error);
      setValidationErrors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          imageFile: 'Upload ảnh thất bại: ' + error.message
        }
      }));
      updateTopic(index, 'imageFile', null);
      URL.revokeObjectURL(previewUrl);
      updateTopic(index, 'imagePreview', '');
    } finally {
      updateTopic(index, 'uploading', false);
    }
  };

  const showImagePreview = (url: string, filename: string) => {
    setPreviewImage({ url, name: filename });
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const checkExistingTopics = (topicNames: string[]): string[] => {
    const existingNames = existingTopics.map(topic => topic.name.toLowerCase());
    return topicNames.filter(name => 
      existingNames.includes(name.toLowerCase())
    );
  };

  const validateAllTopics = (): boolean => {
    const errors: typeof validationErrors = {};
    let isValid = true;

    topics.forEach((topic, index) => {
      const topicErrors: { name?: string; description?: string; imageFile?: string } = {};

      const nameError = validateTopicName(topic.name);
      if (nameError) {
        topicErrors.name = nameError;
        isValid = false;
      }

      const isDuplicateInForm = topics.some((t, i) => 
        i !== index && t.name.toLowerCase() === topic.name.toLowerCase()
      );
      if (isDuplicateInForm) {
        topicErrors.name = 'Tên chủ đề bị trùng trong form';
        isValid = false;
      }

      const existingNames = checkExistingTopics([topic.name]);
      if (existingNames.length > 0) {
        topicErrors.name = `Tên chủ đề "${topic.name}" đã tồn tại trong hệ thống`;
        isValid = false;
      }

      const descriptionError = validateTopicDescription(topic.description);
      if (descriptionError) {
        topicErrors.description = descriptionError;
        isValid = false;
      }

      if (topic.imageFile && !topic.imageUrl) {
        topicErrors.imageFile = 'Vui lòng chờ upload ảnh hoàn tất';
        isValid = false;
      }

      if (Object.keys(topicErrors).length > 0) {
        errors[index] = topicErrors;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResults(null);
    setShowDetailedResults(false);

    await fetchTopics();

    if (!validateAllTopics()) {
      return;
    }

    try {
      const topicsData = {
        topics: topics.map(topic => ({
          name: topic.name,
          description: topic.description || null,
          imageUrl: topic.imageUrl || null
        }))
      };

      console.log(' Gửi dữ liệu tạo topic:', topicsData);

      const response = await bulkCreateTopics(topicsData);
      setResults(response.data);
      
      if (response.data.failureCount === 0) {
        topics.forEach(topic => {
          if (topic.imagePreview) {
            URL.revokeObjectURL(topic.imagePreview);
          }
        });
        setTopics([{ name: '', description: '', imageFile: null, imageUrl: '', uploading: false }]);
        setValidationErrors({});
        
        showToast(` Đã tạo thành công ${response.data.successCount} chủ đề!`, 'success');
      } else {
        setShowDetailedResults(true);
        showToast(`Đã tạo ${response.data.successCount} chủ đề thành công, ${response.data.failureCount} chủ đề thất bại`, 'warning');
      }
    } catch (error: any) {
      console.error('Failed to bulk create topics:', error);
      showToast(`Lỗi khi tạo chủ đề: ${error.message || 'Vui lòng thử lại'}`, 'error');
    }
  };

  const clearForm = () => {
    topics.forEach(topic => {
      if (topic.imagePreview) {
        URL.revokeObjectURL(topic.imagePreview);
      }
    });
    setTopics([{ name: '', description: '', imageFile: null, imageUrl: '', uploading: false }]);
    setValidationErrors({});
    setResults(null);
    setShowDetailedResults(false);
    clearError();
  };

  const hasUnuploadedImages = topics.some(topic => topic.imageFile && !topic.imageUrl);
  const isUploading = topics.some(topic => topic.uploading);
  const uploadedCount = topics.filter(topic => topic.imageUrl).length;

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

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl max-h-full overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{previewImage.name}</h3>
              <button
                onClick={closeImagePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img 
                src={previewImage.url} 
                alt="Preview" 
                className="max-w-full max-h-96 object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/admin/topics')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Tạo nhiều chủ đề</h1>
          <p className="text-gray-600">Thêm nhiều chủ đề cùng lúc</p>
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

      {/* Results Summary */}
      {results && (
        <div className={`rounded-lg p-6 ${
          results.failureCount === 0 
            ? 'bg-green-50 border border-green-200' 
            : results.successCount === 0
            ? 'bg-red-50 border border-red-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start">
            {results.failureCount === 0 ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
            ) : results.successCount === 0 ? (
              <XCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                {results.failureCount === 0 
                  ? 'Tạo thành công!' 
                  : results.successCount === 0
                  ? 'Tạo thất bại!'
                  : 'Tạo thành công một phần'
                }
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Tổng yêu cầu:</span>
                  <span className="font-semibold ml-2">{results.totalRequested}</span>
                </div>
                <div>
                  <span className="text-green-600">Thành công:</span>
                  <span className="font-semibold ml-2">{results.successCount}</span>
                </div>
                <div>
                  <span className="text-red-600">Thất bại:</span>
                  <span className="font-semibold ml-2">{results.failureCount}</span>
                </div>
              </div>

              {results.failureCount > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => setShowDetailedResults(!showDetailedResults)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    {showDetailedResults ? 'Ẩn chi tiết' : 'Xem chi tiết lỗi'}
                  </button>

                  {showDetailedResults && (
                    <div className="mt-3 space-y-2">
                      <h4 className="font-medium text-gray-900">Chi tiết kết quả:</h4>
                      {results.results.map((result, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            result.success
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start">
                            {result.success ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className={`font-medium ${
                                result.success ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {result.inputName || `Chủ đề #${index + 1}`}
                              </p>
                              <p className={`text-sm ${
                                result.success ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {result.message}
                              </p>
                              {result.success && result.data && (
                                <p className="text-sm text-green-600 mt-1">
                                  ID: {result.data.id}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-800 font-medium">Lưu ý quan trọng</p>
            <p className="text-yellow-700 text-sm">
              Tên chủ đề phải là duy nhất trong hệ thống<br/>
              Không thể tạo chủ đề trùng tên với các chủ đề đã tồn tại<br/>
              Hệ thống sẽ tự động kiểm tra trùng tên trước khi tạo
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Danh sách chủ đề</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addTopic}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm dòng
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 flex items-center text-sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Xóa hết
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {topics.map((topic, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">Chủ đề #{index + 1}</h3>
                    {topics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên chủ đề *
                      </label>
                      <input
                        type="text"
                        value={topic.name}
                        onChange={(e) => updateTopic(index, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors[index]?.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Nhập tên chủ đề (phải là duy nhất)..."
                      />
                      {validationErrors[index]?.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {validationErrors[index]?.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        value={topic.description}
                        onChange={(e) => updateTopic(index, 'description', e.target.value)}
                        rows={2}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors[index]?.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Nhập mô tả..."
                      />
                      {validationErrors[index]?.description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {validationErrors[index]?.description}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        {topic.description.length}/500 ký tự
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hình ảnh
                      </label>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(index, file);
                          }
                        }}
                        disabled={topic.uploading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      />
                      {validationErrors[index]?.imageFile && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {validationErrors[index]?.imageFile}
                        </p>
                      )}
          
                      <div className="mt-2 space-y-2">
                        {topic.uploading && (
                          <p className="text-sm text-blue-600 flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            Đang upload ảnh...
                          </p>
                        )}
                        
                        {topic.imageFile && !topic.uploading && !topic.imageUrl && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-orange-600">
                              Chưa upload ảnh: {topic.imageFile.name}
                            </p>
                          </div>
                        )}
                        
                        {topic.imageUrl && (
                          <div className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-200">
                            <div className="flex items-center">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                              <span className="text-sm text-green-700">Upload thành công</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => showImagePreview(topic.imageUrl, topic.imageFile?.name || 'Ảnh đã upload')}
                              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Xem ảnh
                            </button>
                          </div>
                        )}

                        {(topic.imagePreview || topic.imageUrl) && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-1">Preview:</p>
                            <div 
                              className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => showImagePreview(
                                topic.imageUrl || topic.imagePreview || '',
                                topic.imageFile?.name || 'Preview'
                              )}
                            >
                              <img 
                                src={topic.imageUrl || topic.imagePreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover hover:opacity-80"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || topics.length === 0 || isUploading || hasUnuploadedImages}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang tạo {topics.length} chủ đề...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Tạo {topics.length} chủ đề
                  </>
                )}
              </button>
              
              {isUploading && (
                <p className="mt-2 text-sm text-blue-600 text-center">
                  Đang upload ảnh, vui lòng chờ...
                </p>
              )}
              
              {hasUnuploadedImages && !isUploading && (
                <p className="mt-2 text-sm text-red-600 text-center">
                  Vui lòng upload ảnh cho tất cả chủ đề trước khi tạo
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Hướng dẫn sử dụng
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>Nhập thông tin cho từng chủ đề</li>
              <li><strong>Tên chủ đề phải là duy nhất</strong></li>
              <li>Mô tả tối đa 500 ký tự</li>
              <li>Chọn ảnh - ảnh sẽ tự động upload</li>
              <li>Xem preview ảnh sau khi upload</li>
              <li>Chờ upload hoàn tất trước khi tạo</li>
              <li>Tối đa 20 chủ đề mỗi lần</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Thống kê</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Số chủ đề:</span>
                <span className="font-semibold">{topics.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Đã nhập tên:</span>
                <span className="font-semibold">
                  {topics.filter(t => t.name.trim()).length}/{topics.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Đang upload:</span>
                <span className="font-semibold">
                  {topics.filter(t => t.uploading).length}/{topics.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Upload thành công:</span>
                <span className="font-semibold">
                  {uploadedCount}/{topics.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicBulkCreate;