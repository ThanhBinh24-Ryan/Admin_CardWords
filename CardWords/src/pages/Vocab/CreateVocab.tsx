import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabStore } from '../../store/vocabStore';
import { useTopicStore } from '../../store/topicStore';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { CEFR_LEVELS } from '../../constants/vocabConstants';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Loader2,
  BookOpen,
  Type,
  Award,
  Tag,
  MessageSquare,
  FileText,
  Bookmark,
  Image as ImageIcon,
  Volume2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface FormData {
  word: string;
  transcription: string;
  meaningVi: string;
  interpret: string;
  exampleSentence: string;
  cefr: string;
  types: string[];
  topic: string;
  credit: string;
  img: string;
  audio: string;
  imageFile?: File | null;
  audioFile?: File | null;
  imagePreview?: string;
}

const CreateVocab: React.FC = () => {
  const navigate = useNavigate();
  const { createVocab, loading, uploadImage, uploadAudio } = useVocabStore();
  const { topics, fetchTopics } = useTopicStore();
  const { wordTypes, fetchAllTypes } = useWordTypeStore();

  const [formData, setFormData] = useState<FormData>({
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
    audio: '',
    imageFile: null,
    audioFile: null,
    imagePreview: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        await Promise.all([fetchTopics(), fetchAllTypes()]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu cần thiết');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [fetchTopics, fetchAllTypes]);

  const handleInputChange = (field: keyof FormData, value: string) => {
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

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, imageFile: file, imagePreview: previewUrl }));

    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, img: imageUrl }));
    } catch (error: any) {
      console.error('Image upload failed:', error);
      setError(`Lỗi upload ảnh: ${error.message}`);
      setFormData(prev => ({ ...prev, imageFile: null, imagePreview: '' }));
      URL.revokeObjectURL(previewUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAudioUpload = async (file: File) => {
    setUploadingAudio(true);
    setFormData(prev => ({ ...prev, audioFile: file }));

    try {
      const audioUrl = await uploadAudio(file);
      setFormData(prev => ({ ...prev, audio: audioUrl }));
    } catch (error: any) {
      console.error('Audio upload failed:', error);
      setError(`Lỗi upload audio: ${error.message}`);
      setFormData(prev => ({ ...prev, audioFile: null }));
    } finally {
      setUploadingAudio(false);
    }
  };

  const removeImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      imagePreview: '',
      img: ''
    }));
  };

  const removeAudio = () => {
    setFormData(prev => ({
      ...prev,
      audioFile: null,
      audio: ''
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.word.trim()) errors.push('Từ vựng là bắt buộc');
    if (!formData.meaningVi.trim()) errors.push('Nghĩa tiếng Việt là bắt buộc');
    if (!formData.interpret.trim()) errors.push('Định nghĩa tiếng Anh là bắt buộc');
    if (!formData.exampleSentence.trim()) errors.push('Câu ví dụ là bắt buộc');
    if (!formData.cefr) errors.push('Cấp độ CEFR là bắt buộc');
    if (formData.types.length === 0) errors.push('Ít nhất một loại từ là bắt buộc');

    if (uploadingImage || uploadingAudio) {
      errors.push('File đang được upload, vui lòng chờ');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
   
      if (formData.imageFile && !formData.img) {
        await handleImageUpload(formData.imageFile);
      }
      if (formData.audioFile && !formData.audio) {
        await handleAudioUpload(formData.audioFile);
      }

     
      const submitData = {
        word: formData.word.trim(),
        transcription: formData.transcription.trim() || undefined,
        meaningVi: formData.meaningVi.trim(),
        interpret: formData.interpret.trim(),
        exampleSentence: formData.exampleSentence.trim(),
        cefr: formData.cefr,
        types: formData.types,
        topic: formData.topic.trim() || undefined,
        credit: formData.credit.trim() || undefined,
        img: formData.img || undefined,
        audio: formData.audio || undefined
      };

      await createVocab(submitData);
      setSuccess('Tạo từ vựng thành công!');
      
    
      setTimeout(() => {
        navigate('/admin/vocabs');
      }, 1500);
    } catch (err: any) {
      console.error('Create vocab error:', err);
      setError(err.message || 'Lỗi khi tạo từ vựng');
    }
  };

  const getTypeBadge = (type: string) => {
    const typeColors: { [key: string]: string } = {
      'noun': 'bg-blue-100 text-blue-800 border-blue-200',
      'verb': 'bg-red-100 text-red-800 border-red-200',
      'adjective': 'bg-green-100 text-green-800 border-green-200',
      'adverb': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'preposition': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'conjunction': 'bg-purple-100 text-purple-800 border-purple-200',
      'interjection': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${typeColors[type] || 'bg-gray-100 text-gray-800'} flex items-center`}>
        <Type className="w-3 h-3 mr-1" />
        {type}
      </span>
    );
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
   
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/vocabs')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-all transform hover:translate-x-[-4px] group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            <span className="font-medium">Quay lại danh sách</span>
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tạo Từ Vựng Mới
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Thêm từ vựng mới vào hệ thống</p>
          </div>
        </div>

   
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start shadow-lg">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Có lỗi xảy ra</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-start shadow-lg">
            <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Thành công!</p>
              <p className="text-sm">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
         
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Type className="w-4 h-4 mr-2" />
                  Từ Vựng *
                </label>
                <input
                  type="text"
                  value={formData.word}
                  onChange={(e) => handleInputChange('word', e.target.value)}
                  placeholder="Nhập từ vựng..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

          
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Phiên Âm
                </label>
                <input
                  type="text"
                  value={formData.transcription}
                  onChange={(e) => handleInputChange('transcription', e.target.value)}
                  placeholder="/phiên/âm/"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

          
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Nghĩa Tiếng Việt *
                </label>
                <input
                  type="text"
                  value={formData.meaningVi}
                  onChange={(e) => handleInputChange('meaningVi', e.target.value)}
                  placeholder="Nghĩa tiếng Việt..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Cấp độ CEFR *
                </label>
                <select
                  value={formData.cefr}
                  onChange={(e) => handleInputChange('cefr', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Chọn CEFR</option>
                  {CEFR_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Loại Từ *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {wordTypes.map(type => (
                  <label key={type.id} className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.types.includes(type.name)}
                      onChange={(e) => handleTypesChange(type.name, e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type.name}</span>
                  </label>
                ))}
              </div>
              {formData.types.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.types.map(type => (
                    <div key={type}>{getTypeBadge(type)}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Định Nghĩa Tiếng Anh *
                </label>
                <textarea
                  value={formData.interpret}
                  onChange={(e) => handleInputChange('interpret', e.target.value)}
                  placeholder="Định nghĩa và giải thích cách dùng..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  required
                />
              </div>

            
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Câu Ví Dụ *
                </label>
                <textarea
                  value={formData.exampleSentence}
                  onChange={(e) => handleInputChange('exampleSentence', e.target.value)}
                  placeholder="Câu ví dụ thể hiện cách dùng từ..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  required
                />
              </div>
            </div>

     
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Chủ Đề
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Chọn chủ đề</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.name}>{topic.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Nguồn Tham Khảo
                </label>
                <input
                  type="text"
                  value={formData.credit}
                  onChange={(e) => handleInputChange('credit', e.target.value)}
                  placeholder="Oxford, Cambridge, Merriam-Webster..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

      
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Hình ảnh
                  {uploadingImage && (
                    <Loader2 className="w-3 h-3 ml-2 animate-spin text-blue-600" />
                  )}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-all cursor-pointer">
                  {formData.imagePreview || formData.img ? (
                    <div className="space-y-3">
                      <img 
                        src={formData.imagePreview || formData.img} 
                        alt="Preview" 
                        className="h-32 mx-auto object-cover rounded-lg" 
                      />
                      <div className="flex justify-center space-x-2">
                        <button
                          type="button"
                          onClick={removeImage}
                          className="flex items-center justify-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Xóa ảnh
                        </button>
                      </div>
                      {formData.img && (
                        <div className="bg-green-50 border border-green-200 rounded p-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mb-1" />
                          <p className="text-xs text-green-700">Đã upload thành công</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Tải lên hình ảnh</p>
                        <p className="text-xs text-blue-600 hover:text-blue-700 flex items-center justify-center mt-1">
                          <Upload className="w-3 h-3 mr-1" />
                          Chọn file
                        </p>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Phát âm
                  {uploadingAudio && (
                    <Loader2 className="w-3 h-3 ml-2 animate-spin text-blue-600" />
                  )}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-all cursor-pointer">
                  {formData.audioFile || formData.audio ? (
                    <div className="space-y-3">
                      <Volume2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        {formData.audioFile ? formData.audioFile.name : 'Audio đã tải lên'}
                      </p>
                      {formData.audioFile && (
                        <p className="text-xs text-gray-500 flex items-center justify-center">
                          <FileText className="w-3 h-3 mr-1" />
                          {(formData.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      )}
                      <div className="flex justify-center space-x-2">
                        <button
                          type="button"
                          onClick={removeAudio}
                          className="flex items-center justify-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Xóa audio
                        </button>
                      </div>
                      {formData.audio && (
                        <div className="bg-green-50 border border-green-200 rounded p-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mb-1" />
                          <p className="text-xs text-green-700">Đã upload thành công</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAudioUpload(file);
                        }}
                        className="hidden"
                        id="audio-upload"
                        disabled={uploadingAudio}
                      />
                      <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
                        <Volume2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Tải lên file âm thanh</p>
                        <p className="text-xs text-blue-600 hover:text-blue-700 flex items-center justify-center mt-1">
                          <Upload className="w-3 h-3 mr-1" />
                          Chọn file
                        </p>
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || uploadingImage || uploadingAudio}
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
                    Tạo Từ Vựng
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