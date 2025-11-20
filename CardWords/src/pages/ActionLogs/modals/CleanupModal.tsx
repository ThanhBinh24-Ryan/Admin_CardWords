import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Calendar } from 'lucide-react';

interface CleanupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (daysToKeep: number) => void;
}

const CleanupModal: React.FC<CleanupModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [daysToKeep, setDaysToKeep] = useState(90);
  const [cleaning, setCleaning] = useState(false);

  const handleCleanup = async () => {
    setCleaning(true);
    try {
      await onConfirm(daysToKeep);
      onClose();
    } catch (error) {
      console.error('Cleanup failed:', error);
    } finally {
      setCleaning(false);
    }
  };

  if (!isOpen) return null;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Trash2 className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Dọn dẹp Nhật ký</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <p className="text-gray-700">
              Hành động này sẽ xóa vĩnh viễn tất cả nhật ký hành động cũ hơn số ngày chỉ định.
            </p>
          </div>

          <div className="mb-4">
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Giữ lại nhật ký trong (ngày)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={daysToKeep}
              onChange={(e) => setDaysToKeep(parseInt(e.target.value) || 90)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Nhật ký cũ hơn {daysToKeep} ngày (trước {cutoffDate.toLocaleDateString('vi-VN')}) sẽ bị xóa.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Hãy chắc chắn bạn đã xuất dữ liệu cần thiết trước khi tiếp tục.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleCleanup}
            disabled={cleaning}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
              cleaning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {cleaning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Dọn dẹp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CleanupModal;