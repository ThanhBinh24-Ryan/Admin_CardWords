import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabStore } from '../../store/vocabStore';
import { useTopicStore } from '../../store/topicStore';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { CreateVocabRequest } from '../../types/vocab';
import { CEFR_LEVELS } from '../../constants/vocabConstants';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Loader2,
  BookOpen,
  Volume2,
  Image as ImageIcon
} from 'lucide-react';

const CreateVocab: React.FC = () => {
  const navigate = useNavigate();
  const { createVocab, loading } = useVocabStore();
  const { topics, fetchTopics } = useTopicStore();
  const { wordTypes, fetchAllTypes } = useWordTypeStore();

  const [formData, setFormData] = useState<CreateVocabRequest>({
    word: '',
    transcription: '',
    meaningVi: '',
    interpret: '',
    exampleSentence: '',
    cefr: 'A1',
    types: [],
    topic: '',
    credit: '',
    img: '',
    audio: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchTopics(), fetchAllTypes()]);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, [fetchTopics, fetchAllTypes]);

  const handleInputChange = (field: keyof CreateVocabRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypesChange = (type: string, checked: boolean) => {
    setFormData(prev => {
      const currentTypes = prev.types || [];
      const newTypes = checked 
        ? [...currentTypes, type]
        : currentTypes.filter(t => t !== type);
      return { ...prev, types: newTypes };
    });
  };

  const validateForm = (): boolean => {
    if (!formData.word.trim()) {
      setError('Vui lòng nhập từ vựng');
      return false;
    }
    if (!formData.meaningVi.trim()) {
      setError('Vui lòng nhập nghĩa tiếng Việt');
      return false;
    }
    if (!formData.interpret.trim()) {
      setError('Vui lòng nhập định nghĩa tiếng Anh');
      return false;
    }
    if (!formData.exampleSentence.trim()) {
      setError('Vui lòng nhập câu ví dụ');
      return false;
    }
    if (formData.types.length === 0) {
      setError('Vui lòng chọn ít nhất một loại từ');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    try {
      await createVocab(formData);
      setSuccess('Tạo từ vựng mới thành công!');
      
      // Reset form after success
      setFormData({
        word: '',
        transcription: '',
        meaningVi: '',
        interpret: '',
        exampleSentence: '',
        cefr: 'A1',
        types: [],
        topic: '',
        credit: '',
        img: '',
        audio: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/vocabs');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo từ vựng');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implement image upload logic here
    console.log('Image upload:', e.target.files);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implement audio upload logic here
    console.log('Audio upload:', e.target.files);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/vocabs')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-all transform hover:translate-x-[-4px] group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            <span className="font-medium">Quay lại danh sách</span>
          </button>
          
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Thêm Từ Vựng Mới
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Tạo từ vựng mới cho hệ thống học tập
            </p>
          </div>
        </div>

        {/* Error & Success Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start shadow-lg">
            <X className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Có lỗi xảy ra</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-start shadow-lg">
            <X className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Thành công!</p>
              <p className="text-sm">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Word */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ vựng *
                </label>
                <input
                  type="text"
                  value={formData.word}
                  onChange={(e) => handleInputChange('word', e.target.value)}
                  placeholder="Nhập từ vựng..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                  required
                />
              </div>

              {/* Transcription */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phiên âm
                </label>
                <input
                  type="text"
                  value={formData.transcription}
                  onChange={(e) => handleInputChange('transcription', e.target.value)}
                  placeholder="/phiên/âm/"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* CEFR Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cấp độ CEFR *
                </label>
                <select
                  value={formData.cefr}
                  onChange={(e) => handleInputChange('cefr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {CEFR_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Meaning Vietnamese */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nghĩa tiếng Việt *
                </label>
                <input
                  type="text"
                  value={formData.meaningVi}
                  onChange={(e) => handleInputChange('meaningVi', e.target.value)}
                  placeholder="Nhập nghĩa tiếng Việt..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Word Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Loại từ *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {wordTypes.map(type => (
                  <label key={type.id} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={formData.types.includes(type.name)}
                      onChange={(e) => handleTypesChange(type.name, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interpret */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Định nghĩa tiếng Anh *
              </label>
              <textarea
                value={formData.interpret}
                onChange={(e) => handleInputChange('interpret', e.target.value)}
                placeholder="Định nghĩa và giải thích cách dùng từ..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                required
              />
            </div>

            {/* Example Sentence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Câu ví dụ *
              </label>
              <textarea
                value={formData.exampleSentence}
                onChange={(e) => handleInputChange('exampleSentence', e.target.value)}
                placeholder="Câu ví dụ thể hiện cách dùng từ..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                required
              />
            </div>

            {/* Topic and Credit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ đề
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Chọn chủ đề</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.name}>{topic.name}</option>
                  ))}
                </select>
              </div>

              {/* Credit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nguồn tham khảo
                </label>
                <input
                  type="text"
                  value={formData.credit}
                  onChange={(e) => handleInputChange('credit', e.target.value)}
                  placeholder="Oxford, Cambridge, Merriam-Webster..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Media Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-all cursor-pointer">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Tải lên hình ảnh</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                    Chọn file
                  </label>
                </div>
              </div>

              {/* Audio Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phát âm
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-all cursor-pointer">
                  <Volume2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Tải lên file âm thanh</p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                    Chọn file
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/vocabs')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Tạo từ vựng
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateVocab;