import React from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';

interface DeleteProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  progress: any;
}

const DeleteProgressModal: React.FC<DeleteProgressModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  progress
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Trash2 className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Xóa Bản Ghi Tiến Độ</h2>
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
          
          <p className="text-gray-600 text-center mb-2">
            Bạn có chắc chắn muốn xóa bản ghi tiến độ này?
          </p>
          
          {progress && (
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <div className="font-semibold text-gray-900">{progress.word}</div>
              <div className="text-sm text-gray-600">{progress.meaningVi}</div>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Đúng: {progress.timesCorrect}</span>
                <span>Sai: {progress.timesWrong}</span>
                <span>Độ chính xác: {progress.accuracy.toFixed(1)}%</span>
              </div>
            </div>
          )}

          <p className="text-sm text-red-600 text-center mt-4">
            Hành động này không thể hoàn tác!
          </p>
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
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProgressModal;