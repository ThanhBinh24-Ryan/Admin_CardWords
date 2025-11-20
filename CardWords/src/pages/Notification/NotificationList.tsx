import React, { useState, useEffect } from 'react';
import { 
  useNotificationStore, 
  useNotifications, 
  useNotificationLoading,
  useNotificationError,
   useLastCreatedNotification,
  useNotificationsPagination 
} from '../../store/notificationStore';
import CreateNotificationModal from './modals/CreateNotificationModal';
import BroadcastNotificationModal from './modals/BroadcastNotificationModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import SuccessModal from './modals/SuccessModal';
import { Notification, NotificationType } from '../../types/notification';
import { Bell, Plus, Send, Users, MessageSquare, Eye, EyeOff, Trash2, Filter } from 'lucide-react';

const NotificationList: React.FC = () => {
  const notifications = useNotifications();
  const loading = useNotificationLoading();
  const error = useNotificationError();
  const pagination = useNotificationsPagination();
  const lastCreatedNotification = useLastCreatedNotification();
  
  const {
    fetchNotifications,
    deleteNotification,
    deleteMultipleNotifications,
    markAsRead,
    markAllAsRead,
    clearError,
    clearLastCreated
  } = useNotificationStore();

  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);

  useEffect(() => {
    fetchNotifications(currentPage - 1);
  }, [currentPage]);

  useEffect(() => {
    if (lastCreatedNotification) {
      setShowSuccessModal(true);
    }
  }, [lastCreatedNotification]);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter !== 'all') return notif.type === filter;
    return true;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const currentNotifications = filteredNotifications.slice(0, itemsPerPage);

  const getTypeIcon = (type: NotificationType) => {
    const icons: Record<NotificationType, string> = {
      'system_alert': '🔔',
      'vocab_reminder': '📚',
      'study_progress': '📊',
      'achievement': '🏆',
      'new_feature': '🆕'
    };
    return icons[type] || '🔔';
  };

  const getTypeColor = (type: NotificationType) => {
    const colors: Record<NotificationType, string> = {
      'system_alert': 'bg-blue-100 text-blue-800 border-blue-200',
      'vocab_reminder': 'bg-green-100 text-green-800 border-green-200',
      'study_progress': 'bg-purple-100 text-purple-800 border-purple-200',
      'achievement': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'new_feature': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeLabel = (type: NotificationType) => {
    const labels: Record<NotificationType, string> = {
      'system_alert': 'Cảnh báo Hệ thống',
      'vocab_reminder': 'Nhắc nhở Từ vựng',
      'study_progress': 'Tiến độ Học tập',
      'achievement': 'Thành tích',
      'new_feature': 'Tính năng Mới'
    };
    return labels[type] || type;
  };

  const handleDeleteNotification = async (notification: Notification) => {
    if (!notification.userId) {
      console.error('Cannot delete notification: userId is missing');
      return;
    }
    try {
      await deleteNotification(notification.userId, notification.id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;
    const firstNotification = notifications.find(n => n.id === selectedNotifications[0]);
    if (!firstNotification?.userId) {
      console.error('Cannot delete notifications: userId is missing');
      return;
    }
    try {
      await deleteMultipleNotifications(firstNotification.userId, selectedNotifications);
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Failed to delete notifications:', error);
    }
  };

  const handleDeleteClick = (notification: Notification) => {
    setNotificationToDelete(notification);
    setShowDeleteModal(true);
  };

  const handleDeleteSingle = async (notification: Notification) => {
    await handleDeleteNotification(notification);
    setShowDeleteModal(false);
    setNotificationToDelete(null);
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === currentNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(currentNotifications.map(notif => notif.id));
    }
  };

  const toggleSelectNotification = (id: number) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="mt-3 bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Thông báo</h1>
              <p className="text-gray-600">Tạo và quản lý thông báo cho người dùng</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo Thông báo
              </button>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Gửi đến Tất cả
              </button>
            </div>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6 mb-4 lg:mb-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
                <div className="text-sm text-gray-500">Tổng số</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
                <div className="text-sm text-gray-500">Chưa đọc</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
                <div className="text-sm text-gray-500">Đã đọc</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Đánh dấu Tất cả Đã đọc
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={selectedNotifications.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa Đã chọn ({selectedNotifications.length})
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Bộ lọc
              </h3>
              
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Tất cả Thông báo', count: notifications.length },
                  { value: 'unread', label: 'Chưa đọc', count: unreadCount },
                  { value: 'vocab_reminder', label: 'Nhắc nhở Từ vựng', count: notifications.filter(n => n.type === 'vocab_reminder').length },
                  { value: 'study_progress', label: 'Tiến độ Học tập', count: notifications.filter(n => n.type === 'study_progress').length },
                  { value: 'achievement', label: 'Thành tích', count: notifications.filter(n => n.type === 'achievement').length },
                  { value: 'new_feature', label: 'Tính năng Mới', count: notifications.filter(n => n.type === 'new_feature').length },
                  { value: 'system_alert', label: 'Cảnh báo Hệ thống', count: notifications.filter(n => n.type === 'system_alert').length }
                ].map((filterOption) => (
                  <button
                    key={filterOption.value}
                    onClick={() => setFilter(filterOption.value as any)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      filter === filterOption.value
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{filterOption.label}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        filter === filterOption.value
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {filterOption.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.length === currentNotifications.length && currentNotifications.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                    <span className="text-sm text-gray-600">
                      {filteredNotifications.length} thông báo
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Trang {currentPage} của {totalPages}
                  </div>
                </div>
              </div>

              {/* Notifications */}
              {loading && notifications.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {currentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-6 transition-colors ${
                        notification.isRead ? 'bg-white' : 'bg-blue-50'
                      } ${
                        selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <label className="flex items-start pt-1">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(notification.id)}
                            onChange={() => toggleSelectNotification(notification.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </label>

                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
                          }`}>
                            {getTypeIcon(notification.type)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className={`text-lg font-semibold ${
                                notification.isRead ? 'text-gray-900' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                  {getTypeLabel(notification.type)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {getTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {notification.content}
                          </p>

                          <div className="flex items-center space-x-4">
                            {!notification.isRead ? (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Đánh dấu đã đọc
                              </button>
                            ) : (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center"
                              >
                                <EyeOff className="w-4 h-4 mr-1" />
                                Đánh dấu chưa đọc
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteClick(notification)}
                              className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {currentNotifications.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔔</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy thông báo</h3>
                  <p className="text-gray-500">
                    {filter === 'all' 
                      ? "Chưa có thông báo nào trong hệ thống."
                      : `Không có thông báo ${filter === 'unread' ? 'chưa đọc' : getTypeLabel(filter as NotificationType)} nào.`
                    }
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Hiển thị {Math.min(filteredNotifications.length, 1)} đến {Math.min(itemsPerPage, filteredNotifications.length)} của {filteredNotifications.length} kết quả
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Trước
                      </button>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
   

{/* Modals */}
<CreateNotificationModal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
/>

<BroadcastNotificationModal
  isOpen={showBroadcastModal}
  onClose={() => setShowBroadcastModal(false)}
/>

<DeleteConfirmModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDeleteSelected}
  count={selectedNotifications.length}
/>

<DeleteConfirmModal
  isOpen={notificationToDelete !== null}
  onClose={() => {
    setNotificationToDelete(null);
  }}
  onConfirm={() => handleDeleteSingle(notificationToDelete!)}
  count={1}
  notification={notificationToDelete}
/>

<SuccessModal
  isOpen={showSuccessModal}
  onClose={() => {
    setShowSuccessModal(false);
    clearLastCreated();
  }}
  notification={lastCreatedNotification}
/>
      </div>
    </div>
  );
};

export default NotificationList;