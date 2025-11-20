import React from 'react';
import { X, CheckCircle, Bell, User, Calendar } from 'lucide-react';
import { Notification } from '../../../types/notification';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  notification
}) => {
  if (!isOpen || !notification) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Thông báo Đã được Gửi</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Thông báo đã được gửi thành công!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">ID:</span>
              <span className="text-sm text-gray-900">#{notification.id}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Tiêu đề:</span>
              <span className="text-sm text-gray-900">{notification.title}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Loại:</span>
              <span className="text-sm text-gray-900">{getTypeLabel(notification.type)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Thời gian:</span>
              <span className="text-sm text-gray-900">
                {new Date(notification.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;