import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { CreateWordTypeRequest } from '../../types/wordType';
import { 
  ArrowLeft, 
  Save, 
  Tag,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const CreateWordTypePage: React.FC = () => {
  const navigate = useNavigate();
  const { createType, loading, error, clearError } = useWordTypeStore();
  
  const [formData, setFormData] = useState<CreateWordTypeRequest>({
    name: '',
    description: ''
  });

  const [validationError, setValidationError] = useState<string>('');

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

    const submitData: CreateWordTypeRequest = {
      name: trimmedName,
      description: formData.description?.trim() || undefined 
    };

    console.log('🎯 Final submit data:', submitData);

    try {
      const result = await createType(submitData);
      console.log(' Create success:', result);
      alert('Tạo loại từ thành công!');
      navigate('/admin/word-types');
    } catch (error: any) {
      console.error(' Create failed:', error);
      if (error.message.includes('Tên loại từ không được để trống')) {
        setValidationError('Tên loại từ không được để trống. Vui lòng kiểm tra lại.');
      }
    }
  };

  const handleChange = (field: keyof CreateWordTypeRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
 
    if (field === 'name' && (validationError || error)) {
      setValidationError('');
      clearError();
    }
  };

  const trySampleData = (sampleName: string, sampleDesc: string = '') => {
    setFormData({
      name: sampleName,
      description: sampleDesc
    });
    setValidationError('');
    clearError();
  };

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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tạo Loại từ Mới
                </h1>
                <p className="text-gray-600 mt-1">
                  Thêm loại từ mới vào hệ thống
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-6 py-4 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Debug: Thử với dữ liệu mẫu</p>
              <p className="text-sm">Click để tự động điền form</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => trySampleData('noun', 'Danh từ')}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-all"
              >
                noun
              </button>
              <button
                onClick={() => trySampleData('verb', 'Động từ')}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-all"
              >
                verb
              </button>
              <button
                onClick={() => trySampleData('adjective', 'Tính từ')}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-all"
              >
                adjective
              </button>
            </div>
          </div>
        </div> */}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Lỗi từ server</p>
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

             
              {/* <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về loại từ này... Ví dụ: Danh từ dùng để chỉ người, vật, sự việc..."
                  rows={4}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  disabled={loading}
                />
              </div> */}

          
              {(formData.name.trim() || formData.description?.trim()) && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                    Xem trước
                  </h3>
                  
                  {formData.name.trim() && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-600">Tên loại từ:</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {formData.name.trim()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {formData.description?.trim() && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Mô tả:</span>
                      <p className="mt-1 text-gray-700">{formData.description.trim()}</p>
                    </div>
                  )}
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
                  disabled={!formData.name.trim() || loading}
                  className="flex-1 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Tạo Loại từ
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

export default CreateWordTypePage;