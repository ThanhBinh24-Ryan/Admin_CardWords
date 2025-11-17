
// // // // import React, { useState, useEffect } from 'react';
// // // // import { useNavigate } from 'react-router-dom';
// // // // import { vocabApi } from '../../services/vocabService'; // Sửa đường dẫn
// // // // import { Vocab, VocabFilter } from '../../types/vocab'; // Sửa đường dẫn

// // // // const VocabList: React.FC = () => {
// // // //   const navigate = useNavigate();
// // // //   const [vocabs, setVocabs] = useState<Vocab[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState<string | null>(null);
  
// // // //   // Pagination states
// // // //   const [currentPage, setCurrentPage] = useState(0);
// // // //   const [totalPages, setTotalPages] = useState(0);
// // // //   const [totalElements, setTotalElements] = useState(0);
  
// // // //   // Filter states
// // // //   const [filters, setFilters] = useState<VocabFilter>({
// // // //     search: '',
// // // //     cefr: '',
// // // //     type: '',
// // // //     topic: ''
// // // //   });

// // // //   // Fetch data từ API
// // // //   const fetchVocabs = async (page: number = 0) => {
// // // //     try {
// // // //       setLoading(true);
// // // //       setError(null);
      
// // // //       const params: any = {
// // // //         page,
// // // //         size: 8
// // // //       };

// // // //       // Thêm filters vào params nếu có
// // // //       if (filters.search) params.search = filters.search;
// // // //       if (filters.cefr) params.cefr = filters.cefr;
// // // //       if (filters.type) params.type = filters.type;
// // // //       if (filters.topic) params.topic = filters.topic;

// // // //       const response = await vocabApi.getVocabs(params);
// // // //       setVocabs(response.data.content);
// // // //       setTotalPages(response.data.totalPages);
// // // //       setTotalElements(response.data.totalElements);
      
// // // //     } catch (err: any) {
// // // //       console.error('Error fetching vocabs:', err);
// // // //       setError(err.response?.data?.message || 'Failed to load vocabulary data');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchVocabs(currentPage);
// // // //   }, [currentPage]);

// // // //   // Apply filters và reset về page 0
// // // //   const applyFilters = () => {
// // // //     setCurrentPage(0);
// // // //     fetchVocabs(0);
// // // //   };

// // // //   useEffect(() => {
// // // //     // Debounce search
// // // //     const timeoutId = setTimeout(() => {
// // // //       if (filters.search !== '') {
// // // //         applyFilters();
// // // //       }
// // // //     }, 500);

// // // //     return () => clearTimeout(timeoutId);
// // // //   }, [filters.search]);

// // // //   const handleViewDetails = (id: string) => {
// // // //     navigate(`/vocab/detail/${id}`);
// // // //   };

// // // //   const handleEdit = (id: string) => {
// // // //     navigate(`/vocab/edit/${id}`);
// // // //   };

// // // //   const handleAddNew = () => {
// // // //     navigate('/vocab/new');
// // // //   };

// // // //   const handleDelete = async (id: string) => {
// // // //     if (window.confirm('Are you sure you want to delete this vocabulary?')) {
// // // //       try {
// // // //         await vocabApi.deleteVocab(id);
// // // //         // Refresh list
// // // //         fetchVocabs(currentPage);
// // // //       } catch (err: any) {
// // // //         console.error('Error deleting vocab:', err);
// // // //         setError(err.response?.data?.message || 'Failed to delete vocabulary');
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleFilterChange = (key: keyof VocabFilter, value: string) => {
// // // //     setFilters((prev: VocabFilter) => ({ // Sửa type cho prev
// // // //       ...prev,
// // // //       [key]: value
// // // //     }));
// // // //   };

// // // //   const clearFilters = () => {
// // // //     setFilters({
// // // //       search: '',
// // // //       cefr: '',
// // // //       type: '',
// // // //       topic: ''
// // // //     });
// // // //     setCurrentPage(0);
// // // //     fetchVocabs(0);
// // // //   };

// // // //   const playAudio = (audioUrl: string | null) => {
// // // //     if (audioUrl && audioUrl !== 'null') {
// // // //       const audio = new Audio(audioUrl);
// // // //       audio.play().catch(e => console.log('Audio play failed:', e));
// // // //     }
// // // //   };

// // // //   const getCefrBadge = (cefr: string) => {
// // // //     const cefrColors: { [key: string]: string } = {
// // // //       'A1': 'bg-green-100 text-green-800',
// // // //       'A2': 'bg-green-200 text-green-800',
// // // //       'B1': 'bg-blue-100 text-blue-800',
// // // //       'B2': 'bg-blue-200 text-blue-800',
// // // //       'C1': 'bg-purple-100 text-purple-800',
// // // //       'C2': 'bg-purple-200 text-purple-800'
// // // //     };
    
// // // //     return (
// // // //       <span className={`px-2 py-1 rounded-full text-xs font-medium ${cefrColors[cefr] || 'bg-gray-100 text-gray-800'}`}>
// // // //         {cefr}
// // // //       </span>
// // // //     );
// // // //   };

// // // //   const getWordTypeBadge = (types: any[]) => {
// // // //     if (!types || types.length === 0) return null;
    
// // // //     const typeColors: { [key: string]: string } = {
// // // //       'noun': 'bg-blue-100 text-blue-800',
// // // //       'verb': 'bg-red-100 text-red-800',
// // // //       'adjective': 'bg-green-100 text-green-800',
// // // //       'adverb': 'bg-yellow-100 text-yellow-800'
// // // //     };
    
// // // //     return (
// // // //       <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[types[0].name?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
// // // //         {types[0].name}
// // // //       </span>
// // // //     );
// // // //   };

// // // //   if (loading && vocabs.length === 0) {
// // // //     return (
// // // //       <div className="flex justify-center items-center h-64">
// // // //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="container mx-auto px-4 py-8">
// // // //       <div className="mb-8">
// // // //         <h1 className="text-3xl font-bold text-gray-900 mb-2">Vocabulary Management</h1>
// // // //         <p className="text-gray-600">Manage your vocabulary database efficiently</p>
// // // //       </div>

// // // //       {/* Filters */}
// // // //       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
// // // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
// // // //           <div className="lg:col-span-2">
// // // //             <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
// // // //             <input
// // // //               type="text"
// // // //               placeholder="Search by word, meaning, or definition..."
// // // //               value={filters.search}
// // // //               onChange={(e) => handleFilterChange('search', e.target.value)}
// // // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //             />
// // // //           </div>
          
// // // //           <div>
// // // //             <label className="block text-sm font-medium text-gray-700 mb-1">CEFR Level</label>
// // // //             <select
// // // //               value={filters.cefr}
// // // //               onChange={(e) => handleFilterChange('cefr', e.target.value)}
// // // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //             >
// // // //               <option value="">All Levels</option>
// // // //               <option value="A1">A1</option>
// // // //               <option value="A2">A2</option>
// // // //               <option value="B1">B1</option>
// // // //               <option value="B2">B2</option>
// // // //               <option value="C1">C1</option>
// // // //               <option value="C2">C2</option>
// // // //             </select>
// // // //           </div>

// // // //           <div>
// // // //             <label className="block text-sm font-medium text-gray-700 mb-1">Word Type</label>
// // // //             <select
// // // //               value={filters.type}
// // // //               onChange={(e) => handleFilterChange('type', e.target.value)}
// // // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //             >
// // // //               <option value="">All Types</option>
// // // //               <option value="noun">Noun</option>
// // // //               <option value="verb">Verb</option>
// // // //               <option value="adjective">Adjective</option>
// // // //               <option value="adverb">Adverb</option>
// // // //             </select>
// // // //           </div>

// // // //           <div>
// // // //             <label className="block text-sm font-medium text-gray-700 mb-1">Apply Filters</label>
// // // //             <button
// // // //               onClick={applyFilters}
// // // //               className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // //             >
// // // //               Apply
// // // //             </button>
// // // //           </div>
// // // //         </div>
        
// // // //         <div className="flex justify-between items-center">
// // // //           <div className="text-sm text-gray-600">
// // // //             {totalElements} words found
// // // //           </div>
          
// // // //           <div className="flex space-x-3">
// // // //             <button
// // // //               onClick={clearFilters}
// // // //               className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
// // // //             >
// // // //               Clear Filters
// // // //             </button>
// // // //             <button
// // // //               onClick={handleAddNew}
// // // //               className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
// // // //             >
// // // //               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
// // // //               </svg>
// // // //               Add New Word
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Error Message */}
// // // //       {error && (
// // // //         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
// // // //           {error}
// // // //         </div>
// // // //       )}

// // // //       {/* Vocabulary Grid */}
// // // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
// // // //         {vocabs.map((vocab) => (
// // // //           <div key={vocab.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
// // // //             {/* Image */}
         
// // // // <div className="h-40 bg-gray-200 relative">
// // // //   {vocab.img && vocab.img !== 'null' ? (
// // // //     <img
// // // //       src={vocab.img}
// // // //       alt={vocab.word}
// // // //       className="w-full h-full object-cover"
// // // //       onError={(e) => {
// // // //         const target = e.target as HTMLImageElement;
// // // //         // Fallback to gradient background với chữ
// // // //         target.style.display = 'none';
// // // //         const parent = target.parentElement;
// // // //         if (parent) {
// // // //           parent.innerHTML = `
// // // //             <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
// // // //               <span class="text-white font-bold text-lg">${vocab.word}</span>
// // // //             </div>
// // // //           `;
// // // //         }
// // // //       }}
// // // //     />
// // // //   ) : (
// // // //     // Fallback khi không có ảnh - sử dụng gradient background
// // // //     <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
// // // //       <span className="text-white font-bold text-lg">{vocab.word}</span>
// // // //     </div>
// // // //   )}
// // // //   <div className="absolute top-2 right-2 flex space-x-1">
// // // //     {getCefrBadge(vocab.cefr)}
// // // //     {getWordTypeBadge(vocab.types)}
// // // //   </div>
// // // // </div>

// // // //             {/* Content */}
// // // //             <div className="p-4">
// // // //               <div className="flex items-start justify-between mb-2">
// // // //                 <h3 className="text-lg font-bold text-gray-900">{vocab.word}</h3>
// // // //                 {vocab.audio && vocab.audio !== 'null' && (
// // // //                   <button
// // // //                     onClick={() => playAudio(vocab.audio)}
// // // //                     className="text-blue-600 hover:text-blue-800 p-1"
// // // //                     title="Play pronunciation"
// // // //                   >
// // // //                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// // // //                       <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.796L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-2.796a1 1 0 011.2-.128zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
// // // //                     </svg>
// // // //                   </button>
// // // //                 )}
// // // //               </div>

// // // //               <p className="text-gray-600 text-sm mb-1">{vocab.transcription}</p>
// // // //               <p className="text-gray-800 font-medium mb-2">{vocab.meaningVi}</p>
// // // //               <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vocab.interpret}</p>

// // // //               {/* Topics */}
// // // //               <div className="mb-3">
// // // //                 <div className="flex flex-wrap gap-1">
// // // //                   {vocab.topics?.slice(0, 2).map((topic: any) => ( // Sửa type cho topic
// // // //                     <span key={topic.id} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
// // // //                       {topic.name}
// // // //                     </span>
// // // //                   ))}
// // // //                   {vocab.topics && vocab.topics.length > 2 && (
// // // //                     <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
// // // //                       +{vocab.topics.length - 2}
// // // //                     </span>
// // // //                   )}
// // // //                 </div>
// // // //               </div>

// // // //               {/* Actions */}
// // // //               <div className="flex justify-between items-center pt-3 border-t border-gray-200">
// // // //                 <button
// // // //                   onClick={() => handleViewDetails(vocab.id)}
// // // //                   className="text-blue-600 hover:text-blue-800 text-sm font-medium"
// // // //                 >
// // // //                   View Details
// // // //                 </button>
// // // //                 <div className="flex space-x-2">
// // // //                   <button
// // // //                     onClick={() => handleEdit(vocab.id)}
// // // //                     className="text-green-600 hover:text-green-800 p-1"
// // // //                     title="Edit"
// // // //                   >
// // // //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// // // //                     </svg>
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={() => handleDelete(vocab.id)}
// // // //                     className="text-red-600 hover:text-red-800 p-1"
// // // //                     title="Delete"
// // // //                   >
// // // //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
// // // //                     </svg>
// // // //                   </button>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       {/* Empty State */}
// // // //       {vocabs.length === 0 && !loading && (
// // // //         <div className="text-center py-12 bg-white rounded-lg shadow-md">
// // // //           <div className="text-gray-400 text-6xl mb-4">📚</div>
// // // //           <h3 className="text-lg font-medium text-gray-900 mb-1">No vocabulary found</h3>
// // // //           <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
// // // //           <button
// // // //             onClick={handleAddNew}
// // // //             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
// // // //           >
// // // //             Add Your First Word
// // // //           </button>
// // // //         </div>
// // // //       )}

// // // //       {/* Pagination */}
// // // //       {totalPages > 1 && (
// // // //         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg shadow-md">
// // // //           <div className="flex-1 flex justify-between items-center">
// // // //             <div>
// // // //               <p className="text-sm text-gray-700">
// // // //                 Page <span className="font-medium">{currentPage + 1}</span> of{' '}
// // // //                 <span className="font-medium">{totalPages}</span>
// // // //               </p>
// // // //             </div>
// // // //             <div className="flex space-x-2">
// // // //               <button
// // // //                 onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 0))} // Sửa type cho prev
// // // //                 disabled={currentPage === 0}
// // // //                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// // // //               >
// // // //                 Previous
// // // //               </button>
// // // //               <div className="flex space-x-1">
// // // //                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// // // //                   let pageNum;
// // // //                   if (totalPages <= 5) {
// // // //                     pageNum = i;
// // // //                   } else if (currentPage <= 2) {
// // // //                     pageNum = i;
// // // //                   } else if (currentPage >= totalPages - 3) {
// // // //                     pageNum = totalPages - 5 + i;
// // // //                   } else {
// // // //                     pageNum = currentPage - 2 + i;
// // // //                   }
                  
// // // //                   return (
// // // //                     <button
// // // //                       key={pageNum}
// // // //                       onClick={() => setCurrentPage(pageNum)}
// // // //                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
// // // //                         currentPage === pageNum
// // // //                           ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
// // // //                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
// // // //                       }`}
// // // //                     >
// // // //                       {pageNum + 1}
// // // //                     </button>
// // // //                   );
// // // //                 })}
// // // //               </div>
// // // //               <button
// // // //                 onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages - 1))} // Sửa type cho prev
// // // //                 disabled={currentPage === totalPages - 1}
// // // //                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// // // //               >
// // // //                 Next
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default VocabList;
// // // import React, { useState, useEffect, useMemo } from 'react';
// // // import { useNavigate, useSearchParams } from 'react-router-dom';
// // // import { vocabApi } from '../../services/vocabService';
// // // import { Vocab, VocabFilter } from '../../types/vocab';

// // // const VocabList: React.FC = () => {
// // //   const navigate = useNavigate();
// // //   const [searchParams, setSearchParams] = useSearchParams();
  
// // //   const [allVocabs, setAllVocabs] = useState<Vocab[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
  
// // //   // Pagination state
// // //   const [currentPage, setCurrentPage] = useState(0);
// // //   const itemsPerPage = 8;
  
// // //   // Lấy filters từ URL parameters
// // //   const getFiltersFromURL = (): VocabFilter => {
// // //     return {
// // //       search: searchParams.get('search') || '',
// // //       cefr: searchParams.get('cefr') || '',
// // //       type: searchParams.get('type') || '',
// // //       topic: searchParams.get('topic') || ''
// // //     };
// // //   };

// // //   const filters = getFiltersFromURL();

// // //   // Data for dropdowns
// // //   const [topics, setTopics] = useState<any[]>([]);
// // //   const [wordTypes, setWordTypes] = useState<any[]>([]);

// // //   // Fetch tất cả vocabs một lần
// // //   useEffect(() => {
// // //     const fetchAllVocabs = async () => {
// // //       try {
// // //         setLoading(true);
// // //         setError(null);
        
// // //         // Fetch tất cả data (có thể cần multiple requests nếu có pagination)
// // //         const response = await vocabApi.getVocabs({ 
// // //           page: 0, 
// // //           size: 1000 // Lấy nhiều items một lần
// // //         });
        
// // //         setAllVocabs(response.data.content);
        
// // //       } catch (err: any) {
// // //         console.error('Error fetching vocabs:', err);
// // //         setError(err.response?.data?.message || 'Failed to load vocabulary data');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchAllVocabs();
// // //   }, []);

// // //   // Fetch dropdown data
// // //   useEffect(() => {
// // //     const fetchDropdownData = async () => {
// // //       try {
// // //         const [topicsResponse, typesResponse] = await Promise.all([
// // //           vocabApi.getTopics(),
// // //           vocabApi.getWordTypes()
// // //         ]);
        
// // //         setTopics(topicsResponse.data || []);
// // //         setWordTypes(typesResponse.data || []);
// // //       } catch (err) {
// // //         console.error('Error fetching dropdown data:', err);
// // //       }
// // //     };

// // //     fetchDropdownData();
// // //   }, []);

// // //   // Client-side filtering với useMemo để tối ưu performance
// // //   const filteredVocabs = useMemo(() => {
// // //     let filtered = [...allVocabs];

// // //     // Filter by CEFR level
// // //     if (filters.cefr) {
// // //       filtered = filtered.filter(vocab => vocab.cefr === filters.cefr);
// // //     }

// // //     // Filter by search term
// // //     if (filters.search) {
// // //       const searchLower = filters.search.toLowerCase();
// // //       filtered = filtered.filter(vocab => 
// // //         vocab.word.toLowerCase().includes(searchLower) ||
// // //         vocab.meaningVi.toLowerCase().includes(searchLower) ||
// // //         vocab.interpret.toLowerCase().includes(searchLower) ||
// // //         vocab.transcription.toLowerCase().includes(searchLower)
// // //       );
// // //     }

// // //     // Filter by word type
// // //     if (filters.type) {
// // //       filtered = filtered.filter(vocab => 
// // //         vocab.types.some(type => type.name.toLowerCase() === filters.type?.toLowerCase())
// // //       );
// // //     }

// // //     // Filter by topic
// // //     if (filters.topic) {
// // //       filtered = filtered.filter(vocab => 
// // //         vocab.topics.some(topic => topic.name.toLowerCase() === filters.topic?.toLowerCase())
// // //       );
// // //     }

// // //     return filtered;
// // //   }, [allVocabs, filters]);

// // //   // Pagination calculations
// // //   const totalElements = filteredVocabs.length;
// // //   const totalPages = Math.ceil(totalElements / itemsPerPage);
// // //   const startIndex = currentPage * itemsPerPage;
// // //   const endIndex = startIndex + itemsPerPage;
// // //   const currentVocabs = filteredVocabs.slice(startIndex, endIndex);

// // //   // Cập nhật URL khi filters thay đổi (với debounce)
// // //   useEffect(() => {
// // //     const timeoutId = setTimeout(() => {
// // //       const params = new URLSearchParams();
      
// // //       if (filters.search) params.set('search', filters.search);
// // //       if (filters.cefr) params.set('cefr', filters.cefr);
// // //       if (filters.type) params.set('type', filters.type);
// // //       if (filters.topic) params.set('topic', filters.topic);
      
// // //       setSearchParams(params);
// // //       setCurrentPage(0); // Reset về page đầu khi filter thay đổi
// // //     }, 3000);

// // //     return () => clearTimeout(timeoutId);
// // //   }, [filters, setSearchParams]);

// // //   const handleFilterChange = (key: keyof VocabFilter, value: string) => {
// // //     const newFilters = { ...filters, [key]: value };
// // //     const params = new URLSearchParams();
    
// // //     if (newFilters.search) params.set('search', newFilters.search);
// // //     if (newFilters.cefr) params.set('cefr', newFilters.cefr);
// // //     if (newFilters.type) params.set('type', newFilters.type);
// // //     if (newFilters.topic) params.set('topic', newFilters.topic);
    
// // //     setSearchParams(params);
// // //   };

// // //   const clearFilters = () => {
// // //     setSearchParams({});
// // //     setCurrentPage(0);
// // //   };

// // //   const handleViewDetails = (id: string) => {
// // //     navigate(`/vocab/detail/${id}`);
// // //   };

// // //   const handleEdit = (id: string) => {
// // //     navigate(`/vocab/edit/${id}`);
// // //   };

// // //   const handleAddNew = () => {
// // //     navigate('/vocab/new');
// // //   };

// // //   const handleDelete = async (id: string) => {
// // //     if (window.confirm('Are you sure you want to delete this vocabulary?')) {
// // //       try {
// // //         await vocabApi.deleteVocab(id);
// // //         // Remove from local state
// // //         setAllVocabs(prev => prev.filter(vocab => vocab.id !== id));
// // //       } catch (err: any) {
// // //         console.error('Error deleting vocab:', err);
// // //         alert(err.response?.data?.message || 'Failed to delete vocabulary');
// // //       }
// // //     }
// // //   };

// // //   const playAudio = (audioUrl: string | null) => {
// // //     if (audioUrl && audioUrl !== 'null') {
// // //       const audio = new Audio(audioUrl);
// // //       audio.play().catch(e => console.log('Audio play failed:', e));
// // //     }
// // //   };

// // //   const getCefrBadge = (cefr: string) => {
// // //     const cefrColors: { [key: string]: string } = {
// // //       'A1': 'bg-green-100 text-green-800',
// // //       'A2': 'bg-green-200 text-green-800',
// // //       'B1': 'bg-blue-100 text-blue-800',
// // //       'B2': 'bg-blue-200 text-blue-800',
// // //       'C1': 'bg-purple-100 text-purple-800',
// // //       'C2': 'bg-purple-200 text-purple-800'
// // //     };
    
// // //     return (
// // //       <span className={`px-2 py-1 rounded-full text-xs font-medium ${cefrColors[cefr] || 'bg-gray-100 text-gray-800'}`}>
// // //         {cefr}
// // //       </span>
// // //     );
// // //   };

// // //   const getWordTypeBadge = (types: any[]) => {
// // //     if (!types || types.length === 0) return null;
    
// // //     const typeColors: { [key: string]: string } = {
// // //       'noun': 'bg-blue-100 text-blue-800',
// // //       'verb': 'bg-red-100 text-red-800',
// // //       'adjective': 'bg-green-100 text-green-800',
// // //       'adverb': 'bg-yellow-100 text-yellow-800',
// // //       'interjection': 'bg-purple-100 text-purple-800',
// // //       'preposition': 'bg-indigo-100 text-indigo-800'
// // //     };
    
// // //     const firstType = types[0].name?.toLowerCase();
// // //     return (
// // //       <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[firstType] || 'bg-gray-100 text-gray-800'}`}>
// // //         {types[0].name}
// // //       </span>
// // //     );
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="flex justify-center items-center h-64">
// // //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="container mx-auto px-4 py-8">
// // //       <div className="mb-8">
// // //         <h1 className="text-3xl font-bold text-gray-900 mb-2">Vocabulary Management</h1>
// // //         <p className="text-gray-600">Manage your vocabulary database efficiently</p>
// // //       </div>

// // //       {/* Filters */}
// // //       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
// // //           <div className="lg:col-span-2">
// // //             <label className="block text-sm font-medium text-gray-700 mb-1">
// // //               Search
// // //             </label>
// // //             <input
// // //               type="text"
// // //               placeholder="Search by word, meaning, or definition..."
// // //               value={filters.search}
// // //               onChange={(e) => handleFilterChange('search', e.target.value)}
// // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //             />
// // //           </div>
          
// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-1">CEFR Level</label>
// // //             <select
// // //               value={filters.cefr}
// // //               onChange={(e) => handleFilterChange('cefr', e.target.value)}
// // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //             >
// // //               <option value="">All Levels</option>
// // //               <option value="A1">A1</option>
// // //               <option value="A2">A2</option>
// // //               <option value="B1">B1</option>
// // //               <option value="B2">B2</option>
// // //               <option value="C1">C1</option>
// // //               <option value="C2">C2</option>
// // //             </select>
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-1">Word Type</label>
// // //             <select
// // //               value={filters.type}
// // //               onChange={(e) => handleFilterChange('type', e.target.value)}
// // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //             >
// // //               <option value="">All Types</option>
// // //               {wordTypes.map((type) => (
// // //                 <option key={type.id} value={type.name}>
// // //                   {type.name}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
// // //             <select
// // //               value={filters.topic}
// // //               onChange={(e) => handleFilterChange('topic', e.target.value)}
// // //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // //             >
// // //               <option value="">All Topics</option>
// // //               {topics.map((topic) => (
// // //                 <option key={topic.id} value={topic.name}>
// // //                   {topic.name}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </div>
// // //         </div>
        
// // //         <div className="flex justify-between items-center">
// // //           <div className="text-sm text-gray-600">
// // //             {totalElements} words found (Total: {allVocabs.length})
// // //             {(filters.search || filters.cefr || filters.type || filters.topic) && (
// // //               <span className="ml-2 text-blue-600">
// // //                 (Filtered)
// // //                 {filters.cefr && ` • CEFR: ${filters.cefr}`}
// // //                 {filters.type && ` • Type: ${filters.type}`}
// // //                 {filters.topic && ` • Topic: ${filters.topic}`}
// // //                 {filters.search && ` • Search: "${filters.search}"`}
// // //               </span>
// // //             )}
// // //           </div>
          
// // //           <div className="flex space-x-3">
// // //             {(filters.search || filters.cefr || filters.type || filters.topic) && (
// // //               <button
// // //                 onClick={clearFilters}
// // //                 className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center transition-colors"
// // //               >
// // //                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //                 </svg>
// // //                 Clear Filters
// // //               </button>
// // //             )}
// // //             <button
// // //               onClick={handleAddNew}
// // //               className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center transition-colors"
// // //             >
// // //               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
// // //               </svg>
// // //               Add New Word
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Error Message */}
// // //       {error && (
// // //         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
// // //           <span>{error}</span>
// // //           <button
// // //             onClick={() => window.location.reload()}
// // //             className="text-red-500 hover:text-red-700"
// // //           >
// // //             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
// // //             </svg>
// // //           </button>
// // //         </div>
// // //       )}

// // //       {/* Vocabulary Grid */}
// // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
// // //         {currentVocabs.map((vocab: Vocab) => (
// // //           <div key={vocab.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
// // //             {/* Image */}
// // //             <div className="h-40 bg-gray-200 relative">
// // //               {vocab.img && vocab.img !== 'null' ? (
// // //                 <img
// // //                   src={vocab.img}
// // //                   alt={vocab.word}
// // //                   className="w-full h-full object-cover"
// // //                   onError={(e) => {
// // //                     const target = e.target as HTMLImageElement;
// // //                     target.style.display = 'none';
// // //                     const parent = target.parentElement;
// // //                     if (parent) {
// // //                       const fallback = parent.querySelector('.image-fallback') as HTMLElement;
// // //                       if (fallback) fallback.style.display = 'flex';
// // //                     }
// // //                   }}
// // //                 />
// // //               ) : null}
              
// // //               {/* Fallback khi không có ảnh hoặc ảnh lỗi */}
// // //               <div 
// // //                 className={`image-fallback absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
// // //                   vocab.img && vocab.img !== 'null' ? 'hidden' : ''
// // //                 }`}
// // //               >
// // //                 <span className="text-white font-bold text-lg">{vocab.word}</span>
// // //               </div>
              
// // //               <div className="absolute top-2 right-2 flex space-x-1">
// // //                 {getCefrBadge(vocab.cefr)}
// // //                 {getWordTypeBadge(vocab.types)}
// // //               </div>
// // //             </div>

// // //             {/* Content */}
// // //             <div className="p-4">
// // //               <div className="flex items-start justify-between mb-2">
// // //                 <h3 className="text-lg font-bold text-gray-900">{vocab.word}</h3>
// // //                 {vocab.audio && vocab.audio !== 'null' && (
// // //                   <button
// // //                     onClick={() => playAudio(vocab.audio)}
// // //                     className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
// // //                     title="Play pronunciation"
// // //                   >
// // //                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// // //                       <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.796L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-2.796a1 1 0 011.2-.128zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
// // //                     </svg>
// // //                   </button>
// // //                 )}
// // //               </div>

// // //               <p className="text-gray-600 text-sm mb-1">{vocab.transcription}</p>
// // //               <p className="text-gray-800 font-medium mb-2">{vocab.meaningVi}</p>
// // //               <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vocab.interpret}</p>

// // //               {/* Topics */}
// // //               <div className="mb-3">
// // //                 <div className="flex flex-wrap gap-1">
// // //                   {vocab.topics?.slice(0, 2).map((topic: any) => (
// // //                     <span key={topic.id} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
// // //                       {topic.name}
// // //                     </span>
// // //                   ))}
// // //                   {vocab.topics && vocab.topics.length > 2 && (
// // //                     <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
// // //                       +{vocab.topics.length - 2}
// // //                     </span>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               {/* Actions */}
// // //               <div className="flex justify-between items-center pt-3 border-t border-gray-200">
// // //                 <button
// // //                   onClick={() => handleViewDetails(vocab.id)}
// // //                   className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
// // //                 >
// // //                   View Details
// // //                 </button>
// // //                 <div className="flex space-x-2">
// // //                   <button
// // //                     onClick={() => handleEdit(vocab.id)}
// // //                     className="text-green-600 hover:text-green-800 p-1 transition-colors"
// // //                     title="Edit"
// // //                   >
// // //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// // //                     </svg>
// // //                   </button>
// // //                   <button
// // //                     onClick={() => handleDelete(vocab.id)}
// // //                     className="text-red-600 hover:text-red-800 p-1 transition-colors"
// // //                     title="Delete"
// // //                   >
// // //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
// // //                     </svg>
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* Empty State */}
// // //       {currentVocabs.length === 0 && !loading && (
// // //         <div className="text-center py-12 bg-white rounded-lg shadow-md">
// // //           <div className="text-gray-400 text-6xl mb-4">📚</div>
// // //           <h3 className="text-lg font-medium text-gray-900 mb-1">No vocabulary found</h3>
// // //           <p className="text-gray-500 mb-6">
// // //             {filters.search || filters.cefr || filters.type || filters.topic 
// // //               ? "Try adjusting your search or filter criteria" 
// // //               : "Get started by adding your first vocabulary word"}
// // //           </p>
// // //           <button
// // //             onClick={handleAddNew}
// // //             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // //           >
// // //             Add Your First Word
// // //           </button>
// // //         </div>
// // //       )}

// // //       {/* Pagination */}
// // //       {totalPages > 1 && (
// // //         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg shadow-md">
// // //           <div className="flex-1 flex justify-between items-center">
// // //             <div>
// // //               <p className="text-sm text-gray-700">
// // //                 Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
// // //                 <span className="font-medium">
// // //                   {Math.min(endIndex, totalElements)}
// // //                 </span>{' '}
// // //                 of <span className="font-medium">{totalElements}</span> words
// // //               </p>
// // //             </div>
// // //             <div className="flex space-x-2">
// // //               <button
// // //                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
// // //                 disabled={currentPage === 0}
// // //                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// // //               >
// // //                 Previous
// // //               </button>
// // //               <div className="flex space-x-1">
// // //                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// // //                   let pageNum;
// // //                   if (totalPages <= 5) {
// // //                     pageNum = i;
// // //                   } else if (currentPage <= 2) {
// // //                     pageNum = i;
// // //                   } else if (currentPage >= totalPages - 3) {
// // //                     pageNum = totalPages - 5 + i;
// // //                   } else {
// // //                     pageNum = currentPage - 2 + i;
// // //                   }
                  
// // //                   return (
// // //                     <button
// // //                       key={pageNum}
// // //                       onClick={() => setCurrentPage(pageNum)}
// // //                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
// // //                         currentPage === pageNum
// // //                           ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
// // //                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
// // //                       }`}
// // //                     >
// // //                       {pageNum + 1}
// // //                     </button>
// // //                   );
// // //                 })}
// // //               </div>
// // //               <button
// // //                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
// // //                 disabled={currentPage === totalPages - 1}
// // //                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// // //               >
// // //                 Next
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default VocabList;
// // import React, { useState, useEffect, useMemo } from 'react';
// // import { useNavigate, useSearchParams } from 'react-router-dom';
// // import { vocabApi } from '../../services/vocabService';
// // import { Vocab, VocabFilter } from '../../types/vocab';

// // const VocabList: React.FC = () => {
// //   const navigate = useNavigate();
// //   const [searchParams, setSearchParams] = useSearchParams();
  
// //   const [allVocabs, setAllVocabs] = useState<Vocab[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // Track which item is being deleted
  
// //   // Pagination state
// //   const [currentPage, setCurrentPage] = useState(0);
// //   const itemsPerPage = 8;
  
// //   // Lấy filters từ URL parameters
// //   const getFiltersFromURL = (): VocabFilter => {
// //     return {
// //       search: searchParams.get('search') || '',
// //       cefr: searchParams.get('cefr') || '',
// //       type: searchParams.get('type') || '',
// //       topic: searchParams.get('topic') || ''
// //     };
// //   };

// //   const filters = getFiltersFromURL();

// //   // Data for dropdowns
// //   const [topics, setTopics] = useState<any[]>([]);
// //   const [wordTypes, setWordTypes] = useState<any[]>([]);

// //   // Fetch tất cả vocabs một lần
// //   const fetchAllVocabs = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       // Fetch tất cả data (có thể cần multiple requests nếu có pagination)
// //       const response = await vocabApi.getVocabs({ 
// //         page: 0, 
// //         size: 1000 // Lấy nhiều items một lần
// //       });
      
// //       setAllVocabs(response.data.content);
      
// //     } catch (err: any) {
// //       console.error('Error fetching vocabs:', err);
// //       setError(err.response?.data?.message || 'Failed to load vocabulary data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAllVocabs();
// //   }, []);

// //   // Fetch dropdown data
// //   useEffect(() => {
// //     const fetchDropdownData = async () => {
// //       try {
// //         const [topicsResponse, typesResponse] = await Promise.all([
// //           vocabApi.getTopics(),
// //           vocabApi.getWordTypes()
// //         ]);
        
// //         setTopics(topicsResponse.data || []);
// //         setWordTypes(typesResponse.data || []);
// //       } catch (err) {
// //         console.error('Error fetching dropdown data:', err);
// //       }
// //     };

// //     fetchDropdownData();
// //   }, []);

// //   // Client-side filtering với useMemo để tối ưu performance
// //   const filteredVocabs = useMemo(() => {
// //     let filtered = [...allVocabs];

// //     // Filter by CEFR level
// //     if (filters.cefr) {
// //       filtered = filtered.filter(vocab => vocab.cefr === filters.cefr);
// //     }

// //     // Filter by search term
// //     if (filters.search) {
// //       const searchLower = filters.search.toLowerCase();
// //       filtered = filtered.filter(vocab => 
// //         vocab.word.toLowerCase().includes(searchLower) ||
// //         vocab.meaningVi.toLowerCase().includes(searchLower) ||
// //         vocab.interpret.toLowerCase().includes(searchLower) ||
// //         vocab.transcription.toLowerCase().includes(searchLower)
// //       );
// //     }

// //     // Filter by word type
// //     if (filters.type) {
// //       filtered = filtered.filter(vocab => 
// //         vocab.types.some(type => type.name.toLowerCase() === filters.type?.toLowerCase())
// //       );
// //     }

// //     // Filter by topic
// //     if (filters.topic) {
// //       filtered = filtered.filter(vocab => 
// //         vocab.topics.some(topic => topic.name.toLowerCase() === filters.topic?.toLowerCase())
// //       );
// //     }

// //     return filtered;
// //   }, [allVocabs, filters]);

// //   // Pagination calculations
// //   const totalElements = filteredVocabs.length;
// //   const totalPages = Math.ceil(totalElements / itemsPerPage);
// //   const startIndex = currentPage * itemsPerPage;
// //   const endIndex = startIndex + itemsPerPage;
// //   const currentVocabs = filteredVocabs.slice(startIndex, endIndex);

// //   // Cập nhật URL khi filters thay đổi (với debounce)
// //   useEffect(() => {
// //     const timeoutId = setTimeout(() => {
// //       const params = new URLSearchParams();
      
// //       if (filters.search) params.set('search', filters.search);
// //       if (filters.cefr) params.set('cefr', filters.cefr);
// //       if (filters.type) params.set('type', filters.type);
// //       if (filters.topic) params.set('topic', filters.topic);
      
// //       setSearchParams(params);
// //       setCurrentPage(0); // Reset về page đầu khi filter thay đổi
// //     }, 300);

// //     return () => clearTimeout(timeoutId);
// //   }, [filters, setSearchParams]);

// //   const handleFilterChange = (key: keyof VocabFilter, value: string) => {
// //     const newFilters = { ...filters, [key]: value };
// //     const params = new URLSearchParams();
    
// //     if (newFilters.search) params.set('search', newFilters.search);
// //     if (newFilters.cefr) params.set('cefr', newFilters.cefr);
// //     if (newFilters.type) params.set('type', newFilters.type);
// //     if (newFilters.topic) params.set('topic', newFilters.topic);
    
// //     setSearchParams(params);
// //   };

// //   const clearFilters = () => {
// //     setSearchParams({});
// //     setCurrentPage(0);
// //   };

// //   const handleViewDetails = (id: string) => {
// //     navigate(`/vocab/detail/${id}`);
// //   };

// //   const handleEdit = (id: string) => {
// //     navigate(`/vocab/edit/${id}`);
// //   };

// //   const handleAddNew = () => {
// //     navigate('/vocab/new');
// //   };

// //   // DELETE FUNCTION - Sử dụng API endpoint bạn cung cấp
// //   const handleDelete = async (id: string, word: string) => {
// //     if (!window.confirm(`Are you sure you want to delete the word "${word}"?`)) {
// //       return;
// //     }

// //     try {
// //       setDeleteLoading(id); // Set loading state for this specific item
      
// //       console.log(`Deleting vocab with ID: ${id}`);
      
// //       // Gọi API delete với endpoint bạn cung cấp
// //       await vocabApi.deleteVocab(id);
      
// //       console.log(`Successfully deleted vocab: ${word}`);
      
// //       // Remove from local state để update UI ngay lập tức
// //       setAllVocabs(prev => prev.filter(vocab => vocab.id !== id));
      
// //       // Show success message
// //       alert(`Vocabulary "${word}" has been deleted successfully!`);
      
// //     } catch (err: any) {
// //       console.error('Error deleting vocab:', err);
      
// //       const errorMessage = err.response?.data?.message || 
// //                           err.message || 
// //                           'Failed to delete vocabulary';
      
// //       alert(`Error: ${errorMessage}`);
      
// //     } finally {
// //       setDeleteLoading(null); // Clear loading state
// //     }
// //   };

// //   const playAudio = (audioUrl: string | null) => {
// //     if (audioUrl && audioUrl !== 'null') {
// //       const audio = new Audio(audioUrl);
// //       audio.play().catch(e => console.log('Audio play failed:', e));
// //     }
// //   };

// //   const getCefrBadge = (cefr: string) => {
// //     const cefrColors: { [key: string]: string } = {
// //       'A1': 'bg-green-100 text-green-800',
// //       'A2': 'bg-green-200 text-green-800',
// //       'B1': 'bg-blue-100 text-blue-800',
// //       'B2': 'bg-blue-200 text-blue-800',
// //       'C1': 'bg-purple-100 text-purple-800',
// //       'C2': 'bg-purple-200 text-purple-800'
// //     };
    
// //     return (
// //       <span className={`px-2 py-1 rounded-full text-xs font-medium ${cefrColors[cefr] || 'bg-gray-100 text-gray-800'}`}>
// //         {cefr}
// //       </span>
// //     );
// //   };

// //   const getWordTypeBadge = (types: any[]) => {
// //     if (!types || types.length === 0) return null;
    
// //     const typeColors: { [key: string]: string } = {
// //       'noun': 'bg-blue-100 text-blue-800',
// //       'verb': 'bg-red-100 text-red-800',
// //       'adjective': 'bg-green-100 text-green-800',
// //       'adverb': 'bg-yellow-100 text-yellow-800',
// //       'interjection': 'bg-purple-100 text-purple-800',
// //       'preposition': 'bg-indigo-100 text-indigo-800'
// //     };
    
// //     const firstType = types[0].name?.toLowerCase();
// //     return (
// //       <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[firstType] || 'bg-gray-100 text-gray-800'}`}>
// //         {types[0].name}
// //       </span>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <div className="mb-8">
// //         <h1 className="text-3xl font-bold text-gray-900 mb-2">Vocabulary Management</h1>
// //         <p className="text-gray-600">Manage your vocabulary database efficiently</p>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
// //           <div className="lg:col-span-2">
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Search
// //             </label>
// //             <input
// //               type="text"
// //               placeholder="Search by word, meaning, or definition..."
// //               value={filters.search}
// //               onChange={(e) => handleFilterChange('search', e.target.value)}
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //             />
// //           </div>
          
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">CEFR Level</label>
// //             <select
// //               value={filters.cefr}
// //               onChange={(e) => handleFilterChange('cefr', e.target.value)}
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //             >
// //               <option value="">All Levels</option>
// //               <option value="A1">A1</option>
// //               <option value="A2">A2</option>
// //               <option value="B1">B1</option>
// //               <option value="B2">B2</option>
// //               <option value="C1">C1</option>
// //               <option value="C2">C2</option>
// //             </select>
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Word Type</label>
// //             <select
// //               value={filters.type}
// //               onChange={(e) => handleFilterChange('type', e.target.value)}
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //             >
// //               <option value="">All Types</option>
// //               {wordTypes.map((type) => (
// //                 <option key={type.id} value={type.name}>
// //                   {type.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
// //             <select
// //               value={filters.topic}
// //               onChange={(e) => handleFilterChange('topic', e.target.value)}
// //               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //             >
// //               <option value="">All Topics</option>
// //               {topics.map((topic) => (
// //                 <option key={topic.id} value={topic.name}>
// //                   {topic.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //         </div>
        
// //         <div className="flex justify-between items-center">
// //           <div className="text-sm text-gray-600">
// //             {totalElements} words found (Total: {allVocabs.length})
// //             {(filters.search || filters.cefr || filters.type || filters.topic) && (
// //               <span className="ml-2 text-blue-600">
// //                 (Filtered)
// //                 {filters.cefr && ` • CEFR: ${filters.cefr}`}
// //                 {filters.type && ` • Type: ${filters.type}`}
// //                 {filters.topic && ` • Topic: ${filters.topic}`}
// //                 {filters.search && ` • Search: "${filters.search}"`}
// //               </span>
// //             )}
// //           </div>
          
// //           <div className="flex space-x-3">
// //             {(filters.search || filters.cefr || filters.type || filters.topic) && (
// //               <button
// //                 onClick={clearFilters}
// //                 className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center transition-colors"
// //               >
// //                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //                 Clear Filters
// //               </button>
// //             )}
// //             <button
// //               onClick={handleAddNew}
// //               className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center transition-colors"
// //             >
// //               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
// //               </svg>
// //               Add New Word
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Error Message */}
// //       {error && (
// //         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
// //           <span>{error}</span>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="text-red-500 hover:text-red-700"
// //           >
// //             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
// //             </svg>
// //           </button>
// //         </div>
// //       )}

// //       {/* Vocabulary Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
// //         {currentVocabs.map((vocab: Vocab) => (
// //           <div key={vocab.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
// //             {/* Image */}
// //             <div className="h-40 bg-gray-200 relative">
// //               {vocab.img && vocab.img !== 'null' ? (
// //                 <img
// //                   src={vocab.img}
// //                   alt={vocab.word}
// //                   className="w-full h-full object-cover"
// //                   onError={(e) => {
// //                     const target = e.target as HTMLImageElement;
// //                     target.style.display = 'none';
// //                     const parent = target.parentElement;
// //                     if (parent) {
// //                       const fallback = parent.querySelector('.image-fallback') as HTMLElement;
// //                       if (fallback) fallback.style.display = 'flex';
// //                     }
// //                   }}
// //                 />
// //               ) : null}
              
// //               {/* Fallback khi không có ảnh hoặc ảnh lỗi */}
// //               <div 
// //                 className={`image-fallback absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
// //                   vocab.img && vocab.img !== 'null' ? 'hidden' : ''
// //                 }`}
// //               >
// //                 <span className="text-white font-bold text-lg">{vocab.word}</span>
// //               </div>
              
// //               <div className="absolute top-2 right-2 flex space-x-1">
// //                 {getCefrBadge(vocab.cefr)}
// //                 {getWordTypeBadge(vocab.types)}
// //               </div>
// //             </div>

// //             {/* Content */}
// //             <div className="p-4">
// //               <div className="flex items-start justify-between mb-2">
// //                 <h3 className="text-lg font-bold text-gray-900">{vocab.word}</h3>
// //                 {vocab.audio && vocab.audio !== 'null' && (
// //                   <button
// //                     onClick={() => playAudio(vocab.audio)}
// //                     className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
// //                     title="Play pronunciation"
// //                   >
// //                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// //                       <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.796L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-2.796a1 1 0 011.2-.128zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
// //                     </svg>
// //                   </button>
// //                 )}
// //               </div>

// //               <p className="text-gray-600 text-sm mb-1">{vocab.transcription}</p>
// //               <p className="text-gray-800 font-medium mb-2">{vocab.meaningVi}</p>
// //               <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vocab.interpret}</p>

// //               {/* Topics */}
// //               <div className="mb-3">
// //                 <div className="flex flex-wrap gap-1">
// //                   {vocab.topics?.slice(0, 2).map((topic: any) => (
// //                     <span key={topic.id} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
// //                       {topic.name}
// //                     </span>
// //                   ))}
// //                   {vocab.topics && vocab.topics.length > 2 && (
// //                     <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
// //                       +{vocab.topics.length - 2}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Actions */}
// //               <div className="flex justify-between items-center pt-3 border-t border-gray-200">
// //                 <button
// //                   onClick={() => handleViewDetails(vocab.id)}
// //                   className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
// //                 >
// //                   View Details
// //                 </button>
// //                 <div className="flex space-x-2">
// //                   <button
// //                     onClick={() => handleEdit(vocab.id)}
// //                     className="text-green-600 hover:text-green-800 p-1 transition-colors"
// //                     title="Edit"
// //                   >
// //                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// //                     </svg>
// //                   </button>
// //                   <button
// //                     onClick={() => handleDelete(vocab.id, vocab.word)}
// //                     disabled={deleteLoading === vocab.id}
// //                     className={`p-1 transition-colors ${
// //                       deleteLoading === vocab.id 
// //                         ? 'text-gray-400 cursor-not-allowed' 
// //                         : 'text-red-600 hover:text-red-800'
// //                     }`}
// //                     title={deleteLoading === vocab.id ? "Deleting..." : "Delete"}
// //                   >
// //                     {deleteLoading === vocab.id ? (
// //                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
// //                     ) : (
// //                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
// //                       </svg>
// //                     )}
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Empty State */}
// //       {currentVocabs.length === 0 && !loading && (
// //         <div className="text-center py-12 bg-white rounded-lg shadow-md">
// //           <div className="text-gray-400 text-6xl mb-4">📚</div>
// //           <h3 className="text-lg font-medium text-gray-900 mb-1">No vocabulary found</h3>
// //           <p className="text-gray-500 mb-6">
// //             {filters.search || filters.cefr || filters.type || filters.topic 
// //               ? "Try adjusting your search or filter criteria" 
// //               : "Get started by adding your first vocabulary word"}
// //           </p>
// //           <button
// //             onClick={handleAddNew}
// //             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //           >
// //             Add Your First Word
// //           </button>
// //         </div>
// //       )}

// //       {/* Pagination */}
// //       {totalPages > 1 && (
// //         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg shadow-md">
// //           <div className="flex-1 flex justify-between items-center">
// //             <div>
// //               <p className="text-sm text-gray-700">
// //                 Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
// //                 <span className="font-medium">
// //                   {Math.min(endIndex, totalElements)}
// //                 </span>{' '}
// //                 of <span className="font-medium">{totalElements}</span> words
// //               </p>
// //             </div>
// //             <div className="flex space-x-2">
// //               <button
// //                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
// //                 disabled={currentPage === 0}
// //                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //               >
// //                 Previous
// //               </button>
// //               <div className="flex space-x-1">
// //                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// //                   let pageNum;
// //                   if (totalPages <= 5) {
// //                     pageNum = i;
// //                   } else if (currentPage <= 2) {
// //                     pageNum = i;
// //                   } else if (currentPage >= totalPages - 3) {
// //                     pageNum = totalPages - 5 + i;
// //                   } else {
// //                     pageNum = currentPage - 2 + i;
// //                   }
                  
// //                   return (
// //                     <button
// //                       key={pageNum}
// //                       onClick={() => setCurrentPage(pageNum)}
// //                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
// //                         currentPage === pageNum
// //                           ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
// //                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
// //                       }`}
// //                     >
// //                       {pageNum + 1}
// //                     </button>
// //                   );
// //                 })}
// //               </div>
// //               <button
// //                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
// //                 disabled={currentPage === totalPages - 1}
// //                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default VocabList;









// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useVocabStore } from '../../store/vocabStore';
// import { VocabFilter } from '../../types/vocab';
// import { CEFR_LEVELS, VOCAB_TYPES } from '../../constants/vocabConstants';

// const VocabList: React.FC = () => {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
  
//   const {
//     vocabs,
//     loading,
//     error,
//     pagination,
//     fetchVocabs,
//     deleteVocab,
//     clearError
//   } = useVocabStore();

//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 8;
  
//   // Lấy filters từ URL parameters
//   const getFiltersFromURL = (): VocabFilter => {
//     return {
//       search: searchParams.get('search') || '',
//       cefr: searchParams.get('cefr') || '',
//       type: searchParams.get('type') || '',
//       topic: searchParams.get('topic') || ''
//     };
//   };

//   const filters = getFiltersFromURL();

