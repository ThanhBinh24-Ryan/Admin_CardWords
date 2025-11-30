import React from 'react';
import { RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { Notification } from '../../../types/notification';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  notification?: Notification | null;
  isLoading?: boolean; 
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  count,
  notification,
  isLoading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Xác nhận xóa
          </h3>
        </div>
        
        <div className="mb-6">
          {notification ? (
            <div>
              <p className="text-gray-600 mb-2">Bạn có chắc chắn muốn xóa thông báo này?</p>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{notification.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa <span className="font-semibold">{count}</span> thông báo đã chọn?
            </p>
          )}
          
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
               Hành động này không thể hoàn tác.
            </p>
            {count > 1 && (
              <p className="text-red-600 text-xs mt-2">
                Thao tác này sẽ xóa từng thông báo một và có thể mất vài giây.
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;