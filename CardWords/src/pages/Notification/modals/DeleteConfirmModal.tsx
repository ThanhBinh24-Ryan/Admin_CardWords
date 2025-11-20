import React from 'react';
import { X, Trash2, AlertTriangle, Bell, User } from 'lucide-react';
import { Notification } from '../../../types/notification';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  notification?: Notification | null; // THÊM PROP NÀY
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  count,
  notification
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'system_alert': 'Cảnh báo Hệ thống',
      'vocab_reminder': 'Nhắc nhở Từ vựng',
      'study_progress': 'Tiến độ Học tập',
      'achievement': 'Thành tích',
      'new_feature': 'Tính năng Mới'
    };
    return labels[type] || type;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              {notification ? 'Xóa Thông báo' : 'Xác nhận Xóa'}
            </h3>
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
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
          </div>
          
          {notification ? (
            <>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-gray-400 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {getTypeLabel(notification.type)}
                      </span>
                      <span>{new Date(notification.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {notification.userId && (
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        User ID: {notification.userId.substring(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-center mb-2">
                Bạn có chắc chắn muốn xóa thông báo này?
              </p>
            </>
          ) : (
            <p className="text-gray-700 text-center mb-2">
              Bạn có chắc chắn muốn xóa <strong>{count} thông báo</strong> đã chọn?
            </p>
          )}
          
          <p className="text-sm text-red-600 text-center">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Hành động này không thể hoàn tác.
          </p>
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
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {notification ? 'Xóa Thông báo' : `Xóa (${count})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;