//   // Mock data for dropdowns (tạm thời, có thể thay bằng API sau)
//   const topics = [
//     { id: 1, name: 'Food & Drink' },
//     { id: 2, name: 'Travel' },
//     { id: 3, name: 'Business' },
//     { id: 4, name: 'Technology' },
//     { id: 5, name: 'Health' },
//     { id: 6, name: 'Education' }
//   ];

//   const wordTypes = [
//     { id: 1, name: 'noun' },
//     { id: 2, name: 'verb' },
//     { id: 3, name: 'adjective' },
//     { id: 4, name: 'adverb' },
//     { id: 5, name: 'preposition' },
//     { id: 6, name: 'conjunction' }
//   ];

//   // Fetch vocabs khi component mount
//   useEffect(() => {
//     fetchVocabs({ page: 0, size: 1000 });
//   }, [fetchVocabs]);

//   // Client-side filtering với useMemo để tối ưu performance
//   const filteredVocabs = useMemo(() => {
//     let filtered = [...vocabs];

//     // Filter by CEFR level
//     if (filters.cefr) {
//       filtered = filtered.filter(vocab => vocab.cefr === filters.cefr);
//     }

//     // Filter by search term
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filtered = filtered.filter(vocab => 
//         vocab.word.toLowerCase().includes(searchLower) ||
//         vocab.meaningVi.toLowerCase().includes(searchLower) ||
//         (vocab.interpret && vocab.interpret.toLowerCase().includes(searchLower)) ||
//         (vocab.transcription && vocab.transcription.toLowerCase().includes(searchLower))
//       );
//     }

//     // Filter by word type
//     if (filters.type) {
//       filtered = filtered.filter(vocab => 
//         vocab.types.some(type => type.name.toLowerCase() === filters.type?.toLowerCase())
//       );
//     }

//     // Filter by topic
//     if (filters.topic) {
//       filtered = filtered.filter(vocab => 
//         vocab.topic?.name.toLowerCase() === filters.topic?.toLowerCase()
//       );
//     }

//     return filtered;
//   }, [vocabs, filters]);

//   // Pagination calculations
//   const totalElements = filteredVocabs.length;
//   const totalPages = Math.ceil(totalElements / itemsPerPage);
//   const startIndex = currentPage * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentVocabs = filteredVocabs.slice(startIndex, endIndex);

//   // Cập nhật URL khi filters thay đổi (với debounce)
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       const params = new URLSearchParams();
      
//       if (filters.search) params.set('search', filters.search);
//       if (filters.cefr) params.set('cefr', filters.cefr);
//       if (filters.type) params.set('type', filters.type);
//       if (filters.topic) params.set('topic', filters.topic);
      
//       setSearchParams(params);
//       setCurrentPage(0);
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [filters, setSearchParams]);

//   const handleFilterChange = (key: keyof VocabFilter, value: string) => {
//     const newFilters = { ...filters, [key]: value };
//     const params = new URLSearchParams();
    
//     if (newFilters.search) params.set('search', newFilters.search);
//     if (newFilters.cefr) params.set('cefr', newFilters.cefr);
//     if (newFilters.type) params.set('type', newFilters.type);
//     if (newFilters.topic) params.set('topic', newFilters.topic);
    
//     setSearchParams(params);
//   };

//   const clearFilters = () => {
//     setSearchParams({});
//     setCurrentPage(0);
//   };

//   const handleViewDetails = (id: string) => {
//     navigate(`/admin/vocabs/${id}`);
//   };

//   const handleEdit = (id: string) => {
//     navigate(`/admin/vocabs/${id}/edit`);
//   };

//   const handleAddNew = () => {
//     navigate('/admin/vocabs/new');
//   };

//   const handleDelete = async (id: string, word: string) => {
//     if (!window.confirm(`Bạn có chắc muốn xóa từ "${word}"?`)) {
//       return;
//     }

//     try {
//       setDeleteLoading(id);
//       await deleteVocab(id);
//       alert(`Đã xóa từ "${word}" thành công!`);
//     } catch (err: any) {
//       console.error('Error deleting vocab:', err);
//       alert(`Lỗi: ${err.message || 'Lỗi khi xóa từ vựng'}`);
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   const playAudio = (audioUrl: string) => {
//     if (audioUrl) {
//       const audio = new Audio(audioUrl);
//       audio.play().catch(e => console.log('Audio play failed:', e));
//     }
//   };

//   const getCefrBadge = (cefr: string) => {
//     const cefrColors: { [key: string]: string } = {
//       'A1': 'bg-green-100 text-green-800',
//       'A2': 'bg-green-200 text-green-800',
//       'B1': 'bg-blue-100 text-blue-800',
//       'B2': 'bg-blue-200 text-blue-800',
//       'C1': 'bg-purple-100 text-purple-800',
//       'C2': 'bg-purple-200 text-purple-800'
//     };
    
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${cefrColors[cefr] || 'bg-gray-100 text-gray-800'}`}>
//         {cefr}
//       </span>
//     );
//   };

//   const getWordTypeBadge = (types: any[]) => {
//     if (!types || types.length === 0) return null;
    
//     const typeColors: { [key: string]: string } = {
//       'noun': 'bg-blue-100 text-blue-800',
//       'verb': 'bg-red-100 text-red-800',
//       'adjective': 'bg-green-100 text-green-800',
//       'adverb': 'bg-yellow-100 text-yellow-800',
//       'interjection': 'bg-purple-100 text-purple-800',
//       'preposition': 'bg-indigo-100 text-indigo-800'
//     };
    
//     const firstType = types[0].name?.toLowerCase();
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[firstType] || 'bg-gray-100 text-gray-800'}`}>
//         {types[0].name}
//       </span>
//     );
//   };

//   // Clear error khi unmount
//   useEffect(() => {
//     return () => {
//       clearError();
//     };
//   }, [clearError]);

//   if (loading && vocabs.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý từ vựng</h1>
//         <p className="text-gray-600">Quản lý cơ sở dữ liệu từ vựng</p>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
//           <span>{error}</span>
//           <button
//             onClick={clearError}
//             className="text-red-500 hover:text-red-700"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
//           <div className="lg:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Tìm kiếm
//             </label>
//             <input
//               type="text"
//               placeholder="Tìm theo từ, nghĩa, hoặc định nghĩa..."
//               value={filters.search}
//               onChange={(e) => handleFilterChange('search', e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">CEFR Level</label>
//             <select
//               value={filters.cefr}
//               onChange={(e) => handleFilterChange('cefr', e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Tất cả cấp độ</option>
//               {CEFR_LEVELS.map((level) => (
//                 <option key={level} value={level}>
//                   {level}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Loại từ</label>
//             <select
//               value={filters.type}
//               onChange={(e) => handleFilterChange('type', e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Tất cả loại</option>
//               {wordTypes.map((type) => (
//                 <option key={type.id} value={type.name}>
//                   {type.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
//             <select
//               value={filters.topic}
//               onChange={(e) => handleFilterChange('topic', e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Tất cả chủ đề</option>
//               {topics.map((topic) => (
//                 <option key={topic.id} value={topic.name}>
//                   {topic.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         <div className="flex justify-between items-center">
//           <div className="text-sm text-gray-600">
//             {totalElements} từ được tìm thấy (Tổng: {vocabs.length})
//             {(filters.search || filters.cefr || filters.type || filters.topic) && (
//               <span className="ml-2 text-blue-600">
//                 (Đã lọc)
//                 {filters.cefr && ` • CEFR: ${filters.cefr}`}
//                 {filters.type && ` • Loại: ${filters.type}`}
//                 {filters.topic && ` • Chủ đề: ${filters.topic}`}
//                 {filters.search && ` • Tìm: "${filters.search}"`}
//               </span>
//             )}
//           </div>
          
//           <div className="flex space-x-3">
//             {(filters.search || filters.cefr || filters.type || filters.topic) && (
//               <button
//                 onClick={clearFilters}
//                 className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center transition-colors"
//               >
//                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//                 Xóa bộ lọc
//               </button>
//             )}
//             <button
//               onClick={handleAddNew}
//               className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center transition-colors"
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Thêm từ mới
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Vocabulary Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
//         {currentVocabs.map((vocab) => (
//           <div key={vocab.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//             {/* Image */}
//             <div className="h-40 bg-gray-200 relative">
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
//                       const fallback = parent.querySelector('.image-fallback') as HTMLElement;
//                       if (fallback) fallback.style.display = 'flex';
//                     }
//                   }}
//                 />
//               ) : null}
              
