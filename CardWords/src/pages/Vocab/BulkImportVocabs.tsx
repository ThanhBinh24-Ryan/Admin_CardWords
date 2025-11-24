import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabStore } from '../../store/vocabStore';
import { useTopicStore } from '../../store/topicStore';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { BulkImportResponse } from '../../types/vocab';
import { CEFR_LEVELS } from '../../constants/vocabConstants';
import { 
  Upload, 
  Plus, 
  Trash2, 
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Copy,
  BookOpen,
  FileUp,
  ChevronDown,
  ChevronUp,
  Type,
  Award,
  Tag,
  MessageSquare,
  FileText as FileTextIcon,
  Bookmark,
  Languages,
  Sparkles,
  Hash,
  Image as ImageIcon,
  Volume2
} from 'lucide-react';

interface VocabFormData {
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
  uploadingImage?: boolean;
  uploadingAudio?: boolean;
}

const BulkImportVocabs: React.FC = () => {
  const navigate = useNavigate();
  const { bulkImport, loading, uploadImage, uploadAudio } = useVocabStore();
  const { topics, fetchTopics } = useTopicStore();
  const { wordTypes, fetchAllTypes } = useWordTypeStore();
  
  const [vocabs, setVocabs] = useState<VocabFormData[]>([
    {
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
      imagePreview: '',
      uploadingImage: false,
      uploadingAudio: false
    }
  ]);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<BulkImportResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'result'>('form');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [batchSize, setBatchSize] = useState<number>(10);
  const [dataLoading, setDataLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch data
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

  // === CÁC HÀM QUẢN LÝ DÒNG ===
  const addMultipleRows = (count: number = batchSize) => {
    const newRows = Array.from({ length: count }, () => ({
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
      imagePreview: '',
      uploadingImage: false,
      uploadingAudio: false
    }));
    setVocabs(prev => [...prev, ...newRows]);
  };

  const addNewRow = () => {
    setVocabs(prev => [...prev, {
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
      imagePreview: '',
      uploadingImage: false,
      uploadingAudio: false
    }]);
  };

  const removeRow = (index: number) => {
    if (vocabs.length > 1) {
      setVocabs(prev => prev.filter((_, i) => i !== index));
      setExpandedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const removeEmptyRows = () => {
    const nonEmptyRows = vocabs.filter(vocab => 
      vocab.word.trim() || 
      vocab.meaningVi.trim() || 
      vocab.interpret.trim() || 
      vocab.exampleSentence.trim()
    );
    
    if (nonEmptyRows.length === 0) {
      nonEmptyRows.push({
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
        imagePreview: '',
        uploadingImage: false,
        uploadingAudio: false
      });
    }
    
    setVocabs(nonEmptyRows);
    setExpandedRows(new Set());
  };

  const clearAll = () => {
    setVocabs([{
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
      imagePreview: '',
      uploadingImage: false,
      uploadingAudio: false
    }]);
    setExpandedRows(new Set());
    setError(null);
    setSuccess(null);
    setImportResult(null);
  };

  // === CÁC HÀM CẬP NHẬT DỮ LIỆU ===
  const updateRow = (index: number, field: keyof VocabFormData, value: any) => {
    setVocabs(prev => prev.map((vocab, i) => 
      i === index ? { ...vocab, [field]: value } : vocab
    ));
  };

  const updateTypes = (index: number, type: string, checked: boolean) => {
    setVocabs(prev => prev.map((vocab, i) => {
      if (i === index) {
        const currentTypes = vocab.types || [];
        const newTypes = checked 
          ? [...currentTypes, type]
          : currentTypes.filter(t => t !== type);
        return { ...vocab, types: newTypes };
      }
      return vocab;
    }));
  };

  // Upload ảnh cho từng dòng
  const handleImageUpload = async (index: number, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    updateRow(index, 'uploadingImage', true);
    updateRow(index, 'imageFile', file);
    updateRow(index, 'imagePreview', previewUrl);

    try {
      console.log(`📤 Uploading image for row ${index + 1}:`, file.name);
      const imageUrl = await uploadImage(file);
      console.log(`✅ Image uploaded: ${imageUrl}`);
      
      updateRow(index, 'img', imageUrl);
    } catch (error: any) {
      console.error(`❌ Image upload failed for row ${index + 1}:`, error);
      updateRow(index, 'imageFile', null);
      URL.revokeObjectURL(previewUrl);
      updateRow(index, 'imagePreview', '');
      throw new Error(`Lỗi upload ảnh: ${error.message}`);
    } finally {
      updateRow(index, 'uploadingImage', false);
    }
  };

  // Upload audio cho từng dòng
  const handleAudioUpload = async (index: number, file: File) => {
    updateRow(index, 'uploadingAudio', true);
    updateRow(index, 'audioFile', file);

    try {
      console.log(`📤 Uploading audio for row ${index + 1}:`, file.name);
      const audioUrl = await uploadAudio(file);
      console.log(`✅ Audio uploaded: ${audioUrl}`);
      
      updateRow(index, 'audio', audioUrl);
    } catch (error: any) {
      console.error(`❌ Audio upload failed for row ${index + 1}:`, error);
      updateRow(index, 'audioFile', null);
      throw new Error(`Lỗi upload audio: ${error.message}`);
    } finally {
      updateRow(index, 'uploadingAudio', false);
    }
  };

  const removeImage = (index: number) => {
    const vocab = vocabs[index];
    if (vocab.imagePreview) {
      URL.revokeObjectURL(vocab.imagePreview);
    }
    setVocabs(prev => prev.map((v, i) => 
      i === index ? { 
        ...v, 
        imageFile: null,
        imagePreview: '',
        img: ''
      } : v
    ));
  };

  const removeAudio = (index: number) => {
    setVocabs(prev => prev.map((v, i) => 
      i === index ? { 
        ...v, 
        audioFile: null,
        audio: ''
      } : v
    ));
  };

  const duplicateRow = (index: number) => {
    const rowToDuplicate = { ...vocabs[index] };
    // Clear file references when duplicating
    rowToDuplicate.imageFile = null;
    rowToDuplicate.audioFile = null;
    rowToDuplicate.imagePreview = '';
    rowToDuplicate.uploadingImage = false;
    rowToDuplicate.uploadingAudio = false;
    
    setVocabs(prev => [
      ...prev.slice(0, index + 1),
      rowToDuplicate,
      ...prev.slice(index + 1)
    ]);
  };

  const moveRow = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= vocabs.length) return;
    
    const newVocabs = [...vocabs];
    const [movedRow] = newVocabs.splice(fromIndex, 1);
    newVocabs.splice(toIndex, 0, movedRow);
    setVocabs(newVocabs);
  };

  const toggleExpandRow = (index: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // === CÁC HÀM IMPORT VÀ VALIDATION ===
  const validateData = () => {
    const validationErrors: string[] = [];
    const validRows: VocabFormData[] = [];

    vocabs.forEach((vocab, index) => {
      const rowErrors: string[] = [];

      if (!vocab.word.trim()) rowErrors.push('Thiếu từ vựng');
      if (!vocab.meaningVi.trim()) rowErrors.push('Thiếu nghĩa tiếng Việt');
      if (!vocab.interpret.trim()) rowErrors.push('Thiếu định nghĩa tiếng Anh');
      if (!vocab.exampleSentence.trim()) rowErrors.push('Thiếu câu ví dụ');
      if (!vocab.cefr) rowErrors.push('Chưa chọn cấp độ CEFR');
      if (vocab.types.length === 0) rowErrors.push('Chưa chọn loại từ');

      // Check if files are still uploading
      if (vocab.uploadingImage || vocab.uploadingAudio) {
        rowErrors.push('File đang được upload, vui lòng chờ');
      }

      // Check if files are selected but not uploaded
      if (vocab.imageFile && !vocab.img) {
        rowErrors.push('Ảnh chưa được upload');
      }
      if (vocab.audioFile && !vocab.audio) {
        rowErrors.push('Audio chưa được upload');
      }

      if (rowErrors.length === 0) {
        validRows.push(vocab);
      } else {
        validationErrors.push(`Dòng ${index + 1}: ${rowErrors.join(', ')}`);
      }
    });

    return { validationErrors, validRows };
  };

  // Upload files for all rows before import
  const uploadAllFiles = async () => {
    setUploading(true);
    
    try {
      // Upload images and audios for all rows
      for (let i = 0; i < vocabs.length; i++) {
        const vocab = vocabs[i];
        
        // Upload image if exists
        if (vocab.imageFile && !vocab.img) {
          console.log(`📤 Uploading image for: ${vocab.word || `row ${i + 1}`}`);
          await handleImageUpload(i, vocab.imageFile);
        }

        // Upload audio if exists
        if (vocab.audioFile && !vocab.audio) {
          console.log(`📤 Uploading audio for: ${vocab.word || `row ${i + 1}`}`);
          await handleAudioUpload(i, vocab.audioFile);
        }
      }
    } catch (error: any) {
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleImport = async () => {
    setError(null);
    setSuccess(null);
    setImportResult(null);

    // First upload all files
    try {
      await uploadAllFiles();
    } catch (uploadError: any) {
      setError(`Lỗi upload file: ${uploadError.message}`);
      return;
    }

    // Then validate data
    const { validationErrors, validRows } = validateData();

    if (validationErrors.length > 0) {
      setError(`Có ${validationErrors.length} dòng lỗi:\n${validationErrors.slice(0, 10).join('\n')}${validationErrors.length > 10 ? `\n...và ${validationErrors.length - 10} lỗi khác` : ''}`);
      return;
    }

    if (validRows.length === 0) {
      setError('Không có dòng nào hợp lệ để import');
      return;
    }

    try {
      console.log(`🔄 Bắt đầu import ${validRows.length} từ vựng...`);

      // Prepare data for import
      const importData = validRows.map(vocab => ({
        word: vocab.word.trim(),
        transcription: vocab.transcription.trim() || undefined,
        meaningVi: vocab.meaningVi.trim(),
        interpret: vocab.interpret.trim(),
        exampleSentence: vocab.exampleSentence.trim(),
        cefr: vocab.cefr,
        types: vocab.types,
        topic: vocab.topic.trim() || undefined,
        credit: vocab.credit.trim() || undefined,
        img: vocab.img || undefined,
        audio: vocab.audio || undefined
      }));

      console.log('📤 Gửi dữ liệu import:', importData);

      // Gọi API import - ĐÃ SỬA: Không kiểm tra response phức tạp
      await bulkImport(importData);
      
      // Hiển thị thông báo thành công
      setSuccess(`Import thành công ${validRows.length} từ vựng!`);
      setActiveTab('result');
      
      // Clear form sau khi import thành công
      clearAll();

    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Lỗi khi import từ vựng');
    }
  };

  // === RENDER COMPONENTS ===
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

  const renderRowActions = (index: number) => (
    <div className="flex space-x-2">
      <button
        onClick={() => duplicateRow(index)}
        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
        title="Nhân đôi dòng"
      >
        <Copy className="w-4 h-4" />
      </button>
      {index > 0 && (
        <button
          onClick={() => moveRow(index, index - 1)}
          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all"
          title="Di chuyển lên"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
      {index < vocabs.length - 1 && (
        <button
          onClick={() => moveRow(index, index + 1)}
          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all"
          title="Di chuyển xuống"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={() => removeRow(index)}
        disabled={vocabs.length <= 1}
        className={`p-2 rounded-lg transition-all ${
          vocabs.length <= 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-red-600 hover:text-red-800 hover:bg-red-50'
        }`}
        title={vocabs.length <= 1 ? "Không thể xóa dòng cuối" : "Xóa dòng"}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  const renderMediaUpload = (index: number, vocab: VocabFormData) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Image Upload */}
      <div>
        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
          <ImageIcon className="w-4 h-4 mr-2" />
          Hình ảnh
          {vocab.uploadingImage && (
            <Loader2 className="w-3 h-3 ml-2 animate-spin text-blue-600" />
          )}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-all cursor-pointer">
          {vocab.imagePreview || vocab.img ? (
            <div className="space-y-3">
              <img 
                src={vocab.imagePreview || vocab.img} 
                alt="Preview" 
                className="h-20 mx-auto object-cover rounded-lg" 
              />
              <div className="flex justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="flex items-center justify-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Xóa ảnh
                </button>
              </div>
              {vocab.img && (
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
                  if (file) handleImageUpload(index, file);
                }}
                className="hidden"
                id={`image-upload-${index}`}
                disabled={vocab.uploadingImage || uploading}
              />
              <label htmlFor={`image-upload-${index}`} className="cursor-pointer flex flex-col items-center">
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

      {/* Audio Upload */}
      <div>
        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Volume2 className="w-4 h-4 mr-2" />
          Phát âm
          {vocab.uploadingAudio && (
            <Loader2 className="w-3 h-3 ml-2 animate-spin text-blue-600" />
          )}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-all cursor-pointer">
          {vocab.audioFile || vocab.audio ? (
            <div className="space-y-3">
              <Volume2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                {vocab.audioFile ? vocab.audioFile.name : 'Audio đã tải lên'}
              </p>
              {vocab.audioFile && (
                <p className="text-xs text-gray-500 flex items-center justify-center">
                  <FileTextIcon className="w-3 h-3 mr-1" />
                  {(vocab.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
              <div className="flex justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => removeAudio(index)}
                  className="flex items-center justify-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Xóa audio
                </button>
              </div>
              {vocab.audio && (
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
                  if (file) handleAudioUpload(index, file);
                }}
                className="hidden"
                id={`audio-upload-${index}`}
                disabled={vocab.uploadingAudio || uploading}
              />
              <label htmlFor={`audio-upload-${index}`} className="cursor-pointer flex flex-col items-center">
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
  );

  const renderResultTab = () => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-green-500" />
            Kết Quả Import
          </h3>
          <p className="text-gray-600 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Import từ vựng đã hoàn thành thành công!
          </p>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h4 className="text-lg font-semibold text-green-800 mb-1">Import Thành Công!</h4>
              <p className="text-green-700">
                Tất cả từ vựng đã được import vào hệ thống. Bạn có thể quay lại danh sách để xem các từ vựng mới.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">Bước tiếp theo</h4>
          <div className="space-y-3">
            <div className="flex items-center text-blue-700">
              <BookOpen className="w-5 h-5 mr-3" />
              <span>Xem danh sách từ vựng đã được thêm</span>
            </div>
            <div className="flex items-center text-blue-700">
              <Plus className="w-5 h-5 mr-3" />
              <span>Tiếp tục thêm từ vựng mới</span>
            </div>
            <div className="flex items-center text-blue-700">
              <FileUp className="w-5 h-5 mr-3" />
              <span>Import thêm từ vựng khác</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setActiveTab('form')}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 font-medium shadow-md flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Thêm Từ Mới
          </button>
          <button
            onClick={() => navigate('/admin/vocabs')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-medium shadow-lg flex items-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Xem Danh Sách Từ Vựng
          </button>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/vocabs')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-all transform hover:translate-x-[-4px] group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            <span className="font-medium">Quay lại danh sách</span>
          </button>
          
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <FileUp className="w-12 h-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Import Từ Vựng Hàng Loạt
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto flex items-center justify-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Thêm nhiều từ vựng cùng lúc vào hệ thống. Hiện tại có <strong className="mx-1">{vocabs.length}</strong> dòng đang được soạn thảo.
            </p>
          </div>
        </div>

        {/* Error & Success Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start shadow-lg">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Có lỗi xảy ra</p>
              <p className="text-sm whitespace-pre-line">{error}</p>
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

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-all flex items-center justify-center ${
                  activeTab === 'form'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Nhập Liệu ({vocabs.length} dòng)
              </button>
              <button
                onClick={() => setActiveTab('result')}
                disabled={!success}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-all flex items-center justify-center ${
                  activeTab === 'result'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Kết Quả
              </button>
            </nav>
          </div>
        </div>

        {/* Form Tab */}
        {activeTab === 'form' && (
          <div className="space-y-6">
            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                    Hành Động Nhanh
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Quản lý nhiều dòng dữ liệu cùng lúc
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 flex items-center">
                      <FileTextIcon className="w-4 h-4 mr-1" />
                      Số dòng thêm:
                    </span>
                    <select
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {[5, 10, 20, 50].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => addMultipleRows()}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center transition-all shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm {batchSize} Dòng
                    </button>
                    <button
                      onClick={addNewRow}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 flex items-center transition-all shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm 1 Dòng
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={removeEmptyRows}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center transition-all text-sm"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Xóa Dòng Trống
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center transition-all text-sm"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Xóa Tất Cả
                </button>
                <div className="flex-1"></div>
                <div className="text-sm text-gray-600 flex items-center">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  <strong>{vocabs.length}</strong> dòng •{' '}
                  <strong>{vocabs.filter(v => v.word.trim()).length}</strong> có từ vựng
                </div>
              </div>
            </div>

            {/* Vocabulary List - Table View */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
                      Danh Sách Từ Vựng
                    </h3>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      Nhập thông tin cho từng từ vựng. Các trường có dấu * là bắt buộc.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                        <Hash className="w-4 h-4" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">
                        <Type className="w-4 h-4 mr-1 inline" />
                        Từ Vựng *
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                        <MessageSquare className="w-4 h-4 mr-1 inline" />
                        Phiên Âm
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">
                        <BookOpen className="w-4 h-4 mr-1 inline" />
                        Nghĩa Tiếng Việt *
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Award className="w-4 h-4 mr-1 inline" />
                        CEFR *
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                        <Languages className="w-4 h-4 mr-1 inline" />
                        Loại Từ *
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                        <Tag className="w-4 h-4 mr-1 inline" />
                        Chủ Đề
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                        <Sparkles className="w-4 h-4 mr-1 inline" />
                        Thao Tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vocabs.map((vocab, index) => (
                      <React.Fragment key={index}>
                        <tr className="hover:bg-gray-50 transition-colors group">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center space-x-2">
                              <span>{index + 1}</span>
                              <button
                                onClick={() => toggleExpandRow(index)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {expandedRows.has(index) ? 
                                  <ChevronUp className="w-4 h-4" /> : 
                                  <ChevronDown className="w-4 h-4" />
                                }
                              </button>
                            </div>
                          </td>
                          
                          {/* Word */}
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={vocab.word}
                              onChange={(e) => updateRow(index, 'word', e.target.value)}
                              placeholder="Nhập từ vựng..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </td>

                          {/* Transcription */}
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={vocab.transcription}
                              onChange={(e) => updateRow(index, 'transcription', e.target.value)}
                              placeholder="/phiên/âm/"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </td>

                          {/* Meaning Vietnamese */}
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={vocab.meaningVi}
                              onChange={(e) => updateRow(index, 'meaningVi', e.target.value)}
                              placeholder="Nghĩa tiếng Việt..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </td>

                          {/* CEFR Level */}
                          <td className="px-4 py-3">
                            <select
                              value={vocab.cefr}
                              onChange={(e) => updateRow(index, 'cefr', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="">Chọn CEFR</option>
                              {CEFR_LEVELS.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </td>

                          {/* Word Types */}
                          <td className="px-4 py-3">
                            <select
                              multiple
                              value={vocab.types}
                              onChange={(e) => {
                                const selectedTypes = Array.from(e.target.selectedOptions, option => option.value);
                                updateRow(index, 'types', selectedTypes);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-20"
                              size={3}
                            >
                              {wordTypes.map(type => (
                                <option key={type.id} value={type.name}>{type.name}</option>
                              ))}
                            </select>
                            {vocab.types.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {vocab.types.map(type => (
                                  <div key={type}>{getTypeBadge(type)}</div>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Topic */}
                          <td className="px-4 py-3">
                            <select
                              value={vocab.topic}
                              onChange={(e) => updateRow(index, 'topic', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="">Chọn chủ đề</option>
                              {topics.map(topic => (
                                <option key={topic.id} value={topic.name}>{topic.name}</option>
                              ))}
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            {renderRowActions(index)}
                          </td>
                        </tr>

                        {/* Expanded Row for Additional Fields */}
                        {expandedRows.has(index) && (
                          <tr className="bg-blue-50">
                            <td colSpan={8} className="px-4 py-4">
                              <div className="space-y-4">
                                {/* Interpret and Example Sentence */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  {/* Interpret */}
                                  <div>
                                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Định Nghĩa Tiếng Anh *
                                    </label>
                                    <textarea
                                      value={vocab.interpret}
                                      onChange={(e) => updateRow(index, 'interpret', e.target.value)}
                                      placeholder="Định nghĩa và giải thích cách dùng..."
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    />
                                  </div>

                                  {/* Example Sentence */}
                                  <div>
                                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                                      <FileTextIcon className="w-4 h-4 mr-2" />
                                      Câu Ví Dụ *
                                    </label>
                                    <textarea
                                      value={vocab.exampleSentence}
                                      onChange={(e) => updateRow(index, 'exampleSentence', e.target.value)}
                                      placeholder="Câu ví dụ thể hiện cách dùng từ..."
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    />
                                  </div>
                                </div>

                                {/* Credit */}
                                <div>
                                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Bookmark className="w-4 h-4 mr-2" />
                                    Nguồn Tham Khảo
                                  </label>
                                  <input
                                    type="text"
                                    value={vocab.credit}
                                    onChange={(e) => updateRow(index, 'credit', e.target.value)}
                                    placeholder="Oxford, Cambridge, Merriam-Webster..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                  />
                                </div>

                                {/* Media Uploads */}
                                {renderMediaUpload(index, vocab)}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary & Import Button */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 flex items-center">
                    <FileTextIcon className="w-4 h-4 mr-2" />
                    Tổng cộng: <span className="font-semibold text-blue-600 mx-1">{vocabs.length}</span> dòng • 
                    Đã điền: <span className="font-semibold text-green-600 mx-1">
                      {vocabs.filter(v => v.word.trim() && v.meaningVi.trim() && v.interpret.trim() && v.exampleSentence.trim()).length}
                    </span> dòng
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Các trường có dấu <span className="text-red-500">*</span> là bắt buộc
                    </span>
                    <button
                      onClick={handleImport}
                      disabled={loading || uploading || vocabs.filter(v => v.word.trim()).length === 0}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {loading || uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang Import...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Import ({vocabs.filter(v => v.word.trim()).length} từ)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result Tab */}
        {activeTab === 'result' && renderResultTab()}
      </div>
    </div>
  );
};

export default BulkImportVocabs;