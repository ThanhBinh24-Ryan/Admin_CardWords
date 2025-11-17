
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { vocabService } from '../../services/vocabService';
// import { storageService } from '../../services/storageService';
// import { CreateVocabRequest, UpdateVocabRequest } from '../../types/vocab';

// interface VocabFormData {
//   word: string;
//   transcription: string;
//   meaningVi: string;
//   interpret: string;
//   exampleSentence: string;
//   cefr: string;
//   img: string;
//   audio: string;
//   types: string[];
//   topic: string;
//   credit: string;
// }

// const VocabForm: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const isEdit = Boolean(id);
  
//   const [form, setForm] = useState<VocabFormData>({
//     word: '',
//     transcription: '',
//     meaningVi: '',
//     interpret: '',
//     exampleSentence: '',
//     cefr: '',
//     img: '',
//     audio: '',
//     types: [],
//     topic: '',
//     credit: ''
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [uploadProgress, setUploadProgress] = useState<{image: boolean, audio: boolean}>({
//     image: false,
//     audio: false
//   });

//   // Data for dropdowns
//   const [availableTopics, setAvailableTopics] = useState<any[]>([]);
//   const [availableWordTypes, setAvailableWordTypes] = useState<any[]>([]);

//   const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

//   // Fetch dropdown data
//   useEffect(() => {
//     const mockTopics = [
//       { id: 1, name: 'Food & Drink' },
//       { id: 2, name: 'Travel' },
//       { id: 3, name: 'Business' },
//       { id: 4, name: 'Technology' },
//       { id: 5, name: 'Health' },
//       { id: 6, name: 'Education' }
//     ];

//     const mockWordTypes = [
//       { id: 1, name: 'noun' },
//       { id: 2, name: 'verb' },
//       { id: 3, name: 'adjective' },
//       { id: 4, name: 'adverb' },
//       { id: 5, name: 'preposition' },
//       { id: 6, name: 'conjunction' }
//     ];

//     setAvailableTopics(mockTopics);
//     setAvailableWordTypes(mockWordTypes);
//   }, []);

//   // Fetch vocab data for editing - CHỈ khi là edit mode và có ID hợp lệ
//   useEffect(() => {
//     const isValidUUID = (id: string) => {
//       const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//       return uuidRegex.test(id);
//     };

//     if (isEdit && id && isValidUUID(id)) {
//       const fetchVocab = async () => {
//         try {
//           setLoading(true);
//           setError(null);
          
//           console.log('🔄 Fetching vocab data for ID:', id);
//           const response = await vocabService.getVocabById(id);
//           const vocab = response.data;
          
//           setForm({
//             word: vocab.word || '',
//             transcription: vocab.transcription || '',
//             meaningVi: vocab.meaningVi || '',
//             interpret: vocab.interpret || '',
//             exampleSentence: vocab.exampleSentence || '',
//             cefr: vocab.cefr || '',
//             img: vocab.img || '',
//             audio: vocab.audio || '',
//             types: vocab.types?.map((t: any) => t.name) || [],
//             topic: vocab.topic?.name || '',
//             credit: vocab.credit || ''
//           });
          
//         } catch (err: any) {
//           console.error('Error fetching vocab:', err);
//           setError(err.message || 'Failed to load vocabulary data');
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchVocab();
//     } else {
//       // Nếu là create mode, reset form về trống
//       console.log('➕ Create new vocab mode');
//       setLoading(false);
//     }
//   }, [isEdit, id]);

//   // Hàm compress ảnh trước khi upload
//   const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<File> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
      
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target?.result as string;
        
//         img.onload = () => {
//           const canvas = document.createElement('canvas');
//           let width = img.width;
//           let height = img.height;
          
//           // Resize nếu ảnh quá lớn
//           if (width > maxWidth) {
//             height = (height * maxWidth) / width;
//             width = maxWidth;
//           }
          
//           canvas.width = width;
//           canvas.height = height;
          
//           const ctx = canvas.getContext('2d');
//           ctx?.drawImage(img, 0, 0, width, height);
          
//           canvas.toBlob(
//             (blob) => {
//               if (blob) {
//                 const compressedFile = new File([blob], file.name, {
//                   type: 'image/jpeg',
//                   lastModified: Date.now(),
//                 });
//                 resolve(compressedFile);
//               } else {
//                 reject(new Error('Compression failed'));
//               }
//             },
//             'image/jpeg',
//             quality
//           );
//         };
        
//         img.onerror = reject;
//       };
      
//       reader.onerror = reject;
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError(null);

//     try {
//       // Validation
//       const requiredFields = {
//         word: form.word,
//         meaningVi: form.meaningVi,
//         interpret: form.interpret,
//         exampleSentence: form.exampleSentence,
//         cefr: form.cefr
//       };

//       const emptyFields = Object.entries(requiredFields)
//         .filter(([_, value]) => !value || value.trim() === '')
//         .map(([key]) => key);

//       if (emptyFields.length > 0) {
//         throw new Error(`Các trường bắt buộc chưa điền: ${emptyFields.join(', ')}`);
//       }

//       if (form.types.length === 0) {
//         throw new Error('Vui lòng chọn ít nhất một loại từ');
//       }

//       // Prepare data for API - CHUẨN theo API spec
//       const submitData: CreateVocabRequest | UpdateVocabRequest = {
//         word: form.word.trim(),
//         transcription: form.transcription.trim() || undefined,
//         meaningVi: form.meaningVi.trim(),
//         interpret: form.interpret.trim(),
//         exampleSentence: form.exampleSentence.trim(),
//         cefr: form.cefr,
//         img: form.img || undefined,
//         audio: form.audio || undefined,
//         credit: form.credit.trim() || undefined,
//         types: form.types,
//         topic: form.topic || undefined
//       };

//       console.log('📤 Sending data to server:', submitData);

//       // Gọi API theo mode
//       if (isEdit && id) {
//         console.log('✏️ Updating vocab with ID:', id);
//         await vocabService.updateVocabById(id, submitData as UpdateVocabRequest);
//       } else {
//         console.log('➕ Creating new vocab');
//         await vocabService.createVocab(submitData as CreateVocabRequest);
//       }

//       // Thông báo thành công và redirect
//       alert(isEdit ? 'Cập nhật từ vựng thành công!' : 'Thêm từ vựng mới thành công!');
//       navigate('/admin/vocabs');
      
//     } catch (err: any) {
//       console.error('Lỗi khi lưu từ vựng:', err);
//       setError(err.message || 'Lỗi khi lưu từ vựng');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/admin/vocabs');
//   };

//   const handleChange = (field: keyof VocabFormData, value: any) => {
//     setForm(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleArrayToggle = (field: 'types', value: string) => {
//     setForm(prev => ({
//       ...prev,
//       [field]: prev[field].includes(value)
//         ? prev[field].filter(item => item !== value)
//         : [...prev[field], value]
//     }));
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       try {
//         setUploadProgress(prev => ({...prev, image: true}));
//         setError(null);

//         console.log('📁 Original file size:', (file.size / (1024 * 1024)).toFixed(2) + ' MB');

//         // Validate file type
//         const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//         if (!allowedImageTypes.includes(file.type)) {
//           throw new Error('Chỉ chấp nhận file ảnh: JPG, PNG, GIF, WebP');
//         }

//         let fileToUpload = file;
        
//         // Nếu file lớn hơn 500KB thì compress
//         if (file.size > 500 * 1024) {
//           console.log('🔄 Compressing image...');
//           fileToUpload = await compressImage(file);
//           console.log('📁 Compressed file size:', (fileToUpload.size / (1024 * 1024)).toFixed(2) + ' MB');
//         }

//         // Validate file size sau khi compress (max 1MB để an toàn)
//         const maxSize = 1 * 1024 * 1024;
//         if (fileToUpload.size > maxSize) {
//           throw new Error(`File vẫn còn quá lớn sau khi nén (${(fileToUpload.size / (1024 * 1024)).toFixed(2)}MB). Vui lòng chọn ảnh nhỏ hơn.`);
//         }

//         console.log('🔄 Bắt đầu upload ảnh...');
//         const response = await storageService.uploadImage(fileToUpload);
//         console.log('✅ Upload response:', response);

//         // Lấy URL từ response
//         let imageUrl = '';
        
//         if (response.data?.url) {
//           imageUrl = response.data.url;
//         }  else {
//           // Thử các cách khác để lấy URL
//           const data = response.data || response;
//           if (typeof data === 'object') {
//             const firstValue = Object.values(data)[0];
//             if (typeof firstValue === 'string' && firstValue.startsWith('http')) {
//               imageUrl = firstValue;
//             }
//           }
//         }

//         if (!imageUrl) {
//           console.warn('⚠️ Không tìm thấy URL trong response:', response);
//           throw new Error('Không thể lấy URL ảnh từ server');
//         }

//         console.log('🖼️ Image URL:', imageUrl);
//         handleChange('img', imageUrl);
        
//       } catch (err: any) {
//         console.error('❌ Lỗi upload ảnh:', err);
//         setError(`Lỗi upload ảnh: ${err.message}`);
        
//         // Reset file input
//         e.target.value = '';
//       } finally {
//         setUploadProgress(prev => ({...prev, image: false}));
//       }
//     }
//   };

//   const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       try {
//         setUploadProgress(prev => ({...prev, audio: true}));
//         setError(null);

//         console.log('📁 Audio file size:', (file.size / (1024 * 1024)).toFixed(2) + ' MB');

//         // Validate file type
//         const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
//         if (!allowedAudioTypes.includes(file.type)) {
//           throw new Error('Chỉ chấp nhận file audio: MP3, WAV, OGG');
//         }

//         // Validate file size (max 5MB để an toàn)
//         const maxSize = 5 * 1024 * 1024;
//         if (file.size > maxSize) {
//           throw new Error(`Kích thước file (${(file.size / (1024 * 1024)).toFixed(2)}MB) vượt quá giới hạn 5MB. Vui lòng chọn file nhỏ hơn.`);
//         }

//         console.log('🔄 Bắt đầu upload audio...');
//         const response = await storageService.uploadAudio(file);
//         console.log('✅ Audio upload response:', response);

//         // Lấy URL từ response
//         let audioUrl = '';
        
//         if (response.data?.url) {
//           audioUrl = response.data.url;
//         } else {
//           const data = response.data || response;
//           if (typeof data === 'object') {
//             const firstValue = Object.values(data)[0];
//             if (typeof firstValue === 'string' && firstValue.startsWith('http')) {
//               audioUrl = firstValue;
//             }
//           }
//         }

//         if (!audioUrl) {
//           console.warn('⚠️ Không tìm thấy audio URL trong response:', response);
//           throw new Error('Không thể lấy URL audio từ server');
//         }

//         console.log('🔊 Audio URL:', audioUrl);
//         handleChange('audio', audioUrl);
        
//       } catch (err: any) {
//         console.error('❌ Lỗi upload audio:', err);
//         setError(`Lỗi upload audio: ${err.message}`);
        
//         // Reset file input
//         e.target.value = '';
//       } finally {
//         setUploadProgress(prev => ({...prev, audio: false}));
//       }
//     }
//   };

//   const removeImage = () => {
//     handleChange('img', '');
//   };

//   const removeAudio = () => {
//     handleChange('audio', '');
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-4xl">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           {isEdit ? 'Sửa từ vựng' : 'Thêm từ vựng mới'}
//         </h1>
//         <p className="text-gray-600">
//           {isEdit 
//             ? 'Cập nhật thông tin từ vựng' 
//             : 'Tạo từ vựng mới cho hệ thống'
//           }
//         </p>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Basic Information */}
//               <div className="lg:col-span-2">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Thông tin cơ bản</h3>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Từ vựng *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={form.word}
//                   onChange={(e) => handleChange('word', e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Nhập từ vựng"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phiên âm
//                 </label>
//                 <input
//                   type="text"
//                   value={form.transcription}
//                   onChange={(e) => handleChange('transcription', e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="/həˈləʊ/"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Nghĩa tiếng Việt *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={form.meaningVi}
//                   onChange={(e) => handleChange('meaningVi', e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Nhập nghĩa tiếng Việt"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   CEFR Level *
//                 </label>
//                 <select
//                   required
//                   value={form.cefr}
//                   onChange={(e) => handleChange('cefr', e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Chọn cấp độ CEFR</option>
//                   {cefrLevels.map(level => (
//                     <option key={level} value={level}>{level}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Chủ đề
//                 </label>
//                 <select
//                   value={form.topic}
//                   onChange={(e) => handleChange('topic', e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Chọn chủ đề</option>
//                   {availableTopics.map(topic => (
//                     <option key={topic.id} value={topic.name}>{topic.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Nguồn
//                 </label>
//                 <input
//                   type="text"
//                   value={form.credit}
//                   onChange={(e) => handleChange('credit', e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Oxford Dictionary, Cambridge, etc."
//                 />
//               </div>

//               {/* Word Types */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Loại từ *
//                 </label>
//                 <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
//                   {availableWordTypes.map(type => (
//                     <label key={type.id} className="flex items-center mb-2">
//                       <input
//                         type="checkbox"
//                         checked={form.types.includes(type.name)}
//                         onChange={() => handleArrayToggle('types', type.name)}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">{type.name}</span>
//                     </label>
//                   ))}
//                 </div>
//                 {form.types.length === 0 && (
//                   <p className="text-red-500 text-sm mt-1">Vui lòng chọn ít nhất một loại từ</p>
//                 )}
//               </div>

//               {/* Detailed Information */}
//               <div className="lg:col-span-2">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Thông tin chi tiết</h3>
//               </div>

//               <div className="lg:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Định nghĩa tiếng Anh *
//                 </label>
//                 <textarea
//                   required
//                   value={form.interpret}
//                   onChange={(e) => handleChange('interpret', e.target.value)}
//                   rows={3}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Định nghĩa và giải thích cách dùng bằng tiếng Anh"
//                 />
//               </div>

//               <div className="lg:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Câu ví dụ *
//                 </label>
//                 <textarea
//                   required
//                   value={form.exampleSentence}
//                   onChange={(e) => handleChange('exampleSentence', e.target.value)}
//                   rows={2}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Câu ví dụ thể hiện cách dùng từ"
//                 />
//               </div>

//               {/* Media Uploads */}
//               <div className="lg:col-span-2">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">File đa phương tiện</h3>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Hình ảnh
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
//                   {form.img ? (
//                     <div className="mb-2">
//                       <img src={form.img} alt="Preview" className="h-32 mx-auto object-cover rounded" />
//                       <button
//                         type="button"
//                         onClick={removeImage}
//                         className="text-red-600 text-sm mt-2 hover:text-red-800"
//                       >
//                         Xóa ảnh
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="hidden"
//                         id="image-upload"
//                         disabled={uploadProgress.image}
//                       />
//                       <label 
//                         htmlFor="image-upload" 
//                         className={`cursor-pointer block ${uploadProgress.image ? 'opacity-50' : ''}`}
//                       >
//                         <div className="text-gray-400 mb-2">
//                           {uploadProgress.image ? (
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                           ) : (
//                             <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                           )}
//                         </div>
//                         <span className="text-sm text-gray-600">
//                           {uploadProgress.image ? 'Đang upload...' : 'Click để upload ảnh'}
//                         </span>
//                         <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP (tối đa 1MB)</p>
//                       </label>
//                     </>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Audio phát âm
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
//                   {form.audio ? (
//                     <div className="mb-2">
//                       <div className="text-green-600 mb-2">
//                         <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                         </svg>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={removeAudio}
//                         className="text-red-600 text-sm hover:text-red-800"
//                       >
//                         Xóa audio
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <input
//                         type="file"
//                         accept="audio/*"
//                         onChange={handleAudioUpload}
//                         className="hidden"
//                         id="audio-upload"
//                         disabled={uploadProgress.audio}
//                       />
//                       <label 
//                         htmlFor="audio-upload" 
//                         className={`cursor-pointer block ${uploadProgress.audio ? 'opacity-50' : ''}`}
//                       >
//                         <div className="text-gray-400 mb-2">
//                           {uploadProgress.audio ? (
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                           ) : (
//                             <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//                             </svg>
//                           )}
//                         </div>
//                         <span className="text-sm text-gray-600">
//                           {uploadProgress.audio ? 'Đang upload...' : 'Click để upload audio'}
//                         </span>
//                         <p className="text-xs text-gray-500 mt-1">MP3, WAV, OGG (tối đa 5MB)</p>
//                       </label>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 disabled={saving}
//                 className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//               >
//                 Hủy
//               </button>
//               <button
//                 type="submit"
//                 disabled={saving || uploadProgress.image || uploadProgress.audio}
//                 className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
//               >
//                 {saving && (
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 )}
//                 {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo từ vựng')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default VocabForm;














import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vocabService } from '../../services/vocabService';
import { storageService } from '../../services/storageService';
import { CreateVocabRequest, UpdateVocabRequest } from '../../types/vocab';
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
  ArrowLeft
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
  
  const [form, setForm] = useState<VocabFormData>({
    word: '',
    transcription: '',
    meaningVi: '',
    interpret: '',
    exampleSentence: '',
    cefr: '',
    img: '',
    audio: '',
    types: [],
    topic: '',
    credit: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{image: boolean, audio: boolean}>({
    image: false,
    audio: false
  });

  // Data for dropdowns
  const [availableTopics, setAvailableTopics] = useState<any[]>([]);
  const [availableWordTypes, setAvailableWordTypes] = useState<any[]>([]);

  const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  // Fetch dropdown data
  useEffect(() => {
    const mockTopics = [
      { id: 1, name: 'Food & Drink' },
      { id: 2, name: 'Travel' },
      { id: 3, name: 'Business' },
      { id: 4, name: 'Technology' },
      { id: 5, name: 'Health' },
      { id: 6, name: 'Education' }
    ];

    const mockWordTypes = [
      { id: 1, name: 'noun' },
      { id: 2, name: 'verb' },
      { id: 3, name: 'adjective' },
      { id: 4, name: 'adverb' },
      { id: 5, name: 'preposition' },
      { id: 6, name: 'conjunction' }
    ];

    setAvailableTopics(mockTopics);
    setAvailableWordTypes(mockWordTypes);
  }, []);

  // Fetch vocab data for editing
  useEffect(() => {
    const isValidUUID = (id: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(id);
    };

    if (isEdit && id && isValidUUID(id)) {
      const fetchVocab = async () => {
        try {
          setLoading(true);
          setError(null);
          
          console.log('🔄 Fetching vocab data for ID:', id);
          const response = await vocabService.getVocabById(id);
          const vocab = response.data;
          
          setForm({
            word: vocab.word || '',
            transcription: vocab.transcription || '',
            meaningVi: vocab.meaningVi || '',
            interpret: vocab.interpret || '',
            exampleSentence: vocab.exampleSentence || '',
            cefr: vocab.cefr || '',
            img: vocab.img || '',
            audio: vocab.audio || '',
            types: vocab.types?.map((t: any) => t.name) || [],
            topic: vocab.topic?.name || '',
            credit: vocab.credit || ''
          });
          
        } catch (err: any) {
          console.error('Error fetching vocab:', err);
          setError(err.message || 'Không thể tải dữ liệu từ vựng');
        } finally {
          setLoading(false);
        }
      };

      fetchVocab();
    } else {
      console.log('➕ Chế độ tạo từ vựng mới');
      setLoading(false);
    }
  }, [isEdit, id]);

  // Hàm compress ảnh trước khi upload
  const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Nén ảnh thất bại'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = reject;
      };
      
      reader.onerror = reject;
    });
  };

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

      const submitData: CreateVocabRequest | UpdateVocabRequest = {
        word: form.word.trim(),
        transcription: form.transcription.trim() || undefined,
        meaningVi: form.meaningVi.trim(),
        interpret: form.interpret.trim(),
        exampleSentence: form.exampleSentence.trim(),
        cefr: form.cefr,
        img: form.img || undefined,
        audio: form.audio || undefined,
        credit: form.credit.trim() || undefined,
        types: form.types,
        topic: form.topic || undefined
      };

      console.log('📤 Đang gửi dữ liệu:', submitData);

      if (isEdit && id) {
        console.log('✏️ Cập nhật từ vựng ID:', id);
        await vocabService.updateVocabById(id, submitData as UpdateVocabRequest);
      } else {
        console.log('➕ Tạo từ vựng mới');
        await vocabService.createVocab(submitData as CreateVocabRequest);
      }

      alert(isEdit ? 'Cập nhật từ vựng thành công!' : 'Thêm từ vựng mới thành công!');
      navigate('/admin/vocabs');
      
    } catch (err: any) {
      console.error('Lỗi khi lưu từ vựng:', err);
      setError(err.message || 'Lỗi khi lưu từ vựng');
    } finally {
      setSaving(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadProgress(prev => ({...prev, image: true}));
        setError(null);

        console.log('📁 Kích thước file gốc:', (file.size / (1024 * 1024)).toFixed(2) + ' MB');

        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedImageTypes.includes(file.type)) {
          throw new Error('Chỉ chấp nhận file ảnh: JPG, PNG, GIF, WebP');
        }

        let fileToUpload = file;
        
        if (file.size > 500 * 1024) {
          console.log('🔄 Đang nén ảnh...');
          fileToUpload = await compressImage(file);
          console.log('📁 Kích thước sau nén:', (fileToUpload.size / (1024 * 1024)).toFixed(2) + ' MB');
        }

        const maxSize = 1 * 1024 * 1024;
        if (fileToUpload.size > maxSize) {
          throw new Error(`File vẫn quá lớn sau khi nén (${(fileToUpload.size / (1024 * 1024)).toFixed(2)}MB). Vui lòng chọn ảnh nhỏ hơn.`);
        }

        console.log('🔄 Đang tải ảnh lên...');
        const response = await storageService.uploadImage(fileToUpload);
        console.log('✅ Tải lên thành công:', response);

        let imageUrl = '';
        
        if (response.data?.url) {
          imageUrl = response.data.url;
        } else {
          const data = response.data || response;
          if (typeof data === 'object') {
            const firstValue = Object.values(data)[0];
            if (typeof firstValue === 'string' && firstValue.startsWith('http')) {
              imageUrl = firstValue;
            }
          }
        }

        if (!imageUrl) {
          console.warn('⚠️ Không tìm thấy URL trong phản hồi:', response);
          throw new Error('Không thể lấy URL ảnh từ server');
        }

        console.log('🖼️ URL ảnh:', imageUrl);
        handleChange('img', imageUrl);
        
      } catch (err: any) {
        console.error('❌ Lỗi tải ảnh:', err);
        setError(`Lỗi tải ảnh: ${err.message}`);
        e.target.value = '';
      } finally {
        setUploadProgress(prev => ({...prev, image: false}));
      }
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadProgress(prev => ({...prev, audio: true}));
        setError(null);

        console.log('📁 Kích thước audio:', (file.size / (1024 * 1024)).toFixed(2) + ' MB');

        const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
        if (!allowedAudioTypes.includes(file.type)) {
          throw new Error('Chỉ chấp nhận file audio: MP3, WAV, OGG');
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error(`Kích thước file (${(file.size / (1024 * 1024)).toFixed(2)}MB) vượt quá 5MB. Vui lòng chọn file nhỏ hơn.`);
        }

        console.log('🔄 Đang tải audio lên...');
        const response = await storageService.uploadAudio(file);
        console.log('✅ Tải audio thành công:', response);

        let audioUrl = '';
        
        if (response.data?.url) {
          audioUrl = response.data.url;
        } else {
          const data = response.data || response;
          if (typeof data === 'object') {
            const firstValue = Object.values(data)[0];
            if (typeof firstValue === 'string' && firstValue.startsWith('http')) {
              audioUrl = firstValue;
            }
          }
        }

        if (!audioUrl) {
          console.warn('⚠️ Không tìm thấy URL audio:', response);
          throw new Error('Không thể lấy URL audio từ server');
        }

        console.log('🔊 URL audio:', audioUrl);
        handleChange('audio', audioUrl);
        
      } catch (err: any) {
        console.error('❌ Lỗi tải audio:', err);
        setError(`Lỗi tải audio: ${err.message}`);
        e.target.value = '';
      } finally {
        setUploadProgress(prev => ({...prev, audio: false}));
      }
    }
  };

  const removeImage = () => {
    handleChange('img', '');
  };

  const removeAudio = () => {
    handleChange('audio', '');
  };

  if (loading) {
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {isEdit ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới'}
          </h1>
          <p className="text-gray-600">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gradient-to-r from-blue-500 to-purple-500 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
                    Thông tin cơ bản
                  </h3>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Chủ đề
                  </label>
                  <select
                    value={form.topic}
                    onChange={(e) => handleChange('topic', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400 cursor-pointer"
                  >
                    <option value="">Chọn chủ đề</option>
                    {availableTopics.map(topic => (
                      <option key={topic.id} value={topic.name}>{topic.name}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Loại từ <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableWordTypes.map(type => (
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
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full mr-3"></div>
                    Thông tin chi tiết
                  </h3>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full mr-3"></div>
                    File đa phương tiện
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Hình ảnh minh họa
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gradient-to-br from-blue-50 to-purple-50 hover:border-blue-400 transition-all">
                    {form.img ? (
                      <div className="space-y-3">
                        <div className="relative inline-block">
                          <img src={form.img} alt="Preview" className="h-40 mx-auto object-cover rounded-xl shadow-lg" />
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
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={uploadProgress.image}
                        />
                        <label 
                          htmlFor="image-upload" 
                          className={`cursor-pointer block ${uploadProgress.image ? 'opacity-50' : ''}`}
                        >
                          <div className="mb-3">
                            {uploadProgress.image ? (
                              <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
                            ) : (
                              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            )}
                          </div>
                          <span className="text-base text-gray-700 font-medium block mb-1">
                            {uploadProgress.image ? 'Đang tải lên...' : 'Nhấn để tải ảnh lên'}
                          </span>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP (tối đa 1MB)</p>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <Music className="w-4 h-4 inline mr-2" />
                    Audio phát âm
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gradient-to-br from-green-50 to-teal-50 hover:border-green-400 transition-all">
                    {form.audio ? (
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-4 shadow-md inline-block">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-700">Audio đã tải lên</p>
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
                          onChange={handleAudioUpload}
                          className="hidden"
                          id="audio-upload"
                          disabled={uploadProgress.audio}
                        />
                        <label 
                          htmlFor="audio-upload" 
                          className={`cursor-pointer block ${uploadProgress.audio ? 'opacity-50' : ''}`}
                        >
                          <div className="mb-3">
                            {uploadProgress.audio ? (
                              <Loader2 className="w-12 h-12 text-green-600 mx-auto animate-spin" />
                            ) : (
                              <Music className="w-12 h-12 text-gray-400 mx-auto" />
                            )}
                          </div>
                          <span className="text-base text-gray-700 font-medium block mb-1">
                            {uploadProgress.audio ? 'Đang tải lên...' : 'Nhấn để tải audio lên'}
                          </span>
                          <p className="text-xs text-gray-500">MP3, WAV, OGG (tối đa 5MB)</p>
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
                  disabled={saving}
                  className="px-8 py-3 border-2 border-gray-300 text-base font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 transition-all transform hover:scale-105 shadow-md"
                >
                  <X className="w-5 h-5 inline mr-2" />
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadProgress.image || uploadProgress.audio}
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