// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTopicStore } from '../../store/topicStore';
// import { TopicFormData } from '../../types/topic';
// import { 
//   validateTopicName, 
//   validateTopicDescription, 
//   validateImageFile,
//   TOPIC_VALIDATION,
//   TOPIC_ERRORS 
// } from '../../constants/topic';
// import {
//   ArrowLeft,
//   Save,
//   Upload,
//   X,
//   AlertCircle,
//   Loader2
// } from 'lucide-react';

// const TopicEdit: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const {
//     currentTopic,
//     loading,
//     error,
//     fetchTopicById,
//     updateTopic,
//     clearError
//   } = useTopicStore();

//   const [formData, setFormData] = useState<TopicFormData>({
//     name: '',
//     description: '',
//     image: null
//   });
//   const [previewUrl, setPreviewUrl] = useState<string>('');
//   const [validationErrors, setValidationErrors] = useState<{
//     name?: string;
//     description?: string;
//     image?: string;
//   }>({});

//   useEffect(() => {
//     if (id) {
//       loadTopic(parseInt(id));
//     }
//   }, [id]);

//   useEffect(() => {
//     if (currentTopic) {
//       setFormData({
//         name: currentTopic.name,
//         description: currentTopic.description,
//         image: null
//       });
//       setPreviewUrl(currentTopic.img || '');
//     }
//   }, [currentTopic]);

//   const loadTopic = async (topicId: number) => {
//     try {
//       await fetchTopicById(topicId);
//     } catch (error) {
//       console.error('Failed to load topic:', error);
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     if (validationErrors[name as keyof typeof validationErrors]) {
//       setValidationErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageError = validateImageFile(file);
//       if (imageError) {
//         setValidationErrors(prev => ({ ...prev, image: imageError }));
//         return;
//       }

//       setFormData(prev => ({ ...prev, image: file }));
//       setPreviewUrl(URL.createObjectURL(file));
//       setValidationErrors(prev => ({ ...prev, image: undefined }));
//     }
//   };

//   const removeImage = () => {
//     setFormData(prev => ({ ...prev, image: null }));
//     setPreviewUrl(currentTopic?.img || '');
//     if (previewUrl && previewUrl !== currentTopic?.img) {
//       URL.revokeObjectURL(previewUrl);
//     }
//   };

//   const validateForm = (): boolean => {
//     const errors: typeof validationErrors = {};

//     const nameError = validateTopicName(formData.name);
//     if (nameError) errors.name = nameError;

//     const descriptionError = validateTopicDescription(formData.description);
//     if (descriptionError) errors.description = descriptionError;

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     clearError();

//     if (!validateForm() || !id) {
//       return;
//     }

//     try {
//       await updateTopic(parseInt(id), formData);
//       navigate('/admin/topics');
//     } catch (error) {
//       console.error('Failed to update topic:', error);
//     }
//   };

//   if (loading && !currentTopic) {
//     return (
//       <div className="flex justify-center items-center min-h-64">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//         <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
//       </div>
//     );
//   }

//   if (!currentTopic) {
//     return (
//       <div className="text-center py-12">
//         <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-medium text-gray-900 mb-2">
//           Không tìm thấy chủ đề
//         </h3>
//         <button
//           onClick={() => navigate('/admin/topics')}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Quay lại danh sách
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <button
//             onClick={() => navigate('/admin/topics')}
//             className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Quay lại danh sách
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Chỉnh sửa: {currentTopic.name}
//           </h1>
//         </div>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-start">
//             <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
//             <div>
//               <p className="text-red-800 font-medium">Lỗi khi cập nhật</p>
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Form Fields */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Name Field */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                 Tên chủ đề *
//               </label>
//                            <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   validationErrors.name ? 'border-red-300' : 'border-gray-300'
//                 }`}
//                 placeholder="Nhập tên chủ đề..."
//               />
//               {validationErrors.name && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle className="w-4 h-4 mr-1" />
//                   {validationErrors.name}
//                 </p>
//               )}
//             </div>

//             {/* Description Field */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                 Mô tả
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={4}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   validationErrors.description ? 'border-red-300' : 'border-gray-300'
//                 }`}
//                 placeholder="Nhập mô tả cho chủ đề..."
//               />
//               {validationErrors.description && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle className="w-4 h-4 mr-1" />
//                   {validationErrors.description}
//                 </p>
//               )}
//               <p className="mt-1 text-sm text-gray-500">
//                 {formData.description.length}/500 ký tự
//               </p>
//             </div>
//           </div>

//           {/* Right Column - Image Upload */}
//           <div className="space-y-6">
//             {/* Image Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Hình ảnh
//               </label>
//               <div className="space-y-4">
//                 {previewUrl ? (
//                   <div className="relative">
//                     <img
//                       src={previewUrl}
//                       alt="Preview"
//                       className="w-full h-48 object-cover rounded-lg border border-gray-300"
//                     />
//                     <button
//                       type="button"
//                       onClick={removeImage}
//                       className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
//                       title="Xóa ảnh"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                     <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
//                       {formData.image ? 'Ảnh mới' : 'Ảnh hiện tại'}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
//                     <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                     <p className="text-sm text-gray-600 mb-2">
//                       Kéo thả hình ảnh hoặc click để chọn
//                     </p>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                       id="image-upload"
//                     />
//                     <label
//                       htmlFor="image-upload"
//                       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
//                     >
//                       Chọn hình ảnh
//                     </label>
//                   </div>
//                 )}
//                 {validationErrors.image && (
//                   <p className="text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {validationErrors.image}
//                   </p>
//                 )}
//                 <p className="text-xs text-gray-500">
//                   Định dạng hỗ trợ: JPEG, PNG, GIF, WebP. Tối đa 5MB.
//                 </p>
//               </div>
//             </div>

//             {/* Current Topic Info */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h4 className="font-medium text-gray-900 mb-2">Thông tin hiện tại</h4>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">ID:</span>
//                   <span className="font-medium">#{currentTopic.id}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Ngày tạo:</span>
//                   <span className="font-medium">
//                     {currentTopic.createdAt ? new Date(currentTopic.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Cập nhật lần cuối:</span>
//                   <span className="font-medium">
//                     {currentTopic.updatedAt ? new Date(currentTopic.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="bg-gray-50 rounded-lg p-4 space-y-3">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                     Đang cập nhật...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-4 h-4 mr-2" />
//                     Cập nhật chủ đề
//                   </>
//                 )}
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => navigate('/admin/topics')}
//                 disabled={loading}
//                 className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Hủy bỏ
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Form Actions - Mobile */}
//         <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
//           <div className="space-y-3">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                   Đang cập nhật...
//                 </>
//               ) : (
//                 <>
//                   <Save className="w-4 h-4 mr-2" />
//                   Cập nhật chủ đề
//                 </>
//               )}
//             </button>
            
//             <button
//               type="button"
//               onClick={() => navigate('/admin/topics')}
//               disabled={loading}
//               className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Quay lại danh sách
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* Change Tracking */}
//       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//         <div className="flex items-start">
//           <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
//           <div>
//             <p className="text-yellow-800 font-medium">Lưu ý khi cập nhật</p>
//             <ul className="text-yellow-700 text-sm mt-1 list-disc list-inside space-y-1">
//               <li>Nếu bạn upload hình ảnh mới, hình ảnh cũ sẽ bị xóa khỏi hệ thống</li>
//               <li>Chỉ những trường được thay đổi sẽ được cập nhật</li>
//               <li>Thời gian cập nhật sẽ được tự động cập nhật</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Success Message (temporary) */}
//       {!loading && !error && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <AlertCircle className="w-5 h-5 text-green-600 mr-2" />
//             <p className="text-green-800 text-sm">
//               Tất cả thay đổi sẽ được lưu khi bạn nhấn "Cập nhật chủ đề"
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TopicEdit;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTopicStore } from '../../store/topicStore';
import { TopicFormData } from '../../types/topic';
import { 
  validateTopicName, 
  validateTopicDescription, 
  validateImageFile
} from '../../constants/topic';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';

const TopicEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentTopic,
    loading,
    error,
    fetchTopicById,
    updateTopic,
    clearError
  } = useTopicStore();

  const [formData, setFormData] = useState<TopicFormData>({
    name: '',
    description: '',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [tempPreviewUrl, setTempPreviewUrl] = useState<string>(''); // URL tạm thời cho ảnh mới
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
    image?: string;
  }>({});

  useEffect(() => {
    if (id) {
      loadTopic(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (currentTopic) {
      setFormData({
        name: currentTopic.name,
        description: currentTopic.description,
        image: null
      });
      setPreviewUrl(currentTopic.img || '');
      // Xóa URL tạm thời nếu có
      if (tempPreviewUrl) {
        URL.revokeObjectURL(tempPreviewUrl);
        setTempPreviewUrl('');
      }
    }
  }, [currentTopic]);

  // Cleanup URLs khi component unmount
  useEffect(() => {
    return () => {
      if (tempPreviewUrl) {
        URL.revokeObjectURL(tempPreviewUrl);
      }
    };
  }, [tempPreviewUrl]);

  const loadTopic = async (topicId: number) => {
    try {
      await fetchTopicById(topicId);
    } catch (error) {
      console.error('Failed to load topic:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageError = validateImageFile(file);
      if (imageError) {
        setValidationErrors(prev => ({ ...prev, image: imageError }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Tạo URL tạm thời cho ảnh mới
      const newPreviewUrl = URL.createObjectURL(file);
      setTempPreviewUrl(newPreviewUrl);
      setPreviewUrl(newPreviewUrl);
      
      setValidationErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    
    // Nếu đang xem ảnh mới (tempPreviewUrl), quay lại ảnh cũ
    if (tempPreviewUrl) {
      URL.revokeObjectURL(tempPreviewUrl);
      setTempPreviewUrl('');
      setPreviewUrl(currentTopic?.img || '');
    } else {
      // Nếu đang xem ảnh cũ, xóa ảnh
      setPreviewUrl('');
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    const nameError = validateTopicName(formData.name);
    if (nameError) errors.name = nameError;

    const descriptionError = validateTopicDescription(formData.description);
    if (descriptionError) errors.description = descriptionError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm() || !id) {
      return;
    }

    try {
      await updateTopic(parseInt(id), formData);
      // Cleanup sau khi submit thành công
      if (tempPreviewUrl) {
        URL.revokeObjectURL(tempPreviewUrl);
        setTempPreviewUrl('');
      }
      navigate('/admin/topics');
    } catch (error) {
      console.error('Failed to update topic:', error);
    }
  };

  if (loading && !currentTopic) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
      </div>
    );
  }

  if (!currentTopic) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy chủ đề
        </h3>
        <button
          onClick={() => navigate('/admin/topics')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/admin/topics')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Chỉnh sửa: {currentTopic.name}
          </h1>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Lỗi khi cập nhật</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Tên chủ đề *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập tên chủ đề..."
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.name}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập mô tả cho chủ đề..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {validationErrors.description}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/500 ký tự
              </p>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <div className="space-y-4">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                      title="Xóa ảnh"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {tempPreviewUrl ? 'Ảnh mới' : 'Ảnh hiện tại'}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Kéo thả hình ảnh hoặc click để chọn
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block transition-colors"
                    >
                      Chọn hình ảnh
                    </label>
                  </div>
                )}
                {validationErrors.image && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.image}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Định dạng hỗ trợ: JPEG, PNG, GIF, WebP. Tối đa 5MB.
                </p>
              </div>
            </div>

            {/* Current Topic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Thông tin hiện tại</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">#{currentTopic.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium">
                    {currentTopic.createdAt ? new Date(currentTopic.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cập nhật lần cuối:</span>
                  <span className="font-medium">
                    {currentTopic.updatedAt ? new Date(currentTopic.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Cập nhật chủ đề
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/admin/topics')}
                disabled={loading}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>

        {/* Form Actions - Mobile */}
        <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Cập nhật chủ đề
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/admin/topics')}
              disabled={loading}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </button>
          </div>
        </div>
      </form>

      {/* Change Tracking */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-800 font-medium">Lưu ý khi cập nhật</p>
            <ul className="text-yellow-700 text-sm mt-1 list-disc list-inside space-y-1">
              <li>Nếu bạn upload hình ảnh mới, hình ảnh cũ sẽ bị xóa khỏi hệ thống</li>
              <li>Chỉ những trường được thay đổi sẽ được cập nhật</li>
              <li>Thời gian cập nhật sẽ được tự động cập nhật</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Message (temporary) */}
      {!loading && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 text-sm">
              Tất cả thay đổi sẽ được lưu khi bạn nhấn "Cập nhật chủ đề"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicEdit;