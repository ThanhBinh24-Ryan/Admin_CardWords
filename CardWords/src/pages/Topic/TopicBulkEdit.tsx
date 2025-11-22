import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopicStore } from '../../store/topicStore';
import { Topic, BulkOperationResult } from '../../types/topic';
import { 
  validateTopicName, 
  validateTopicDescription,
  validateImageFile,
  TOPIC_ERRORS
} from '../../constants/topic';
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  Edit,
  Info,
  Eye,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface TopicEdit extends Topic {
  edited: boolean;
  originalName: string;
  originalDescription: string;
  originalImg: string;
  imageFile: File | null;
  uploading: boolean;
  imagePreview?: string;
}

const TopicBulkEdit: React.FC = () => {
  const navigate = useNavigate();
  const { 
    topics, 
    loading, 
    error, 
    fetchTopics, 
    bulkUpdateTopics, 
    uploadImage,
    clearError 
  } = useTopicStore();

  const [editableTopics, setEditableTopics] = useState<TopicEdit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<BulkOperationResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [id: number]: { name?: string; description?: string; imageFile?: string };
  }>({});
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    if (topics.length > 0) {
      setEditableTopics(
        topics.map(topic => ({
          ...topic,
          edited: false,
          originalName: topic.name,
          originalDescription: topic.description,
          originalImg: topic.img,
          imageFile: null,
          uploading: false,
          imagePreview: topic.img || undefined
        }))
      );
    }
  }, [topics]);

  const loadTopics = async () => {
    try {
      await fetchTopics();
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const handleImageUpload = async (topicId: number, file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setValidationErrors(prev => ({
        ...prev,
        [topicId]: {
          ...prev[topicId],
          imageFile: validationError
        }
      }));
      return;
    }

    // Tạo preview URL
    const previewUrl = URL.createObjectURL(file);

    // Set uploading state và preview
    setEditableTopics(prev =>
      prev.map(topic =>
        topic.id === topicId
          ? {
              ...topic,
              uploading: true,
              imageFile: file,
              imagePreview: previewUrl,
              edited: true
            }
          : topic
      )
    );

    try {
      const response = await uploadImage(file);
      
      if (response.status === 'success' || response.status === '200') {
        const imageUrl = response.data?.url;
        if (imageUrl && typeof imageUrl === 'string') {
          setEditableTopics(prev =>
            prev.map(topic =>
              topic.id === topicId
                ? {
                    ...topic,
                    img: imageUrl,
                    uploading: false
                  }
                : topic
            )
          );
          console.log('✅ Upload thành công:', imageUrl);
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
        [topicId]: {
          ...prev[topicId],
          imageFile: 'Upload ảnh thất bại: ' + error.message
        }
      }));
      // Clean up preview URL on error
      URL.revokeObjectURL(previewUrl);
      setEditableTopics(prev =>
        prev.map(topic =>
          topic.id === topicId
            ? {
                ...topic,
                imageFile: null,
                uploading: false,
                imagePreview: topic.originalImg || undefined
              }
            : topic
        )
      );
    }
  };

  const showImagePreview = (url: string, filename: string) => {
    setPreviewImage({ url, name: filename });
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const updateTopic = (id: number, field: 'name' | 'description', value: string) => {
    setEditableTopics(prev =>
      prev.map(topic =>
        topic.id === id
          ? {
              ...topic,
              [field]: value,
              edited: field === 'name' ? value !== topic.originalName :
                      field === 'description' ? value !== topic.originalDescription : topic.edited
            }
          : topic
      )
    );

    // Clear validation error
    if (validationErrors[id]?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: undefined
        }
      }));
    }
  };

  const resetTopic = (id: number) => {
    setEditableTopics(prev =>
      prev.map(topic =>
        topic.id === id
          ? {
              ...topic,
              name: topic.originalName,
              description: topic.originalDescription,
              img: topic.originalImg,
              edited: false,
              imageFile: null,
              uploading: false,
              imagePreview: topic.originalImg || undefined
            }
          : topic
      )
    );

    // Clear validation errors for this topic
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const resetAll = () => {
    setEditableTopics(prev =>
      prev.map(topic => ({
        ...topic,
        name: topic.originalName,
        description: topic.originalDescription,
        img: topic.originalImg,
        edited: false,
        imageFile: null,
        uploading: false,
        imagePreview: topic.originalImg || undefined
      }))
    );
    setValidationErrors({});
  };

  const validateAllTopics = (): boolean => {
    const errors: typeof validationErrors = {};
    let isValid = true;

    editableTopics.forEach(topic => {
      if (topic.edited) {
        const topicErrors: { name?: string; description?: string; imageFile?: string } = {};

        // Validate name và description
        const nameError = validateTopicName(topic.name);
        if (nameError) {
          topicErrors.name = nameError;
          isValid = false;
        }

        const descriptionError = validateTopicDescription(topic.description);
        if (descriptionError) {
          topicErrors.description = descriptionError;
          isValid = false;
        }

        // Validate image upload
        if (topic.imageFile && topic.uploading) {
          topicErrors.imageFile = 'Vui lòng chờ upload ảnh hoàn tất';
          isValid = false;
        }

        if (Object.keys(topicErrors).length > 0) {
          errors[topic.id] = topicErrors;
        }
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

    if (!validateAllTopics()) {
      return;
    }

    const topicsToUpdate = editableTopics
      .filter(topic => topic.edited)
      .map(topic => ({
        id: topic.id,
        name: topic.name !== topic.originalName ? topic.name : undefined,
        description: topic.description !== topic.originalDescription ? topic.description : undefined,
        imageUrl: topic.img !== topic.originalImg ? topic.img : undefined
      }));

    if (topicsToUpdate.length === 0) {
      alert('Không có thay đổi nào để cập nhật');
      return;
    }

    try {
      const response = await bulkUpdateTopics({ topics: topicsToUpdate });
      setResults(response.data);
      
      if (response.data.failureCount === 0) {
        // Clean up all preview URLs
        editableTopics.forEach(topic => {
          if (topic.imageFile && topic.imagePreview && topic.imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(topic.imagePreview);
          }
        });
        
        // Reload topics to get updated data
        await loadTopics();
        
        setTimeout(() => {
          alert(`🎉 Đã cập nhật thành công ${response.data.successCount} chủ đề!`);
        }, 500);
      } else {
        // Hiển thị chi tiết lỗi nếu có thất bại
        setShowDetailedResults(true);
      }
    } catch (error: any) {
      console.error('Failed to bulk update topics:', error);
      if (error.message) {
        alert(`Lỗi khi cập nhật chủ đề: ${error.message}`);
      }
    }
  };

  const filteredTopics = editableTopics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const editedCount = editableTopics.filter(topic => topic.edited).length;
  const isUploading = editableTopics.some(topic => topic.uploading);

  return (
    <div className="space-y-6">
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
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa hàng loạt</h1>
          <p className="text-gray-600">Cập nhật nhiều chủ đề cùng lúc</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadTopics}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Lỗi khi cập nhật</p>
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
                  ? 'Cập nhật thành công!' 
                  : results.successCount === 0
                  ? 'Cập nhật thất bại!'
                  : 'Cập nhật thành công một phần'
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

              {/* Nút xem chi tiết kết quả */}
              {results.failureCount > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => setShowDetailedResults(!showDetailedResults)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    {showDetailedResults ? 'Ẩn chi tiết' : 'Xem chi tiết lỗi'}
                  </button>

                  {/* Chi tiết kết quả */}
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
                                {result.inputName || `Chủ đề #${result.inputId || index + 1}`}
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

      {/* Warning về upload ảnh */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Loader2 className="w-5 h-5 text-blue-600 mr-2 mt-0.5 animate-spin flex-shrink-0" />
            <div>
              <p className="text-blue-800 font-medium">Đang upload ảnh</p>
              <p className="text-blue-700 text-sm">
                Vui lòng chờ upload ảnh hoàn tất trước khi cập nhật
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm chủ đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{editedCount}</div>
                  <div className="text-gray-600">Đã chỉnh sửa</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{filteredTopics.length}</div>
                  <div className="text-gray-600">Tổng số</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {editableTopics.filter(t => t.uploading).length}
                  </div>
                  <div className="text-gray-600">Đang upload</div>
                </div>
              </div>
            </div>
          </div>

          {/* Topics List */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chủ đề
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mô tả
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hình ảnh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTopics.map((topic) => (
                      <tr key={topic.id} className={topic.edited ? 'bg-blue-50' : ''}>
                        {/* Image and ID */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="relative">
                              <img
                                src={topic.imagePreview || topic.img || '/default-topic.jpg'}
                                alt={topic.name}
                                className="w-10 h-10 rounded-lg object-cover mr-3"
                              />
                              {topic.uploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">#{topic.id}</div>
                              {topic.edited && (
                                <div className="text-xs text-blue-600 font-medium">Đã chỉnh sửa</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4">
                          <div>
                            <input
                              type="text"
                              value={topic.name}
                              onChange={(e) => updateTopic(topic.id, 'name', e.target.value)}
                              className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                                validationErrors[topic.id]?.name ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {validationErrors[topic.id]?.name && (
                              <p className="mt-1 text-xs text-red-600">
                                {validationErrors[topic.id]?.name}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4">
                          <div>
                            <textarea
                              value={topic.description}
                              onChange={(e) => updateTopic(topic.id, 'description', e.target.value)}
                              rows={2}
                              className={`w-full px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                                validationErrors[topic.id]?.description ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {validationErrors[topic.id]?.description && (
                              <p className="mt-1 text-xs text-red-600">
                                {validationErrors[topic.id]?.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {topic.description.length}/500
                            </p>
                          </div>
                        </td>

                        {/* Image Upload */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(topic.id, file);
                                  }
                                }}
                                disabled={topic.uploading}
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50"
                              />
                              {validationErrors[topic.id]?.imageFile && (
                                <p className="mt-1 text-xs text-red-600">
                                  {validationErrors[topic.id]?.imageFile}
                                </p>
                              )}
                            </div>
                            
                            {/* Upload Status & Preview */}
                            <div className="space-y-1">
                              {topic.uploading && (
                                <p className="text-xs text-blue-600 flex items-center">
                                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                  Đang upload...
                                </p>
                              )}
                              
                              {(topic.imagePreview || topic.img) && (
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-8 h-8 border border-gray-300 rounded overflow-hidden cursor-pointer"
                                    onClick={() => showImagePreview(
                                      topic.imagePreview || topic.img || '',
                                      `Ảnh chủ đề ${topic.name}`
                                    )}
                                  >
                                    <img 
                                      src={topic.imagePreview || topic.img} 
                                      alt="Preview" 
                                      className="w-full h-full object-cover hover:opacity-80"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => showImagePreview(
                                      topic.imagePreview || topic.img || '',
                                      `Ảnh chủ đề ${topic.name}`
                                    )}
                                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Xem
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {topic.edited && (
                              <button
                                type="button"
                                onClick={() => resetTopic(topic.id)}
                                className="text-red-600 hover:text-red-800 text-sm flex items-center"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Hủy
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Submit Section */}
              {editedCount > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <strong>{editedCount}</strong> chủ đề đã được chỉnh sửa
                      {isUploading && (
                        <span className="text-orange-600 ml-2">
                          • Đang upload ảnh, vui lòng chờ...
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={resetAll}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Hủy tất cả
                      </button>
                      <button
                        type="submit"
                        disabled={loading || isUploading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Đang cập nhật...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Cập nhật {editedCount} chủ đề
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Empty State */}
          {filteredTopics.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy chủ đề
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Thử điều chỉnh từ khóa tìm kiếm' : 'Chưa có chủ đề nào'}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Edit className="w-4 h-4 mr-2" />
              Hướng dẫn
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• Chỉnh sửa trực tiếp trong bảng</li>
              <li>• Các thay đổi sẽ được đánh dấu màu xanh</li>
              <li>• Upload ảnh mới thay thế ảnh cũ</li>
              <li>• Chờ upload hoàn tất trước khi cập nhật</li>
              <li>• Nhấn "Hủy" để hoàn tác thay đổi</li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Thống kê nhanh</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng chủ đề:</span>
                <span className="font-semibold">{topics.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600">Đang chỉnh sửa:</span>
                <span className="font-semibold">{editedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-600">Đang upload:</span>
                <span className="font-semibold">
                  {editableTopics.filter(t => t.uploading).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Chưa thay đổi:</span>
                <span className="font-semibold">{topics.length - editedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicBulkEdit;