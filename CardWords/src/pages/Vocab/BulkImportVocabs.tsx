import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabStore } from '../../store/vocabStore';
import { useTopicStore } from '../../store/topicStore';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { BulkImportResponse } from '../../types/vocab';
import { 
  Upload, 
  Download, 
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
  ChevronUp
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
}

const BulkImportVocabs: React.FC = () => {
  const navigate = useNavigate();
  const { bulkImport, loading } = useVocabStore();
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
      types: ['noun'],
      topic: '',
      credit: ''
    }
  ]);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<BulkImportResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'result'>('form');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [batchSize, setBatchSize] = useState<number>(10);

  // Dữ liệu mẫu
  const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const allWordTypes = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection'];

  // Fetch data
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

  // === CÁC HÀM QUẢN LÝ DÒNG ===

  // Thêm nhiều dòng cùng lúc
  const addMultipleRows = (count: number = batchSize) => {
    const newRows = Array.from({ length: count }, () => ({
      word: '',
      transcription: '',
      meaningVi: '',
      interpret: '',
      exampleSentence: '',
      cefr: 'A1',
      types: ['noun'],
      topic: '',
      credit: ''
    }));
    setVocabs(prev => [...prev, ...newRows]);
  };

  // Thêm dòng mới
  const addNewRow = () => {
    setVocabs(prev => [...prev, {
      word: '',
      transcription: '',
      meaningVi: '',
      interpret: '',
      exampleSentence: '',
      cefr: 'A1',
      types: ['noun'],
      topic: '',
      credit: ''
    }]);
  };

  // Xóa dòng
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

  // Xóa tất cả dòng trống
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
        types: ['noun'],
        topic: '',
        credit: ''
      });
    }
    
    setVocabs(nonEmptyRows);
    setExpandedRows(new Set());
  };

  // Xóa tất cả
  const clearAll = () => {
    setVocabs([{
      word: '',
      transcription: '',
      meaningVi: '',
      interpret: '',
      exampleSentence: '',
      cefr: 'A1',
      types: ['noun'],
      topic: '',
      credit: ''
    }]);
    setExpandedRows(new Set());
    setError(null);
    setSuccess(null);
    setImportResult(null);
  };

  // === CÁC HÀM CẬP NHẬT DỮ LIỆU ===

  // Cập nhật dòng
  const updateRow = (index: number, field: keyof VocabFormData, value: any) => {
    setVocabs(prev => prev.map((vocab, i) => 
      i === index ? { ...vocab, [field]: value } : vocab
    ));
  };

  // Cập nhật types
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

  // Sao chép dòng
  const duplicateRow = (index: number) => {
    const rowToDuplicate = vocabs[index];
    setVocabs(prev => [
      ...prev.slice(0, index + 1),
      { ...rowToDuplicate },
      ...prev.slice(index + 1)
    ]);
  };

  // Di chuyển dòng
  const moveRow = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= vocabs.length) return;
    
    const newVocabs = [...vocabs];
    const [movedRow] = newVocabs.splice(fromIndex, 1);
    newVocabs.splice(toIndex, 0, movedRow);
    setVocabs(newVocabs);
  };

  // Toggle expand row
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

  // Validate dữ liệu
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

      if (rowErrors.length === 0) {
        validRows.push(vocab);
      } else {
        validationErrors.push(`Dòng ${index + 1}: ${rowErrors.join(', ')}`);
      }
    });

    return { validationErrors, validRows };
  };

  // Import từ vựng - SỬA LỖI QUAN TRỌNG
  const handleImport = async () => {
    setError(null);
    setSuccess(null);
    setImportResult(null);

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
        img: undefined,
        audio: undefined
      }));

      // Gọi API bulkImport - KHÔNG cần kiểm tra response vì đã có return type
      const response = await bulkImport(importData);
      
      // Sử dụng response trực tiếp vì đã được định nghĩa kiểu
      setImportResult(response);
      const successCount = response.data.successCount;
      setSuccess(`Import thành công ${successCount}/${validRows.length} từ vựng!`);
      setActiveTab('result');
      
      // Giữ lại chỉ các dòng lỗi (nếu có)
      if (response.data.failedCount > 0) {
        const errorIndexes = response.data.errors.map((error: any) => error.lineNumber - 1);
        const errorRows = vocabs.filter((_, index) => errorIndexes.includes(index));
        setVocabs(errorRows.length > 0 ? errorRows : [{
          word: '', transcription: '', meaningVi: '', interpret: '', exampleSentence: '',
          cefr: 'A1', types: ['noun'], topic: '', credit: ''
        }]);
      } else {
        clearAll();
      }
    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Lỗi khi import từ vựng');
    }
  };

  // === CÁC HÀM TIỆN ÍCH ===

  // Thêm dữ liệu mẫu
  const addSampleData = () => {
    const sampleData: VocabFormData[] = [
      {
        word: 'accommodation',
        transcription: '/əˌkɒm.əˈdeɪ.ʃən/',
        meaningVi: 'chỗ ở',
        interpret: 'a place where someone can live or stay',
        exampleSentence: 'The university provides accommodation for first-year students.',
        cefr: 'B1',
        types: ['noun'],
        topic: 'Travel',
        credit: 'Cambridge Dictionary'
      },
      {
        word: 'comprehensive',
        transcription: '/ˌkɒm.prɪˈhen.sɪv/',
        meaningVi: 'toàn diện',
        interpret: 'complete and including everything that is necessary',
        exampleSentence: 'The company offers comprehensive insurance coverage.',
        cefr: 'C1',
        types: ['adjective'],
        topic: 'Business',
        credit: 'Oxford Dictionary'
      },
      {
        word: 'elaborate',
        transcription: '/ɪˈlæb.ər.ət/',
        meaningVi: 'chi tiết, công phu',
        interpret: 'containing a lot of careful detail or many detailed parts',
        exampleSentence: 'They made elaborate preparations for the wedding.',
        cefr: 'B2',
        types: ['adjective', 'verb'],
        topic: 'Description',
        credit: 'Merriam-Webster'
      }
    ];

    setVocabs(prev => [...prev, ...sampleData]);
  };

  // Download template
  const downloadTemplate = () => {
    const templateData = [
      ['Word*', 'Transcription', 'MeaningVi*', 'Interpret*', 'ExampleSentence*', 'CEFR*', 'Types*', 'Topic', 'Credit'],
      ['hello', '/həˈləʊ/', 'xin chào', 'used as a greeting', 'Hello, how are you?', 'A1', 'interjection', 'Greetings', 'Oxford'],
      ['book', '/bʊk/', 'sách', 'a written or printed work', 'I love reading books.', 'A1', 'noun', 'Education', 'Cambridge']
    ];

    const csvContent = templateData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'vocab-import-template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // === RENDER COMPONENTS ===

  // Render badge
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
      <span className={`px-2 py-1 rounded text-xs font-medium border ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  // Render row actions
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

  // Render Result Tab
  const renderResultTab = () => {
    if (!importResult?.data) return null;

    const resultData = importResult.data;

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Kết Quả Import</h3>
          <p className="text-gray-600">Tổng quan về kết quả import từ vựng</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {resultData.totalRequested}
            </div>
            <div className="text-sm font-medium text-blue-800">Tổng Số Yêu Cầu</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {resultData.successCount}
            </div>
            <div className="text-sm font-medium text-green-800">Thành Công</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {resultData.failedCount}
            </div>
            <div className="text-sm font-medium text-red-800">Thất Bại</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {resultData.skippedCount}
            </div>
            <div className="text-sm font-medium text-yellow-800">Bị Bỏ Qua</div>
          </div>
        </div>

        {/* Errors List */}
        {resultData.errors && resultData.errors.length > 0 && (
          <div className="border border-red-200 rounded-xl overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-200">
              <h4 className="text-lg font-semibold text-red-800 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Chi Tiết Lỗi ({resultData.errors.length})
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-red-800 uppercase tracking-wider">
                      Dòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-red-800 uppercase tracking-wider">
                      Từ Vựng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-red-800 uppercase tracking-wider">
                      Lý Do Lỗi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-100">
                  {resultData.errors.map((error: any, index: number) => (
                    <tr key={index} className="hover:bg-red-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-700">
                        {error.lineNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {error.word}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600">
                        {error.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Success Message */}
        {resultData.successCount > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800 font-medium">
                Đã import thành công {resultData.successCount} từ vựng vào hệ thống!
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setActiveTab('form')}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 font-medium shadow-md"
          >
            Quay Lại Form
          </button>
          <button
            onClick={() => navigate('/admin/vocabs')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-medium shadow-lg"
          >
            Xem Danh Sách Từ Vựng
          </button>
        </div>
      </div>
    );
  };

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
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Thêm nhiều từ vựng cùng lúc vào hệ thống. Hiện tại có <strong>{vocabs.length}</strong> dòng đang được soạn thảo.
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
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-all ${
                  activeTab === 'form'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Nhập Liệu ({vocabs.length} dòng)
              </button>
              <button
                onClick={() => setActiveTab('result')}
                disabled={!importResult}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-all ${
                  activeTab === 'result'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 inline mr-2" />
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hành Động Nhanh</h3>
                  <p className="text-sm text-gray-600">Quản lý nhiều dòng dữ liệu cùng lúc</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Số dòng thêm:</span>
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
                      onClick={addSampleData}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 flex items-center transition-all shadow-lg hover:shadow-xl"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Thêm Mẫu
                    </button>
                    <button
                      onClick={downloadTemplate}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 flex items-center transition-all shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Template CSV
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
                <div className="text-sm text-gray-600">
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
                    <h3 className="text-xl font-bold text-gray-900">Danh Sách Từ Vựng</h3>
                    <p className="text-gray-600 mt-1">Nhập thông tin cho từng từ vựng. Các trường có dấu * là bắt buộc.</p>
                  </div>
                  <div className="flex items-center space-x-3">
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

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Từ Vựng *</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Phiên Âm</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Nghĩa Tiếng Việt *</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CEFR *</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Loại Từ *</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Chủ Đề</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Thao Tác</th>
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
                              {cefrLevels.map(level => (
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
                              {allWordTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
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
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Interpret */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
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

                                {/* Credit */}
                                <div className="lg:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <div className="text-sm text-gray-600">
                    Tổng cộng: <span className="font-semibold text-blue-600">{vocabs.length}</span> dòng • 
                    Đã điền: <span className="font-semibold text-green-600">
                      {vocabs.filter(v => v.word.trim() && v.meaningVi.trim() && v.interpret.trim() && v.exampleSentence.trim()).length}
                    </span> dòng
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Các trường có dấu <span className="text-red-500">*</span> là bắt buộc
                    </span>
                    <button
                      onClick={handleImport}
                      disabled={loading || vocabs.filter(v => v.word.trim()).length === 0}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {loading ? (
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