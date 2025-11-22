// import React from 'react';
// import { ActionLog } from '../../../types/actionLog';
// import { Trash2, X, AlertTriangle } from 'lucide-react';

// interface DeleteConfirmModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   log: ActionLog | null;
// }

// const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   log
// }) => {
//   if (!isOpen || !log) return null;

//   const handleConfirm = () => {
//     onConfirm();
//     onClose();
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString('vi-VN');
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <div className="flex items-center">
//             <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
//             <h3 className="text-lg font-medium text-gray-900">Xác nhận Xóa</h3>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           <p className="text-gray-700 mb-4">
//             Bạn có chắc chắn muốn xóa nhật ký hành động này?
//           </p>
//           <div className="bg-gray-50 p-4 rounded-lg mb-4">
//             <div className="text-sm text-gray-600 space-y-2">
//               <div><strong>User ID:</strong> {log.userId}</div>
//               <div><strong>Hành động:</strong> {log.actionType}</div>
//               <div><strong>Loại tài nguyên:</strong> {log.resourceType}</div>
//               <div><strong>Thời gian:</strong> {formatDate(log.createdAt)}</div>
//             </div>
//           </div>
//           <p className="text-sm text-red-600">
//             Hành động này không thể hoàn tác.
//           </p>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Hủy
//           </button>
//           <button
//             onClick={handleConfirm}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
//           >
//             <Trash2 className="h-4 w-4 mr-2" />
//             Xóa
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeleteConfirmModal;