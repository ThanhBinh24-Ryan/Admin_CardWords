import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteAllConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  isLoading: boolean;
  userName?: string;
}

const DeleteAllConfirmModal: React.FC<DeleteAllConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  count,
  isLoading,
  userName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-white mr-3" />
              <h3 className="text-xl font-bold text-white">Xóa tất cả thông báo</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              Xóa tất cả thông báo của {userName || 'người dùng'}
            </h4>
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa tất cả {count} thông báo? Hành động này không thể hoàn tác.
            </p>
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 text-sm">
                <span className="font-bold">Cảnh báo:</span> Tất cả {count} thông báo sẽ bị xóa vĩnh viễn. Không thể khôi phục sau khi xóa.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all font-medium hover:shadow-md"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Xóa tất cả ({count})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAllConfirmModal;