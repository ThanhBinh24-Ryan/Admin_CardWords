
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { vocabService } from '../../services/vocabService'; // ĐÃ SỬA

// interface Vocab {
//   id: string;
//   createdAt: string;
//   updatedAt: string;
//   audio: string;
//   cefr: string;
//   exampleSentence: string;
//   img: string;
//   interpret: string;
//   meaningVi: string;
//   transcription: string;
//   word: string;
//   credit: string;
//   topic?: Topic;
//   types?: VocabType[];
// }

// interface Topic {
//   id: number;
//   name: string;
// }

// interface VocabType {
//   id: number;
//   name: string;
// }

// const VocabDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [vocab, setVocab] = useState<Vocab | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [playingAudio, setPlayingAudio] = useState(false);

//   useEffect(() => {
//     const fetchVocabDetail = async () => {
//       if (!id) return;
      
//       try {
//         setLoading(true);
//         setError(null);
        
//         const response = await vocabService.getVocabById(id); // ĐÃ SỬA
//         setVocab(response.data);
        
//       } catch (err: any) {
//         console.error('Error fetching vocab detail:', err);
//         setError(err.message || 'Không thể tải thông tin từ vựng'); // ĐÃ SỬA
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVocabDetail();
//   }, [id]);

//   const handleEdit = () => {
//     navigate(`/admin/vocabs/${id}/edit`); // ĐÃ SỬA route
//   };

//   const handleBack = () => {
//     navigate('/admin/vocabs'); // ĐÃ SỬA route
//   };

//   const playAudio = async () => {
//     if (!vocab?.audio) return;

//     setPlayingAudio(true);
//     const audio = new Audio(vocab.audio);
    
//     audio.onended = () => setPlayingAudio(false);
//     audio.onerror = () => {
//       setPlayingAudio(false);
//       alert('Không thể phát audio');
//     };

//     try {
//       await audio.play();
//     } catch (error) {
//       setPlayingAudio(false);
//       console.error('Audio play failed:', error);
//     }
//   };

//   const getCefrBadge = (cefr: string) => {
//     const cefrColors: { [key: string]: string } = {
//       'A1': 'bg-green-100 text-green-800 border-green-200',
//       'A2': 'bg-green-200 text-green-800 border-green-300',
//       'B1': 'bg-blue-100 text-blue-800 border-blue-200',
//       'B2': 'bg-blue-200 text-blue-800 border-blue-300',
//       'C1': 'bg-purple-100 text-purple-800 border-purple-200',
//       'C2': 'bg-purple-200 text-purple-800 border-purple-300'
//     };
    
//     return (
//       <span className={`px-3 py-1 rounded-full text-sm font-medium border ${cefrColors[cefr] || 'bg-gray-100 text-gray-800'}`}>
//         CEFR {cefr}
//       </span>
//     );
//   };

//   const getWordTypeBadge = (types: VocabType[] = []) => {
//     if (types.length === 0) return null;
    
//     const typeColors: { [key: string]: string } = {
//       'noun': 'bg-blue-100 text-blue-800 border-blue-200',
//       'verb': 'bg-red-100 text-red-800 border-red-200',
//       'adjective': 'bg-green-100 text-green-800 border-green-200',
//       'adverb': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'interjection': 'bg-purple-100 text-purple-800 border-purple-200',
//       'preposition': 'bg-indigo-100 text-indigo-800 border-indigo-200'
//     };
    
//     const mainType = types[0].name.toLowerCase();
//     return (
//       <span className={`px-3 py-1 rounded-full text-sm font-medium border ${typeColors[mainType] || 'bg-gray-100 text-gray-800'}`}>
//         {types[0].name}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Lỗi khi tải dữ liệu</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={handleBack}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Quay lại danh sách
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!vocab) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <div className="text-gray-400 text-6xl mb-4">🔍</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy từ vựng</h2>
//           <p className="text-gray-600 mb-6">Từ vựng bạn đang tìm kiếm không tồn tại.</p>
//           <button
//             onClick={handleBack}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Quay lại danh sách
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
//         <div className="flex-1">
//           <button
//             onClick={handleBack}
//             className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Quay lại danh sách
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">Chi tiết từ vựng</h1>
//           <p className="text-gray-600 mt-2">Thông tin đầy đủ về từ "{vocab.word}"</p>
//         </div>
//         <button
//           onClick={handleEdit}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors shadow-sm"
//         >
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//           </svg>
//           Chỉnh sửa
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column - Image and Basic Info */}
//         <div className="lg:col-span-1 space-y-6">
//           {/* Image Card */}
//           <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
//             <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
//               {vocab.img ? (
//                 <img
//                   src={vocab.img}
//                   alt={vocab.word}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.style.display = 'none';
//                     const parent = target.parentElement;
//                     if (parent) {
//                       parent.className = 'h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center';
//                       const fallback = document.createElement('div');
//                       fallback.className = 'text-4xl font-bold text-gray-600';
//                       fallback.textContent = vocab.word;
//                       parent.appendChild(fallback);
//                     }
//                   }}
//                 />
//               ) : (
//                 <div className="text-4xl font-bold text-gray-600">{vocab.word}</div>
//               )}
//             </div>

//             {/* Basic Info */}
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-2xl font-bold text-gray-900">{vocab.word}</h2>
//                 {vocab.audio && (
//                   <button
//                     onClick={playAudio}
//                     disabled={playingAudio}
//                     className={`p-3 rounded-full transition-all ${
//                       playingAudio 
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                         : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105'
//                     }`}
//                     title="Phát phát âm"
//                   >
//                     {playingAudio ? (
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
//                     ) : (
//                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.796L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-2.796a1 1 0 011.2-.128zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
//                       </svg>
//                     )}
//                   </button>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <span className="text-sm text-gray-500 font-medium">Phiên âm</span>
//                   <p className="text-lg text-gray-800 font-mono mt-1">{vocab.transcription || 'Chưa có phiên âm'}</p>
//                 </div>

//                 <div>
//                   <span className="text-sm text-gray-500 font-medium">Nghĩa tiếng Việt</span>
//                   <p className="text-xl text-gray-900 font-semibold mt-1">{vocab.meaningVi}</p>
//                 </div>

//                 <div className="flex flex-wrap gap-2 pt-2">
//                   {getCefrBadge(vocab.cefr)}
//                   {getWordTypeBadge(vocab.types)}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Metadata */}
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//               <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Thông tin hệ thống
//             </h3>
//             <dl className="space-y-3">
//               <div>
//                 <dt className="text-sm text-gray-500">Ngày tạo</dt>
//                 <dd className="text-sm text-gray-900 font-medium">
//                   {new Date(vocab.createdAt).toLocaleString('vi-VN')}
//                 </dd>
//               </div>
//               <div>
//                 <dt className="text-sm text-gray-500">Cập nhật lần cuối</dt>
//                 <dd className="text-sm text-gray-900 font-medium">
//                   {new Date(vocab.updatedAt).toLocaleString('vi-VN')}
//                 </dd>
//               </div>
//               {vocab.credit && (
//                 <div>
//                   <dt className="text-sm text-gray-500">Nguồn tham khảo</dt>
//                   <dd className="text-sm text-gray-900 font-medium">{vocab.credit}</dd>
//                 </div>
//               )}
//               <div>
//                 <dt className="text-sm text-gray-500">ID từ vựng</dt>
//                 <dd className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">{vocab.id}</dd>
//               </div>
//             </dl>
//           </div>
//         </div>

//         {/* Right Column - Detailed Information */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Definition */}
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//               <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               Định nghĩa & Cách dùng
//             </h3>
//             <div className="prose max-w-none">
//               <p className="text-gray-700 leading-relaxed text-lg">{vocab.interpret}</p>
//             </div>
//           </div>

//           {/* Example Sentence */}
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//               <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//               </svg>
//               Câu ví dụ
//             </h3>
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
//               <p className="text-gray-800 italic text-xl leading-relaxed">"{vocab.exampleSentence}"</p>
//             </div>
//           </div>

//           {/* Topic */}
//           {vocab.topic && (
//             <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//                 </svg>
//                 Chủ đề
//               </h3>
//               <div className="flex flex-wrap gap-3">
//                 <span
//                   className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg font-medium hover:from-purple-200 hover:to-pink-200 transition-all cursor-pointer border border-purple-200"
//                 >
//                   {vocab.topic.name}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Word Types */}
//           {vocab.types && vocab.types.length > 0 && (
//             <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                 </svg>
//                 Phân loại từ
//               </h3>
//               <div className="flex flex-wrap gap-3">
//                 {vocab.types.map(type => (
//                   <span
//                     key={type.id}
//                     className="px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-lg font-medium border border-orange-200"
//                   >
//                     {type.name}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Usage Notes */}
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//               <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Ghi chú sử dụng
//             </h3>
//             <div className="space-y-4 text-gray-700">
//               <div className="flex items-start">
//                 <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
//                 <p className="leading-relaxed">Từ vựng cấp độ {vocab.cefr} - phù hợp cho người mới bắt đầu học tiếng Anh</p>
//               </div>
//               <div className="flex items-start">
//                 <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
//                 <p className="leading-relaxed">Có thể sử dụng trong cả ngữ cảnh trang trọng và thân mật</p>
//               </div>
//               <div className="flex items-start">
//                 <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
//                 <p className="leading-relaxed">Thường xuyên xuất hiện trong giao tiếp hàng ngày</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
//         <button
//           onClick={handleBack}
//           className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//         >
//           Quay lại danh sách
//         </button>
//         <button
//           onClick={handleEdit}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
//         >
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//           </svg>
//           Chỉnh sửa từ vựng
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VocabDetail;

















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
  Loader2
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
      <span className={`px-4 py-2 rounded-full text-sm font-bold ${cefrColors[cefr] || 'bg-gray-100 text-gray-800'} transform transition-all hover:scale-105`}>
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
      <span className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${typeColors[mainType] || 'from-gray-400 to-gray-500'} text-white shadow-lg transform transition-all hover:scale-105`}>
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
        <p className="text-gray-600 font-medium animate-pulse">Đang tải thông tin từ vựng...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi khi tải dữ liệu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform transition-all hover:scale-105 shadow-lg font-medium"
          >
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy từ vựng</h2>
          <p className="text-gray-600 mb-6">Từ vựng bạn đang tìm kiếm không tồn tại.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transform transition-all hover:scale-105 shadow-lg font-medium"
          >
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Chi tiết từ vựng
            </h1>
            <p className="text-gray-600">Thông tin đầy đủ về từ "<span className="font-semibold text-gray-800">{vocab.word}</span>"</p>
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
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {vocab.word}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900">{vocab.word}</h2>
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
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Phiên âm</span>
                    <p className="text-xl text-gray-800 font-mono mt-1">{vocab.transcription || 'Chưa có phiên âm'}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Nghĩa tiếng Việt</span>
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
                <p className="text-gray-800 italic text-xl leading-relaxed pl-4">
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
                  <span className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer shadow-lg transform hover:scale-105">
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
                      className="px-5 py-3 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-xl font-bold shadow-lg transform transition-all hover:scale-105"
                    >
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
                  <p className="leading-relaxed">Từ vựng cấp độ <span className="font-bold text-teal-600">{vocab.cefr}</span> - phù hợp cho người học tiếng Anh</p>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border-l-4 border-blue-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="leading-relaxed">Có thể sử dụng trong cả ngữ cảnh trang trọng và thân mật</p>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-xl border-l-4 border-purple-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="leading-relaxed">Thường xuyên xuất hiện trong giao tiếp hàng ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 font-medium shadow-md"
          >
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