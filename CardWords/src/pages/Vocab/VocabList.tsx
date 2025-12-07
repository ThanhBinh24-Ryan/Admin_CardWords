import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVocabStore } from '../../store/vocabStore';
import { useTopicStore } from '../../store/topicStore';
import { useWordTypeStore } from '../../store/wordTypeStore';
import { VocabFilter } from '../../types/vocab';
import { CEFR_LEVELS } from '../../constants/vocabConstants';
import { 
  Search, Plus, X, Eye, Edit, Trash2, Volume2, BookOpen,
  Filter, Loader2, ChevronLeft, ChevronRight, Sparkles, Tag, Languages,
  FileUp, Download, FileText, RefreshCw, AlertTriangle, CheckCircle
} from 'lucide-react';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const VocabList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { vocabs, loading, error, fetchVocabs, deleteVocab, clearError, exportToExcel } = useVocabStore();
  const { topics, fetchTopics } = useTopicStore();
  const { wordTypes, fetchAllTypes } = useWordTypeStore();
  
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState<{ id: string; word: string } | null>(null);
  
  const itemsPerPage = 9;
  
  const debouncedSearch = useDebounce(searchInput, 500);

  const getFiltersFromURL = (): VocabFilter => {
    return {
      search: searchParams.get('search') || '',
      cefr: searchParams.get('cefr') || '',
      type: searchParams.get('type') || '',
      topic: searchParams.get('topic') || ''
    };
  };

  const filters = getFiltersFromURL();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setDataLoading(true);
        
        await Promise.all([
          fetchVocabs({ page: 0, size: 2000 }),
          topics.length === 0 ? fetchTopics() : Promise.resolve(),
          wordTypes.length === 0 ? fetchAllTypes() : Promise.resolve()
        ]);
        
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setDataLoading(false);
        setTimeout(() => setPageLoaded(true), 200);
      }
    };

    fetchAllData();
  }, [fetchVocabs]);

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.cefr) params.set('cefr', filters.cefr);
    if (filters.type) params.set('type', filters.type);
    if (filters.topic) params.set('topic', filters.topic);
    
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params);
    }
  }, [filters, setSearchParams, searchParams]);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const filteredVocabs = useMemo(() => {
    let filtered = [...vocabs];
    
    if (filters.cefr) {
      filtered = filtered.filter(vocab => vocab.cefr === filters.cefr);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(vocab => 
        vocab.word.toLowerCase().includes(searchLower) ||
        vocab.meaningVi.toLowerCase().includes(searchLower) ||
        (vocab.interpret && vocab.interpret.toLowerCase().includes(searchLower)) ||
        (vocab.transcription && vocab.transcription.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter(vocab => 
        vocab.types.some(type => type.name.toLowerCase() === filters.type?.toLowerCase())
      );
    }
    
    if (filters.topic) {
      filtered = filtered.filter(vocab => 
        vocab.topic?.name.toLowerCase() === filters.topic?.toLowerCase()
      );
    }
    
    return filtered;
  }, [vocabs, filters]);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      const newFilters = { ...filters, search: debouncedSearch };
      const params = new URLSearchParams();
      
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.cefr) params.set('cefr', newFilters.cefr);
      if (newFilters.type) params.set('type', newFilters.type);
      if (newFilters.topic) params.set('topic', newFilters.topic);
      
      setSearchParams(params);
      setCurrentPage(0);
    }
  }, [debouncedSearch, filters, setSearchParams]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchVocabs({ page: 0, size: 2000 });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchVocabs]);

  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      await exportToExcel();
    } catch (err: any) {
      console.error('Export failed:', err);
      alert(`Lỗi khi export: ${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setDataLoading(true);
      await fetchVocabs({ page: 0, size: 2000 });
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const totalElements = filteredVocabs.length;
  const totalPages = Math.ceil(totalElements / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVocabs = filteredVocabs.slice(startIndex, endIndex);

  const handleFilterChange = useCallback((key: keyof VocabFilter, value: string) => {
    const newFilters = { ...filters, [key]: value };
    const params = new URLSearchParams();
    
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.cefr) params.set('cefr', newFilters.cefr);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.topic) params.set('topic', newFilters.topic);
    
    setSearchParams(params);
    setCurrentPage(0);
  }, [filters, setSearchParams]);

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
  };

  const clearFilters = () => { 
    setSearchParams({}); 
    setCurrentPage(0);
    setSearchInput('');
  };

  const handleViewDetails = (id: string) => { 
    navigate(`/admin/vocabs/${id}`); 
  };

  const handleEdit = (id: string) => { 
    navigate(`/admin/vocabs/${id}/edit`); 
  };

  const handleAddNew = () => { 
    navigate('/admin/vocab/new'); 
  };

  const handleBulkImport = () => {
    navigate('/admin/vocabs/bulk-import');
  };

  const handleDelete = (id: string, word: string) => {
    setSelectedVocab({ id, word });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVocab) return;
    
    try {
      setDeleteLoading(selectedVocab.id);
      await deleteVocab(selectedVocab.id);
      setShowDeleteModal(false);
      setSelectedVocab(null);
      await fetchVocabs({ page: 0, size: 2000 });
    } catch (err: any) {
      console.error('Error deleting vocab:', err);
      alert(`Lỗi: ${err.message || 'Lỗi khi xóa từ vựng'}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const getCefrBadge = (cefr: string) => {
    const cefrColors: { [key: string]: string } = {
      'A1': 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
      'A2': 'bg-green-100 text-green-800 ring-1 ring-green-200',
      'B1': 'bg-blue-100 text-blue-800 ring-1 ring-blue-200',
      'B2': 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200',
      'C1': 'bg-purple-100 text-purple-800 ring-1 ring-purple-200',
      'C2': 'bg-pink-100 text-pink-800 ring-1 ring-pink-200'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cefrColors[cefr] || 'bg-gray-100 text-gray-800'}`}>
        {cefr}
      </span>
    );
  };

  const getWordTypeBadge = (types: any[]) => {
    if (!types || types.length === 0) return null;
    const typeColors: { [key: string]: string } = {
      'noun': 'bg-blue-100 text-blue-800 ring-1 ring-blue-200',
      'verb': 'bg-red-100 text-red-800 ring-1 ring-red-200',
      'adjective': 'bg-green-100 text-green-800 ring-1 ring-green-200',
      'adverb': 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200',
      'interjection': 'bg-purple-100 text-purple-800 ring-1 ring-purple-200',
      'preposition': 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200',
      'pronoun': 'bg-orange-100 text-orange-800 ring-1 ring-orange-200',
      'conjunction': 'bg-teal-100 text-teal-800 ring-1 ring-teal-200',
      'determiner': 'bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200',
      'numeral': 'bg-amber-100 text-amber-800 ring-1 ring-amber-200'
    };
    const firstType = types[0].name?.toLowerCase();
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeColors[firstType] || 'bg-gray-100 text-gray-800'}`}>
        {types[0].name}
      </span>
    );
  };

  useEffect(() => { 
    return () => { clearError(); }; 
  }, [clearError]);

  if ((loading && vocabs.length === 0) || dataLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang tải dữ liệu từ vựng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className={`mb-8 transform transition-all duration-700 ${pageLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-3">
              <BookOpen className="w-12 h-12 text-indigo-600 mr-3" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Quản Lý Từ Vựng
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Quản lý cơ sở dữ liệu từ vựng một cách hiệu quả</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex justify-between items-center shadow-md animate-fade-in">
            <div className="flex items-center">
              <X className="w-5 h-5 mr-3" />
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={clearError} className="text-red-700 hover:text-red-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className={`bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 transform transition-all duration-700 delay-200 ${pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-center mb-5">
            <Filter className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Search className="w-4 h-4 mr-1.5 text-gray-500" />
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo từ, nghĩa, hoặc định nghĩa..."
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-gray-500" />
                Cấp độ CEFR
              </label>
              <select
                value={filters.cefr}
                onChange={(e) => handleFilterChange('cefr', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Tất cả cấp độ</option>
                {CEFR_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Languages className="w-4 h-4 mr-1.5 text-gray-500" />
                Loại từ
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Tất cả loại</option>
                {wordTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-1.5 text-gray-500" />
                Chủ đề
              </label>
              <select
                value={filters.topic}
                onChange={(e) => handleFilterChange('topic', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Tất cả chủ đề</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.name}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-indigo-600">{totalElements}</span> từ được tìm thấy
              {vocabs.length !== totalElements && (
                <span className="text-gray-500"> (Tổng: {vocabs.length})</span>
              )}
              {(filters.search || filters.cefr || filters.type || filters.topic) && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {filters.cefr && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                      CEFR: {filters.cefr}
                    </span>
                  )}
                  {filters.type && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      Loại: {filters.type}
                    </span>
                  )}
                  {filters.topic && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
                      Chủ đề: {filters.topic}
                    </span>
                  )}
                  {filters.search && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Tìm: "{filters.search}"
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              {(filters.search || filters.cefr || filters.type || filters.topic) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center transition-all shadow-sm hover:shadow-md"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Xóa bộ lọc
                </button>
              )}
              <button
                onClick={handleExportExcel}
                disabled={exportLoading || vocabs.length === 0}
                className="px-5 py-2 text-sm text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {exportLoading ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-1.5" />
                )}
                Export Excel
              </button>
              <button
                onClick={handleBulkImport}
                className="px-5 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FileUp className="w-4 h-4 mr-1.5" />
                Import Hàng Loạt
              </button>
              <button
                onClick={handleAddNew}
                className="px-5 py-2 text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Thêm từ mới
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentVocabs.map((vocab, index) => (
            <div 
              key={vocab.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 group"
              style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {vocab.img ? (
                  <img
                    src={vocab.img}
                    alt={vocab.word}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.image-fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                
                <div className={`image-fallback absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center ${vocab.img ? 'hidden' : ''}`}>
                  <span className="text-white font-bold text-2xl">{vocab.word.charAt(0).toUpperCase()}</span>
                </div>
                
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {getCefrBadge(vocab.cefr)}
                  {getWordTypeBadge(vocab.types)}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{vocab.word}</h3>
                  {vocab.audio && (
                    <button
                      onClick={() => playAudio(vocab.audio)}
                      className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Phát phát âm"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {vocab.transcription && (
                  <p className="text-gray-500 text-sm mb-2 italic">{vocab.transcription}</p>
                )}
                <p className="text-gray-800 font-medium mb-3">{vocab.meaningVi}</p>
                {vocab.interpret && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vocab.interpret}</p>
                )}

                {vocab.topic && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg text-xs font-medium ring-1 ring-indigo-200">
                      <Tag className="w-3 h-3 mr-1.5" />
                      {vocab.topic.name}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(vocab.id)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors group"
                  >
                    <Eye className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                    Xem chi tiết
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(vocab.id)}
                      className="text-emerald-600 hover:text-emerald-800 p-2 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vocab.id, vocab.word)}
                      disabled={deleteLoading === vocab.id}
                      className={`p-2 rounded-lg transition-all ${
                        deleteLoading === vocab.id 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                      }`}
                      title={deleteLoading === vocab.id ? "Đang xóa..." : "Xóa"}
                    >
                      {deleteLoading === vocab.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentVocabs.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
            <div className="text-gray-300 mb-6">
              <BookOpen className="w-32 h-32 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Không tìm thấy từ vựng</h3>
            <p className="text-gray-500 mb-8 text-lg">
              {filters.search || filters.cefr || filters.type || filters.topic 
                ? "Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc" 
                : "Bắt đầu bằng cách thêm từ vựng đầu tiên của bạn"}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm từ đầu tiên
              </button>
              <button
                onClick={handleBulkImport}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center"
              >
                <FileUp className="w-5 h-5 mr-2" />
                Import Hàng Loạt
              </button>
            </div>
          </div>
        )}

        {loading && vocabs.length > 0 && (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200 rounded-2xl shadow-xl">
            <div className="flex-1 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-semibold text-indigo-600">{startIndex + 1}</span> đến{' '}
                  <span className="font-semibold text-indigo-600">{Math.min(endIndex, totalElements)}</span>{' '}
                  trong tổng số <span className="font-semibold text-indigo-600">{totalElements}</span> từ
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (currentPage <= 2) {
                      pageNum = i;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg transition-all ${
                          currentPage === pageNum
                            ? 'z-10 bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent text-white shadow-lg'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                  disabled={currentPage === totalPages - 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  Sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && selectedVocab && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-white mr-3" />
                  <h3 className="text-xl font-bold text-white">Xác nhận xóa</h3>
                </div>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedVocab(null);
                  }}
                  className="text-white/90 hover:text-white transition-colors"
                  disabled={deleteLoading === selectedVocab.id}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Xóa từ "{selectedVocab.word}"
                </h4>
                <p className="text-gray-600">
                  Bạn có chắc chắn muốn xóa từ vựng này? Hành động này không thể hoàn tác.
                </p>
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-700 text-sm">
                    <span className="font-bold">Cảnh báo:</span> Tất cả dữ liệu liên quan bao gồm hình ảnh, âm thanh và ví dụ sẽ bị xóa vĩnh viễn.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedVocab(null);
                  }}
                  disabled={deleteLoading === selectedVocab.id}
                  className="flex-1 px-4 py-3 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all font-medium hover:shadow-md"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading === selectedVocab.id}
                  className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  {deleteLoading === selectedVocab.id ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5 mr-2" />
                      Xóa vĩnh viễn
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default VocabList;