//               {/* Fallback khi không có ảnh hoặc ảnh lỗi */}
//               <div 
//                 className={`image-fallback absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
//                   vocab.img ? 'hidden' : ''
//                 }`}
//               >
//                 <span className="text-white font-bold text-lg">{vocab.word}</span>
//               </div>
              
//               <div className="absolute top-2 right-2 flex space-x-1">
//                 {getCefrBadge(vocab.cefr)}
//                 {getWordTypeBadge(vocab.types)}
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-4">
//               <div className="flex items-start justify-between mb-2">
//                 <h3 className="text-lg font-bold text-gray-900">{vocab.word}</h3>
//                 {vocab.audio && (
//                   <button
//                     onClick={() => playAudio(vocab.audio)}
//                     className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
//                     title="Phát phát âm"
//                   >
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.796L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-2.796a1 1 0 011.2-.128zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 )}
//               </div>

//               {vocab.transcription && (
//                 <p className="text-gray-600 text-sm mb-1">{vocab.transcription}</p>
//               )}
//               <p className="text-gray-800 font-medium mb-2">{vocab.meaningVi}</p>
//               {vocab.interpret && (
//                 <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vocab.interpret}</p>
//               )}

//               {/* Topic */}
//               {vocab.topic && (
//                 <div className="mb-3">
//                   <div className="flex flex-wrap gap-1">
//                     <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
//                       {vocab.topic.name}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex justify-between items-center pt-3 border-t border-gray-200">
//                 <button
//                   onClick={() => handleViewDetails(vocab.id)}
//                   className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
//                 >
//                   Xem chi tiết
//                 </button>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleEdit(vocab.id)}
//                     className="text-green-600 hover:text-green-800 p-1 transition-colors"
//                     title="Chỉnh sửa"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={() => handleDelete(vocab.id, vocab.word)}
//                     disabled={deleteLoading === vocab.id}
//                     className={`p-1 transition-colors ${
//                       deleteLoading === vocab.id 
//                         ? 'text-gray-400 cursor-not-allowed' 
//                         : 'text-red-600 hover:text-red-800'
//                     }`}
//                     title={deleteLoading === vocab.id ? "Đang xóa..." : "Xóa"}
//                   >
//                     {deleteLoading === vocab.id ? (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                     ) : (
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {currentVocabs.length === 0 && !loading && (
//         <div className="text-center py-12 bg-white rounded-lg shadow-md">
//           <div className="text-gray-400 text-6xl mb-4">📚</div>
//           <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy từ vựng</h3>
//           <p className="text-gray-500 mb-6">
//             {filters.search || filters.cefr || filters.type || filters.topic 
//               ? "Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc" 
//               : "Bắt đầu bằng cách thêm từ vựng đầu tiên của bạn"}
//           </p>
//           <button
//             onClick={handleAddNew}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Thêm từ đầu tiên
//           </button>
//         </div>
//       )}

//       {/* Loading khi đang fetch thêm data */}
//       {loading && vocabs.length > 0 && (
//         <div className="flex justify-center items-center py-4">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg shadow-md">
//           <div className="flex-1 flex justify-between items-center">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{' '}
//                 <span className="font-medium">
//                   {Math.min(endIndex, totalElements)}
//                 </span>{' '}
//                 trong tổng số <span className="font-medium">{totalElements}</span> từ
//               </p>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
//                 disabled={currentPage === 0}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Trước
//               </button>
//               <div className="flex space-x-1">
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let pageNum;
//                   if (totalPages <= 5) {
//                     pageNum = i;
//                   } else if (currentPage <= 2) {
//                     pageNum = i;
//                   } else if (currentPage >= totalPages - 3) {
//                     pageNum = totalPages - 5 + i;
//                   } else {
//                     pageNum = currentPage - 2 + i;
//                   }
                  
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => setCurrentPage(pageNum)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
//                         currentPage === pageNum
//                           ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                       }`}
//                     >
//                       {pageNum + 1}
//                     </button>
//                   );
//                 })}
//               </div>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
//                 disabled={currentPage === totalPages - 1}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Sau
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VocabList;















import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVocabStore } from '../../store/vocabStore';
import { VocabFilter } from '../../types/vocab';
import { CEFR_LEVELS, VOCAB_TYPES } from '../../constants/vocabConstants';
import { 
  Search, Plus, X, Eye, Edit, Trash2, Volume2, BookOpen,
  Filter, Loader2, ChevronLeft, ChevronRight, Sparkles, Tag, Languages
} from 'lucide-react';

const VocabList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { vocabs, loading, error, pagination, fetchVocabs, deleteVocab, clearError } = useVocabStore();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  const itemsPerPage = 8;
  
  const getFiltersFromURL = (): VocabFilter => {
    return {
      search: searchParams.get('search') || '',
      cefr: searchParams.get('cefr') || '',
      type: searchParams.get('type') || '',
      topic: searchParams.get('topic') || ''
    };
  };

  const filters = getFiltersFromURL();

  const topics = [
    { id: 1, name: 'Food & Drink' },
    { id: 2, name: 'Travel' },
    { id: 3, name: 'Business' },
    { id: 4, name: 'Technology' },
    { id: 5, name: 'Health' },
    { id: 6, name: 'Education' }
  ];

  const wordTypes = [
    { id: 1, name: 'noun' },
    { id: 2, name: 'verb' },
    { id: 3, name: 'adjective' },
    { id: 4, name: 'adverb' },
    { id: 5, name: 'preposition' },
    { id: 6, name: 'conjunction' }
  ];

  useEffect(() => {
    fetchVocabs({ page: 0, size: 1000 });
    setTimeout(() => setPageLoaded(true), 200);
  }, [fetchVocabs]);

  const filteredVocabs = useMemo(() => {
    let filtered = [...vocabs];
    if (filters.cefr) filtered = filtered.filter(vocab => vocab.cefr === filters.cefr);
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

  const totalElements = filteredVocabs.length;
  const totalPages = Math.ceil(totalElements / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVocabs = filteredVocabs.slice(startIndex, endIndex);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.cefr) params.set('cefr', filters.cefr);
      if (filters.type) params.set('type', filters.type);
      if (filters.topic) params.set('topic', filters.topic);
      setSearchParams(params);
      setCurrentPage(0);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key: keyof VocabFilter, value: string) => {
    const newFilters = { ...filters, [key]: value };
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.cefr) params.set('cefr', newFilters.cefr);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.topic) params.set('topic', newFilters.topic);
    setSearchParams(params);
  };

  const clearFilters = () => { setSearchParams({}); setCurrentPage(0); };
  const handleViewDetails = (id: string) => { navigate(`/admin/vocabs/${id}`); };
  const handleEdit = (id: string) => { navigate(`/admin/vocabs/${id}/edit`); };
  const handleAddNew = () => { navigate('/admin/vocabs/new'); };

  const handleDelete = async (id: string, word: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa từ "${word}"?`)) return;
    try {
      setDeleteLoading(id);
      await deleteVocab(id);
      alert(`Đã xóa từ "${word}" thành công!`);
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
      'preposition': 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200'
    };
    const firstType = types[0].name?.toLowerCase();
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeColors[firstType] || 'bg-gray-100 text-gray-800'}`}>
        {types[0].name}
      </span>
    );
  };

  useEffect(() => { return () => { clearError(); }; }, [clearError]);

  if (loading && vocabs.length === 0) {
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
        {/* Header */}
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

        {/* Error Message */}
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

        {/* Filters */}
        <div className={`bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 transform transition-all duration-700 delay-200 ${pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-center mb-5">
            <Filter className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Search className="w-4 h-4 mr-1.5 text-gray-500" />
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo từ, nghĩa, hoặc định nghĩa..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
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
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
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
                  <option key={topic.id} value={topic.name}>{topic.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-indigo-600">{totalElements}</span> từ được tìm thấy
              {vocabs.length !== totalElements && <span className="text-gray-500"> (Tổng: {vocabs.length})</span>}
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
                onClick={handleAddNew}
                className="px-5 py-2 text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Thêm từ mới
              </button>
            </div>
          </div>
        </div>

        {/* Vocabulary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentVocabs.map((vocab, index) => (
            <div 
              key={vocab.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 group"
              style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
            >
              {/* Image */}
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

              {/* Content */}
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

                {/* Topic */}
                {vocab.topic && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg text-xs font-medium ring-1 ring-indigo-200">
                      <Tag className="w-3 h-3 mr-1.5" />
                      {vocab.topic.name}
                    </span>
                  </div>
                )}

                {/* Actions */}
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

        {/* Empty State */}
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
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm từ đầu tiên
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && vocabs.length > 0 && (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Pagination */}
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