import React, { useState } from 'react';
import { X, User, Send } from 'lucide-react';
import { useNotificationStore } from '../.././../store/notificationStore';
import { NotificationType } from '../../../types/notification';

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    content: '',
    type: 'system_alert' as NotificationType
  });
  const [creating, setCreating] = useState(false);
  
  const { createNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      // Chuẩn bị data để gửi, loại bỏ userId nếu empty
      const requestData = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        ...(formData.userId && { userId: formData.userId })
      };

      await createNotification(requestData);
      onClose();
      setFormData({ userId: '', title: '', content: '', type: 'system_alert' });
    } catch (error) {
      console.error('Failed to create notification:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Send className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Tạo Thông báo</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              User ID (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => handleChange('userId', e.target.value)}
              placeholder="Để trống để gửi đến tất cả users"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Định dạng UUID: 3fa85f64-5717-4562-b3fc-2c963f66afa6
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Nhập tiêu đề thông báo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại thông báo *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="system_alert">🔔 Cảnh báo Hệ thống</option>
              <option value="vocab_reminder">📚 Nhắc nhở Từ vựng</option>
              <option value="study_progress">📊 Tiến độ Học tập</option>
              <option value="achievement">🏆 Thành tích</option>
              <option value="new_feature">🆕 Tính năng Mới</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung *
            </label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Nhập nội dung thông báo chi tiết..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Tạo Thông báo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotificationModal;