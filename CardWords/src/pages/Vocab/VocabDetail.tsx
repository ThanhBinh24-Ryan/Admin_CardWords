import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vocabService } from '../../services/vocabService';
import { 
  ArrowLeft, 
  Volume2, 
  Edit, 
  Calendar, 
  Hash, 
  BookOpen, 
  MessageSquare, 
  Tag, 
  Bookmark, 
  Layers, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Loader2,
  Award,
  Type,
  FileText,
  Languages
} from 'lucide-react';

interface Vocab {
  id: string;
  createdAt: string;
  updatedAt: string;
  audio: string;
  cefr: string;
  exampleSentence: string;
  img: string;
  interpret: string;
  meaningVi: string;
  transcription: string;
  word: string;
  credit: string;
  topic?: Topic;
  types?: VocabType[];
}

interface Topic {
  id: number;
  name: string;
}

interface VocabType {
  id: number;
  name: string;
}

const VocabDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vocab, setVocab] = useState<Vocab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchVocabDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await vocabService.getVocabById(id);
        setVocab(response.data);
        
      } catch (err: any) {
        console.error('Error fetching vocab detail:', err);
        setError(err.message || 'Không thể tải thông tin từ vựng');
      } finally {
        setLoading(false);
      }
    };

    fetchVocabDetail();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/vocabs/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/admin/vocabs');
  };

  const playAudio = async () => {
    if (!vocab?.audio) return;

    setPlayingAudio(true);
    const audio = new Audio(vocab.audio);
    
    audio.onended = () => setPlayingAudio(false);
    audio.onerror = () => {
      setPlayingAudio(false);
      alert('Không thể phát audio');
    };

    try {
      await audio.play();
    } catch (error) {
      setPlayingAudio(false);
      console.error('Audio play failed:', error);
    }
  };

  const getCefrBadge = (cefr: string) => {
    const cefrColors: { [key: string]: string } = {
      'A1': 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-200',
      'A2': 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-300',
      'B1': 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-200',
      'B2': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-300',
      'C1': 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg shadow-purple-200',
      'C2': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-300'
    };
    
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-bold ${cefrColors[cefr] || 'bg-gray-100 text-gray-800'} transform transition-all hover:scale-105 flex items-center`}>
        <Award className="w-4 h-4 mr-1" />
        CEFR {cefr}
      </span>
    );
  };

  const getWordTypeBadge = (types: VocabType[] = []) => {
    if (types.length === 0) return null;
    
    const typeColors: { [key: string]: string } = {
      'noun': 'from-blue-400 to-blue-500',
      'verb': 'from-red-400 to-red-500',
      'adjective': 'from-green-400 to-green-500',
      'adverb': 'from-yellow-400 to-yellow-500',
      'interjection': 'from-purple-400 to-purple-500',
      'preposition': 'from-indigo-400 to-indigo-500'
    };
    
    const mainType = types[0].name.toLowerCase();
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${typeColors[mainType] || 'from-gray-400 to-gray-500'} text-white shadow-lg transform transition-all hover:scale-105 flex items-center`}>
        <Type className="w-4 h-4 mr-1" />
        {types[0].name}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] space-y-4">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Đang tải thông tin từ vựng...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 mr-2" />
            Lỗi khi tải dữ liệu
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform transition-all hover:scale-105 shadow-lg font-medium flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  if (!vocab) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="text-gray-300 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 mr-2" />
            Không tìm thấy từ vựng
          </h2>
          <p className="text-gray-600 mb-6">Từ vựng bạn đang tìm kiếm không tồn tại.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform transition-all hover:scale-105 shadow-lg font-medium flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 animate-fade-in">
          <div className="flex-1">
            <button
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-all transform hover:translate-x-[-4px] group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              <span className="font-medium">Quay lại danh sách</span>
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center">
              <BookOpen className="w-8 h-8 mr-3" />
              Chi tiết từ vựng
            </h1>
            <p className="text-gray-600 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Thông tin đầy đủ về từ "<span className="font-semibold text-gray-800">{vocab.word}</span>"
            </p>
          </div>
          <button
            onClick={handleEdit}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center transition-all transform hover:scale-105 shadow-lg font-medium"
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all hover:shadow-2xl">
              <div className="h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
                {vocab.img ? (
                  <>
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      </div>
                    )}
                    <img
                      src={vocab.img}
                      alt={vocab.word}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        setImageLoaded(true);
                      }}
                    />
                  </>
                ) : (
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                    <Type className="w-12 h-12 mr-3" />
                    {vocab.word}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Languages className="w-6 h-6 mr-2" />
                    {vocab.word}
                  </h2>
                  {vocab.audio && (
                    <button
                      onClick={playAudio}
                      disabled={playingAudio}
                      className={`p-3 rounded-full transition-all transform ${
                        playingAudio 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-110 shadow-lg'
                      }`}
                      title="Phát phát âm"
                    >
                      {playingAudio ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Phiên âm
                    </span>
                    <p className="text-xl text-gray-800 font-mono mt-1 flex items-center">
                      {vocab.transcription || 'Chưa có phiên âm'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Nghĩa tiếng Việt
                    </span>
                    <p className="text-2xl text-gray-900 font-bold mt-1">{vocab.meaningVi}</p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {getCefrBadge(vocab.cefr)}
                    {getWordTypeBadge(vocab.types)}
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Hash className="w-5 h-5 mr-2 text-blue-500" />
                Thông tin hệ thống
              </h3>
              <dl className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <dt className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Ngày tạo</dt>
                    <dd className="text-sm text-gray-900 font-medium mt-1">
                      {new Date(vocab.createdAt).toLocaleString('vi-VN')}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <dt className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Cập nhật lần cuối</dt>
                    <dd className="text-sm text-gray-900 font-medium mt-1">
                      {new Date(vocab.updatedAt).toLocaleString('vi-VN')}
                    </dd>
                  </div>
                </div>
                {vocab.credit && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Bookmark className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div className="flex-1">
                      <dt className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Nguồn tham khảo</dt>
                      <dd className="text-sm text-gray-900 font-medium mt-1">{vocab.credit}</dd>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <dt className="text-xs text-gray-500 font-semibold uppercase tracking-wide">ID từ vựng</dt>
                    <dd className="text-xs text-gray-700 font-mono bg-white px-2 py-1 rounded border border-gray-200 mt-1 break-all">
                      {vocab.id}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Definition */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all hover:shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
                Định nghĩa & Cách dùng
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-xl border-l-4 border-blue-500">
                  {vocab.interpret}
                </p>
              </div>
            </div>

            {/* Example Sentence */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all hover:shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-green-500" />
                Câu ví dụ
              </h3>
              <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-400 to-blue-400"></div>
                <p className="text-gray-800 italic text-xl leading-relaxed pl-4 flex items-start">
                  <FileText className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                  "{vocab.exampleSentence}"
                </p>
              </div>
            </div>

            {/* Topic */}
            {vocab.topic && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all hover:shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-6 h-6 mr-2 text-purple-500" />
                  Chủ đề
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer shadow-lg transform hover:scale-105 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    {vocab.topic.name}
                  </span>
                </div>
              </div>
            )}

            {/* Word Types */}
            {vocab.types && vocab.types.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all hover:shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Layers className="w-6 h-6 mr-2 text-orange-500" />
                  Phân loại từ
                </h3>
                <div className="flex flex-wrap gap-3">
                  {vocab.types.map(type => (
                    <span
                      key={type.id}
                      className="px-5 py-3 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-xl font-bold shadow-lg transform transition-all hover:scale-105 flex items-center"
                    >
                      <Type className="w-4 h-4 mr-2" />
                      {type.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Notes */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all hover:shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle2 className="w-6 h-6 mr-2 text-teal-500" />
                Ghi chú sử dụng
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start p-4 bg-gradient-to-r from-teal-50 to-transparent rounded-xl border-l-4 border-teal-400">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="leading-relaxed flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Từ vựng cấp độ <span className="font-bold text-teal-600 mx-1">{vocab.cefr}</span> - phù hợp cho người học tiếng Anh
                  </p>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border-l-4 border-blue-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="leading-relaxed flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Có thể sử dụng trong cả ngữ cảnh trang trọng và thân mật
                  </p>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-xl border-l-4 border-purple-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="leading-relaxed flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Thường xuyên xuất hiện trong giao tiếp hàng ngày
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 font-medium shadow-md flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </button>
          <button
            onClick={handleEdit}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-medium flex items-center shadow-lg"
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa từ vựng
          </button>
        </div>
      </div>
    </div>
  );
};

export default VocabDetail;