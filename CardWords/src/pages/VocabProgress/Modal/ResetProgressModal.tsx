import React from 'react';
import { RefreshCw, X, AlertTriangle } from 'lucide-react';

interface ResetProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId: string;
}

const ResetProgressModal: React.FC<ResetProgressModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <RefreshCw className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Reset Tiến Độ</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <p className="text-gray-600 text-center mb-4">
            Bạn có chắc chắn muốn reset toàn bộ tiến độ học tập của người dùng này?
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">
              <strong>User ID:</strong> {userId.substring(0, 8)}...
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Tất cả dữ liệu tiến độ sẽ bị xóa vĩnh viễn.
            </div>
          </div>

          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">
                <strong>Cảnh báo:</strong> Hành động này sẽ xóa toàn bộ lịch sử học tập và không thể khôi phục!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetProgressModal;