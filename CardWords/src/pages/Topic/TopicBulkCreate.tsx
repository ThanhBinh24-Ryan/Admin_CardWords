import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopicStore } from '../../store/topicStore';
import { BulkOperationResult } from '../../types/topic';
import { 
  validateTopicName, 
  validateTopicDescription,
  TOPIC_VALIDATION,
  TOPIC_ERRORS,
  TOPIC_MESSAGES
} from '../../constants/topic';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2
} from 'lucide-react';

interface TopicInput {
  name: string;
  description: string;
  imageUrl: string;
}

const TopicBulkCreate: React.FC = () => {
  const navigate = useNavigate();
  const { bulkCreateTopics, loading, error, clearError } = useTopicStore();

  const [topics, setTopics] = useState<TopicInput[]>([
    { name: '', description: '', imageUrl: '' }
  ]);
  const [results, setResults] = useState<BulkOperationResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [index: number]: { name?: string; description?: string; imageUrl?: string };
  }>({});

  const addTopic = () => {
    setTopics(prev => [...prev, { name: '', description: '', imageUrl: '' }]);
  };

  const removeTopic = (index: number) => {
    if (topics.length > 1) {
      setTopics(prev => prev.filter((_, i) => i !== index));
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        // Reindex errors
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

  const updateTopic = (index: number, field: keyof TopicInput, value: string) => {
    setTopics(prev => prev.map((topic, i) => 
      i === index ? { ...topic, [field]: value } : topic
    ));

    // Clear validation error for this field
    if (validationErrors[index]?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: undefined
        }
      }));
    }
  };

  const validateAllTopics = (): boolean => {
    const errors: typeof validationErrors = {};
    let isValid = true;

    topics.forEach((topic, index) => {
      const topicErrors: { name?: string; description?: string; imageUrl?: string } = {};

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

      if (topicErrors.name || topicErrors.description) {
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

    if (!validateAllTopics()) {
      return;
    }

    try {
      const response = await bulkCreateTopics(topics);
      setResults(response.data);
    } catch (error) {
      console.error('Failed to bulk create topics:', error);
    }
  };

  const downloadTemplate = () => {
    const template = [
      ['Tên chủ đề (bắt buộc)', 'Mô tả (tùy chọn)', 'URL hình ảnh (tùy chọn)'],
      ['Business', 'Chủ đề kinh doanh', 'https://example.com/business.jpg'],
      ['Technology', 'Chủ đề công nghệ', 'https://example.com/tech.jpg'],
      ['Travel', 'Chủ đề du lịch', '']
    ];

    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'topic_bulk_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearForm = () => {
    setTopics([{ name: '', description: '', imageUrl: '' }]);
    setValidationErrors({});
    setResults(null);
    clearError();
  };

  return (
    <div className="space-y-6">
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
        <div className="flex gap-2">
          <button
            onClick={downloadTemplate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Template CSV
          </button>
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
              <div className="grid grid-cols-3 gap-4 text-sm">
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
            </div>
          </div>
        </div>
      )}

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
                        placeholder="Nhập tên chủ đề..."
                      />
                      {validationErrors[index]?.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {validationErrors[index]?.name}
                        </p>
                      )}
                    </div>

                    {/* Description */}
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

                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL hình ảnh
                      </label>
                      <input
                        type="url"
                        value={topic.imageUrl}
                        onChange={(e) => updateTopic(index, 'imageUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || topics.length === 0}
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
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Hướng dẫn sử dụng
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• Nhập thông tin cho từng chủ đề</li>
              <li>• Tên chủ đề là bắt buộc</li>
              <li>• Mô tả tối đa 500 ký tự</li>
              <li>• URL hình ảnh phải là đường dẫn hợp lệ</li>
              <li>• Tối đa 20 chủ đề mỗi lần</li>
            </ul>
          </div>


          {/* Stats */}
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
                <span className="text-gray-600">Có hình ảnh:</span>
                <span className="font-semibold">
                  {topics.filter(t => t.imageUrl.trim()).length}/{topics.length}
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