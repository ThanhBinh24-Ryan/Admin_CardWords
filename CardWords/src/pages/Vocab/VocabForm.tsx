import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVocabStore } from '../../store/vocabStore';
import { useTopicStore } from '../../store/topicStore';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { CreateVocabRequest, UpdateVocabRequest } from '../../types/vocab';
import { CEFR_LEVELS } from '../../constants/vocabConstants';
import { 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Music, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  ArrowLeft,
  BookOpen,
  Type,
  Hash,
  MessageSquare,
  Tag,
  Award,
  FileText
} from 'lucide-react';

interface VocabFormData {
  word: string;
  transcription: string;
  meaningVi: string;
  interpret: string;
  exampleSentence: string;
  cefr: string;
  img: string;
  audio: string;
  types: string[];
  topic: string;
  credit: string;
}

const VocabForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  // Stores
  const { currentVocab, fetchVocabById, createVocab, updateVocabById, uploadImage, uploadAudio, loading } = useVocabStore();
  const { topics, fetchTopics } = useTopicStore();
  const { wordTypes, fetchAllTypes } = useWordTypeStore();
  
  const [form, setForm] = useState<VocabFormData>({
    word: '',
    transcription: '',
    meaningVi: '',
    interpret: '',
    exampleSentence: '',
    cefr: 'A1',
    img: '',
    audio: '',
    types: [],
    topic: '',
    credit: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  // Fetch all data khi component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setDataLoading(true);
        
        // Fetch topics và word types
        await Promise.all([
          fetchTopics(),
          fetchAllTypes()
        ]);

        // Nếu là edit mode, fetch vocab data
        if (isEdit && id) {
          await fetchVocabById(id);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu cần thiết');
      } finally {
        setDataLoading(false);
      }
    };

    fetchAllData();
  }, [isEdit, id, fetchTopics, fetchAllTypes, fetchVocabById]);

  // Cập nhật form khi currentVocab thay đổi (edit mode)
  useEffect(() => {
    if (isEdit && currentVocab) {
      setForm({
        word: currentVocab.word || '',
        transcription: currentVocab.transcription || '',
        meaningVi: currentVocab.meaningVi || '',
        interpret: currentVocab.interpret || '',
        exampleSentence: currentVocab.exampleSentence || '',
        cefr: currentVocab.cefr || 'A1',
        img: currentVocab.img || '',
        audio: currentVocab.audio || '',
        types: currentVocab.types?.map((t: any) => t.name) || [],
        topic: currentVocab.topic?.name || '',
        credit: currentVocab.credit || ''
      });

      if (currentVocab.img) {
        setImagePreview(currentVocab.img);
      }
    }
  }, [isEdit, currentVocab]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);
  setError(null);

  try {
    // Validation
    const requiredFields = {
      word: form.word,
      meaningVi: form.meaningVi,
      interpret: form.interpret,
      exampleSentence: form.exampleSentence,
      cefr: form.cefr
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value.trim() === '')
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      throw new Error(`Các trường bắt buộc chưa điền: ${emptyFields.join(', ')}`);
    }

    if (form.types.length === 0) {
      throw new Error('Vui lòng chọn ít nhất một loại từ');
    }

    // Upload files if they exist
    let imgUrl = form.img;
    let audioUrl = form.audio;

    if (imageFile) {
      setUploading(true);
      try {
        imgUrl = await uploadImage(imageFile);
        console.log('✅ Image uploaded:', imgUrl);
      } catch (uploadError: any) {
        throw new Error(`Lỗi upload ảnh: ${uploadError.message}`);
      } finally {
        setUploading(false);
      }
    }

    if (audioFile) {
      setUploading(true);
      try {
        audioUrl = await uploadAudio(audioFile);
        console.log('✅ Audio uploaded:', audioUrl);
      } catch (uploadError: any) {
        throw new Error(`Lỗi upload audio: ${uploadError.message}`);
      } finally {
        setUploading(false);
      }
    }

    const submitData: CreateVocabRequest | UpdateVocabRequest = {
      word: form.word.trim(),
      transcription: form.transcription.trim() || undefined,
      meaningVi: form.meaningVi.trim(),
      interpret: form.interpret.trim(),
      exampleSentence: form.exampleSentence.trim(),
      cefr: form.cefr,
      img: imgUrl || undefined,
      audio: audioUrl || undefined,
      credit: form.credit.trim() || undefined,
      types: form.types,
      topic: form.topic || undefined
    };

    console.log('📤 Đang gửi dữ liệu:', submitData);

    if (isEdit && id) {
      console.log('✏️ Cập nhật từ vựng ID:', id);
      await updateVocabById(id, submitData as UpdateVocabRequest);
    } else {
      console.log('➕ Tạo từ vựng mới');
      await createVocab(submitData as CreateVocabRequest);
    }

    alert(isEdit ? 'Cập nhật từ vựng thành công!' : 'Thêm từ vựng mới thành công!');
    navigate('/admin/vocabs');
    
  } catch (err: any) {
    console.error('Lỗi khi lưu từ vựng:', err);
    setError(err.message || 'Lỗi khi lưu từ vựng');
  } finally {
    setSaving(false);
    setUploading(false);
  }
};

  const handleCancel = () => {
    navigate('/admin/vocabs');
  };

  const handleChange = (field: keyof VocabFormData, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'types', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      
      // Clear existing image URL since we'll upload new file
      handleChange('img', '');
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      handleChange('audio', ''); // Clear existing audio URL
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    handleChange('img', '');
  };

  const removeAudio = () => {
    setAudioFile(null);
    handleChange('audio', '');
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-all transform hover:translate-x-[-4px] group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            <span className="font-medium">Quay lại danh sách</span>
          </button>
          <div className="flex items-center mb-2">
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isEdit ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới'}
            </h1>
          </div>
          <p className="text-gray-600 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            {isEdit 
              ? 'Cập nhật thông tin từ vựng trong hệ thống' 
              : 'Tạo từ vựng mới cho hệ thống học tập'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start shadow-lg animate-shake">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Có lỗi xảy ra</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500 flex items-center">
                    <Hash className="w-6 h-6 mr-3 text-blue-500" />
                    Thông tin cơ bản
                  </h3>
                </div>

                <div className="group">
                  <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Từ vựng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.word}
                    onChange={(e) => handleChange('word', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                    placeholder="Nhập từ vựng"
                  />
                </div>

                <div className="group">
                  <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Phiên âm
                  </label>
                  <input
                    type="text"
                    value={form.transcription}
                    onChange={(e) => handleChange('transcription', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                    placeholder="/həˈləʊ/"
                  />
                </div>

                <div className="group">
                  <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Nghĩa tiếng Việt <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.meaningVi}
                    onChange={(e) => handleChange('meaningVi', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                    placeholder="Nhập nghĩa tiếng Việt"
                  />
                </div>

                <div className="group">
                  <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Cấp độ CEFR <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.cefr}
                    onChange={(e) => handleChange('cefr', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400 cursor-pointer"
                  >
                    <option value="">Chọn cấp độ CEFR</option>
                    {cefrLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Chủ đề
                  </label>
                  <select
                    value={form.topic}
                    onChange={(e) => handleChange('topic', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400 cursor-pointer"
                  >
                    <option value="">Chọn chủ đề</option>
                    {topics.map(topic => (
                      <option key={topic.id} value={topic.name}>{topic.name}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Nguồn tham khảo
                  </label>
                  <input
                    type="text"
                    value={form.credit}
                    onChange={(e) => handleChange('credit', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                    placeholder="Oxford Dictionary, Cambridge, etc."
                  />
                </div>

                {/* Word Types */}
                <div className="lg:col-span-2">
                  <label className=" text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Loại từ <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {wordTypes.map(type => (
                      <label 
                        key={type.id} 
                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                          form.types.includes(type.name) 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 shadow-lg' 
                            : 'bg-white border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.types.includes(type.name)}
                          onChange={() => handleArrayToggle('types', type.name)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <span className="font-medium">{type.name}</span>
                      </label>
                    ))}
                  </div>
                  {form.types.length === 0 && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Vui lòng chọn ít nhất một loại từ
                    </p>
                  )}
                </div>

                {/* Detailed Information */}
                <div className="lg:col-span-2 mt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-500 flex items-center">
                    <BookOpen className="w-6 h-6 mr-3 text-green-500" />
                    Thông tin chi tiết
                  </h3>
                </div>

                <div className="lg:col-span-2">
                  <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Định nghĩa tiếng Anh <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={form.interpret}
                    onChange={(e) => handleChange('interpret', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400 resize-none"
                    placeholder="Định nghĩa và giải thích cách dùng bằng tiếng Anh"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Câu ví dụ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={form.exampleSentence}
                    onChange={(e) => handleChange('exampleSentence', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400 resize-none"
                    placeholder="Câu ví dụ thể hiện cách dùng từ"
                  />
                </div>

                {/* Media Uploads */}
                <div className="lg:col-span-2 mt-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-orange-500 flex items-center">
                    <ImageIcon className="w-6 h-6 mr-3 text-orange-500" />
                    File đa phương tiện
                  </h3>
                </div>

                <div>
                  <label className=" text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Hình ảnh minh họa
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gradient-to-br from-blue-50 to-purple-50 hover:border-blue-400 transition-all">
                    {imagePreview || form.img ? (
                      <div className="space-y-3">
                        <div className="relative inline-block">
                          <img 
                            src={imagePreview || form.img} 
                            alt="Preview" 
                            className="h-40 mx-auto object-cover rounded-xl shadow-lg" 
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="flex items-center justify-center mx-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-md"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa ảnh
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                          disabled={uploading}
                        />
                        <label 
                          htmlFor="image-upload" 
                          className={`cursor-pointer block ${uploading ? 'opacity-50' : ''}`}
                        >
                          <div className="mb-3">
                            {uploading ? (
                              <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
                            ) : (
                              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            )}
                          </div>
                          <span className="text-base text-gray-700 font-medium block mb-1">
                            {uploading ? 'Đang tải lên...' : 'Nhấn để tải ảnh lên'}
                          </span>
                          <p className="text-xs text-gray-500 flex items-center justify-center">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            PNG, JPG, GIF, WebP (tối đa 5MB)
                          </p>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className=" text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <Music className="w-4 h-4 mr-2" />
                    Audio phát âm
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gradient-to-br from-green-50 to-teal-50 hover:border-green-400 transition-all">
                    {audioFile || form.audio ? (
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-4 shadow-md inline-block">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-700">
                            {audioFile ? audioFile.name : 'Audio đã tải lên'}
                          </p>
                          {audioFile && (
                            <p className="text-xs text-gray-500 flex items-center justify-center">
                              <Music className="w-3 h-3 mr-1" />
                              {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={removeAudio}
                          className="flex items-center justify-center mx-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-md"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa audio
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioChange}
                          className="hidden"
                          id="audio-upload"
                          disabled={uploading}
                        />
                        <label 
                          htmlFor="audio-upload" 
                          className={`cursor-pointer block ${uploading ? 'opacity-50' : ''}`}
                        >
                          <div className="mb-3">
                            {uploading ? (
                              <Loader2 className="w-12 h-12 text-green-600 mx-auto animate-spin" />
                            ) : (
                              <Music className="w-12 h-12 text-gray-400 mx-auto" />
                            )}
                          </div>
                          <span className="text-base text-gray-700 font-medium block mb-1">
                            {uploading ? 'Đang tải lên...' : 'Nhấn để tải audio lên'}
                          </span>
                          <p className="text-xs text-gray-500 flex items-center justify-center">
                            <Music className="w-3 h-3 mr-1" />
                            MP3, WAV, OGG (tối đa 10MB)
                          </p>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 pt-8 border-t-2 border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving || uploading}
                  className="px-8 py-3 border-2 border-gray-300 text-base font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 flex items-center transition-all transform hover:scale-105 shadow-md"
                >
                  <X className="w-5 h-5 mr-2" />
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-8 py-3 border-2 border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {isEdit ? 'Cập nhật từ vựng' : 'Tạo từ vựng mới'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VocabForm;