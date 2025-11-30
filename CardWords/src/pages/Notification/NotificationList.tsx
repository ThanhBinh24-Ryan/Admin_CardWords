import React, { useState, useEffect } from 'react';
import { 
  useNotificationStore, 
  useUsers,
  useSummary,
  useCategories,
  useNotificationLoading,
  useNotificationDeleting,
  useNotificationError,
  useLastCreatedNotification,
  useAllNotifications
} from '../../store/notificationStore';
import CreateNotificationModal from './modals/CreateNotificationModal';
import BroadcastNotificationModal from './modals/BroadcastNotificationModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import SuccessModal from './modals/SuccessModal';
import { 
  Bell, 
  Plus, 
  Send, 
  BookOpen, 
  Trophy, 
  GamepadIcon,
  Zap,
  AlertTriangle,
  Star,
  Target,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Users,
  User,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { Notification, NotificationFilter } from '../../types/notification';

const NotificationList: React.FC = () => {
  const users = useUsers();
  const summary = useSummary();
  const categories = useCategories();
  const loading = useNotificationLoading();
  const deleting = useNotificationDeleting();
  const error = useNotificationError();
  const lastCreatedNotification = useLastCreatedNotification();
  const allNotifications = useAllNotifications();
  
  const {
    fetchUsers,
    fetchSummary,
    fetchCategories,
    fetchAllNotifications,
    fetchUserNotifications,
    deleteUserNotification,
    deleteMultipleUserNotifications,
    refreshAllData,
    clearError,
    clearLastCreated,
    setSelectedUser,
    userNotifications
  } = useNotificationStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [viewMode, setViewMode] = useState<'summary' | 'all' | 'user'>('summary');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const selectedUserNotifications = selectedUserId ? userNotifications[selectedUserId] : null;

  useEffect(() => {
    console.log(' Initial data loading...');
    fetchUsers();
    fetchSummary();
    fetchCategories();
    fetchAllNotifications();
  }, [fetchUsers, fetchSummary, fetchCategories, fetchAllNotifications]);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserNotifications(selectedUserId);
      const user = users.find(u => u.id === selectedUserId);
      setSelectedUser(user || null);
    }
  }, [selectedUserId, fetchUserNotifications, setSelectedUser, users]);

  useEffect(() => {
    if (lastCreatedNotification) {
      setShowSuccessModal(true);
    }
  }, [lastCreatedNotification]);

  const handleRefresh = async () => {
    await refreshAllData();
    await fetchAllNotifications();
    if (selectedUserId) {
      await fetchUserNotifications(selectedUserId);
    }
  };

  const handleDeleteUserNotification = async (userId: string, notificationId: number) => {
    try {
      const result = await deleteUserNotification(userId, notificationId);

      if (result.success) {
        await handleRefresh();
      }
      
      return result;
    } catch (error) {
      console.error('Failed to delete user notification:', error);
      return { success: false, message: 'Failed to delete notification' };
    }
  };

  const handleDeleteMultipleUserNotifications = async (userId: string, notificationIds: number[]) => {
    try {
      const result = await deleteMultipleUserNotifications(userId, notificationIds);
      
      if (result.success || result.successful.length > 0) {
        await handleRefresh();
        setSelectedNotifications([]);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to delete multiple notifications:', error);
      return { success: false, successful: [], failed: notificationIds, message: 'Failed to delete notifications' };
    }
  };

  const handleDeleteAllUserNotifications = async () => {
    if (selectedUserNotifications?.content) {
      const allNotificationIds = selectedUserNotifications.content.map(notif => notif.id);
      const result = await handleDeleteMultipleUserNotifications(selectedUserId, allNotificationIds);
      
      if (result.successful.length > 0) {
        console.log(` Đã xóa ${result.successful.length} thông báo thành công`);
      }
      if (result.failed.length > 0) {
        console.log(` Không thể xóa ${result.failed.length} thông báo`);
      }
    }
  };

  const handleDeleteSingleNotification = async (notification: Notification) => {
    if (notification.userId && selectedUserId === notification.userId) {
      const result = await handleDeleteUserNotification(notification.userId, notification.id);
      
      if (result.success) {
        console.log(' Đã xóa thông báo thành công');
      }
    }
    setShowDeleteModal(false);
    setNotificationToDelete(null);
  };

   const getTotalCount = () => {
    if (summary && Array.isArray(summary)) {
      const allItem = summary.find(item => 
        item.category === 'All Notifications' || item.category === 'Total'
      );
      if (allItem) return allItem.count;
    }
    
    if (categories && Array.isArray(categories)) {
      const allItem = categories.find(item => 
        item.category === 'All Notifications' || item.category === 'Total'
      );
      return allItem ? allItem.count : 0;
    }
    
    return allNotifications?.totalElements || 0;
  };

  const getUnreadCount = () => {
    if (summary && Array.isArray(summary)) {
      const unreadItem = summary.find(item => item.category === 'Unread');
      if (unreadItem) return unreadItem.count;
    }
    
    if (allNotifications?.content) {
      return allNotifications.content.filter(notification => !notification.isRead).length;
    }
    
    return 0;
  };

  const getReadCount = () => {
    return getTotalCount() - getUnreadCount();
  };

  const getTypeLabel = (category: string): string => {
    const labels: Record<string, string> = {
      'All Notifications': 'Tất cả Thông báo',
      'Total': 'Tổng số',
      'Unread': 'Chưa đọc',
      'Read': 'Đã đọc',
      'Study Progress': 'Tiến độ Học tập',
      'Vocabulary Reminders': 'Nhắc nhở Từ vựng',
      'Streak Reminders': 'Nhắc nhở Streak',
      'Streak Milestones': 'Mốc Streak',
      'Game Achievements': 'Thành tích Game',
      'Achievements': 'Thành tích',
      'New Features': 'Tính năng Mới',
      'System Alerts': 'Cảnh báo Hệ thống',
      'study_progress': 'Tiến độ Học tập',
      'vocab_reminder': 'Nhắc nhở Từ vựng',
      'streak_reminder': 'Nhắc nhở Streak',
      'streak_milestone': 'Mốc Streak',
      'game_achievement': 'Thành tích Game',
      'achievement': 'Thành tích',
      'new_feature': 'Tính năng Mới',
      'system_alert': 'Cảnh báo Hệ thống'
    };
    return labels[category] || category;
  };

  const getTypeIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Study Progress': <BookOpen className="w-5 h-5" />,
      'Vocabulary Reminders': <BookOpen className="w-5 h-5" />,
      'Streak Reminders': <Zap className="w-5 h-5" />,
      'Streak Milestones': <Target className="w-5 h-5" />,
      'Game Achievements': <GamepadIcon className="w-5 h-5" />,
      'Achievements': <Trophy className="w-5 h-5" />,
      'New Features': <Star className="w-5 h-5" />,
      'System Alerts': <AlertTriangle className="w-5 h-5" />,
      'All Notifications': <Bell className="w-5 h-5" />,
      'Total': <Bell className="w-5 h-5" />,
      'Unread': <Bell className="w-5 h-5" />,
      'Read': <Bell className="w-5 h-5" />,
      'study_progress': <BookOpen className="w-5 h-5" />,
      'vocab_reminder': <BookOpen className="w-5 h-5" />,
      'streak_reminder': <Zap className="w-5 h-5" />,
      'streak_milestone': <Target className="w-5 h-5" />,
      'game_achievement': <GamepadIcon className="w-5 h-5" />,
      'achievement': <Trophy className="w-5 h-5" />,
      'new_feature': <Star className="w-5 h-5" />,
      'system_alert': <AlertTriangle className="w-5 h-5" />
    };
    return icons[category] || <Bell className="w-5 h-5" />;
  };

  const getTypeColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Study Progress': 'bg-purple-100 text-purple-800 border-purple-200',
      'Vocabulary Reminders': 'bg-green-100 text-green-800 border-green-200',
      'Streak Reminders': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Streak Milestones': 'bg-orange-100 text-orange-800 border-orange-200',
      'Game Achievements': 'bg-pink-100 text-pink-800 border-pink-200',
      'Achievements': 'bg-amber-100 text-amber-800 border-amber-200',
      'New Features': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'System Alerts': 'bg-red-100 text-red-800 border-red-200',
      'All Notifications': 'bg-blue-100 text-blue-800 border-blue-200',
      'Total': 'bg-blue-100 text-blue-800 border-blue-200',
      'Unread': 'bg-gray-100 text-gray-800 border-gray-200',
      'Read': 'bg-green-100 text-green-800 border-green-200',
      'study_progress': 'bg-purple-100 text-purple-800 border-purple-200',
      'vocab_reminder': 'bg-green-100 text-green-800 border-green-200',
      'streak_reminder': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'streak_milestone': 'bg-orange-100 text-orange-800 border-orange-200',
      'game_achievement': 'bg-pink-100 text-pink-800 border-pink-200',
      'achievement': 'bg-amber-100 text-amber-800 border-amber-200',
      'new_feature': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'system_alert': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredNotifications = allNotifications?.content?.filter(notification => {
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.userName && notification.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'read' && notification.isRead) ||
      (statusFilter === 'unread' && !notification.isRead);
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const getDisplayData = () => {
    if (categories && Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    
    if (summary && Array.isArray(summary) && summary.length > 0) {
      return summary;
    }
    
    return [];
  };

  const displayData = getDisplayData();

  const toggleSelectNotification = (notificationId: number) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const toggleSelectAll = () => {
    if (!selectedUserNotifications?.content) return;
    
    if (selectedNotifications.length === selectedUserNotifications.content.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(selectedUserNotifications.content.map(notif => notif.id));
    }
  };

  const renderNotificationList = () => {
    const notificationsToShow = selectedUserId ? 
      selectedUserNotifications?.content || [] : 
      filteredNotifications;

    if (notificationsToShow.length === 0) {
      const currentUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;
      
      return (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            
            {selectedUserId ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentUser?.name} chưa có thông báo nào
                </h3>
                <p className="text-gray-500 mb-6">
                  User này hiện chưa nhận được thông báo nào trong hệ thống.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedUserId('');
                      setSelectedNotifications([]);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo thông báo
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không có thông báo nào
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? 'Không tìm thấy thông báo phù hợp với từ khóa tìm kiếm.'
                    : 'Hiện không có thông báo nào trong hệ thống.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mb-4"
                  >
                    Xóa bộ lọc tìm kiếm
                  </button>
                )}
                <div className="mt-4">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo thông báo đầu tiên
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {selectedUserId 
              ? `Thông báo của ${users.find(u => u.id === selectedUserId)?.name} (${notificationsToShow.length})`
              : `Tất cả thông báo (${notificationsToShow.length})`
            }
          </h3>
          
          <div className="flex items-center space-x-3">
            {/* CHỈ HIỂN THỊ NÚT XÓA TRONG TRANG USER */}
            {selectedUserId && selectedNotifications.length > 0 && (
              <button
                onClick={() => {
                  setNotificationToDelete(null);
                  setShowDeleteModal(true);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa ({selectedNotifications.length})
              </button>
            )}
            
            {/* Nút xóa tất cả - CHỈ TRONG TRANG USER */}
            {selectedUserId && notificationsToShow.length > 0 && (
              <button
                onClick={handleDeleteAllUserNotifications}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa tất cả
              </button>
            )}
            
            {selectedUserId && (
              <button
                onClick={() => {
                  setSelectedUserId('');
                  setSelectedNotifications([]);
                }}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Quay lại
              </button>
            )}
          </div>
        </div>

        {/* Select All - CHỈ HIỂN THỊ TRONG TRANG USER */}
        {selectedUserId && selectedUserNotifications?.content && selectedUserNotifications.content.length > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <button
              onClick={toggleSelectAll}
              className="flex items-center space-x-2 text-sm text-gray-700"
            >
              {selectedNotifications.length === selectedUserNotifications.content.length ? (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
              <span>
                {selectedNotifications.length === selectedUserNotifications.content.length 
                  ? 'Bỏ chọn tất cả' 
                  : 'Chọn tất cả'
                }
              </span>
            </button>
            
            {selectedNotifications.length > 0 && (
              <span className="text-sm text-gray-500">
                Đã chọn {selectedNotifications.length} thông báo
              </span>
            )}
          </div>
        )}

        <div className="space-y-3">
          {notificationsToShow.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-colors ${
                selectedNotifications.includes(notification.id)
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* CHECKBOX CHỈ HIỂN THỊ TRONG TRANG USER */}
                  {selectedUserId && (
                    <button
                      onClick={() => toggleSelectNotification(notification.id)}
                      className="mt-1"
                    >
                      {selectedNotifications.includes(notification.id) ? (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(notification.type)}`}>
                        {getTypeLabel(notification.type)}
                      </span>
                      {notification.isRead ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{notification.content}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(notification.createdAt).toLocaleString('vi-VN')}
                      </div>
                      
                      {notification.userId && !selectedUserId && (
                        <button
                          onClick={() => setSelectedUserId(notification.userId!)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <User className="w-3 h-3 mr-1" />
                          {notification.userName || `User: ${notification.userId.substring(0, 8)}...`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* NÚT XÓA CHỈ HIỂN THỊ TRONG TRANG USER */}
                {selectedUserId && (
                  <button
                    onClick={() => {
                      setNotificationToDelete(notification);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUserList = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedUserId(user.id)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Level: {user.currentLevel}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.activated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.activated ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
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
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Bell className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý Thông báo</h1>
          <p className="text-gray-600 text-lg">Tạo và quản lý thông báo cho người dùng</p>
          
          {/* Action Buttons - ĐÃ BỎ NÚT "LÀM MỚI" */}
          <div className="flex justify-center mt-6 space-x-3 flex-wrap">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mb-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo Thông báo
            </button>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mb-2"
            >
              <Send className="w-4 h-4 mr-2" />
              Gửi đến Tất cả
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'summary' ? 'all' : 'summary')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center mb-2"
            >
              {viewMode === 'summary' ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {viewMode === 'summary' ? 'Xem Chi tiết' : 'Xem Tổng quan'}
            </button>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6 mb-4 lg:mb-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{getTotalCount()}</div>
                <div className="text-sm text-gray-500">Tổng số</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{getUnreadCount()}</div>
                <div className="text-sm text-gray-500">Chưa đọc</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{getReadCount()}</div>
                <div className="text-sm text-gray-500">Đã đọc</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Array.isArray(users) ? users.length : 0}
                </div>
                <div className="text-sm text-gray-500">Số users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters - ẨN KHI Ở TRANG USER */}
        {viewMode !== 'summary' && !selectedUserId && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm thông báo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="read">Đã đọc</option>
                <option value="unread">Chưa đọc</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="study_progress">Tiến độ học tập</option>
                <option value="vocab_reminder">Nhắc nhở từ vựng</option>
                <option value="streak_reminder">Nhắc nhở streak</option>
                <option value="achievement">Thành tích</option>
                <option value="system_alert">Cảnh báo hệ thống</option>
              </select>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : viewMode === 'summary' ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Bell className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Thông báo</h3>
              
              {/* Thống kê tổng quan */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{getTotalCount()}</div>
                  <div className="text-sm text-blue-800 font-medium">Tổng số thông báo</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600">
                    {Array.isArray(users) ? users.length : 0}
                  </div>
                  <div className="text-sm text-green-800 font-medium">Số users trong hệ thống</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600">{getUnreadCount()}</div>
                  <div className="text-sm text-orange-800 font-medium">Thông báo chưa đọc</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">{getReadCount()}</div>
                  <div className="text-sm text-purple-800 font-medium">Thông báo đã đọc</div>
                </div>
              </div>

              {/* Các loại thông báo */}
              {Array.isArray(displayData) && displayData.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-6 text-lg">
                    Phân loại thông báo:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayData.map((item, index) => (
                      <div 
                        key={`display-${index}`}
                        className={`p-4 rounded-lg border-2 ${getTypeColor(item.category)} flex items-center space-x-4 transition-transform hover:scale-105`}
                      >
                        <div className="flex-shrink-0">
                          {getTypeIcon(item.category)}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{getTypeLabel(item.category)}</div>
                          <div className="text-sm opacity-80 mt-1">
                            {item.count || 0} thông báo
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hiển thị khi không có data */}
              {(!Array.isArray(displayData) || displayData.length === 0) && (
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-4">Không có dữ liệu thông báo</h4>
                  <button
                    onClick={handleRefresh}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tải lại dữ liệu
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              {!selectedUserId && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Danh sách Users</h3>
                  {renderUserList()}
                </div>
              )}
              
              {renderNotificationList()}
            </div>
          )}
        </div>

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
          onClose={() => {
            setShowDeleteModal(false);
            setNotificationToDelete(null);
          }}
          onConfirm={() => {
            if (notificationToDelete) {
              handleDeleteSingleNotification(notificationToDelete);
            } else if (selectedNotifications.length > 0 && selectedUserId) {
              handleDeleteMultipleUserNotifications(selectedUserId, selectedNotifications);
              setShowDeleteModal(false);
            }
          }}
          count={notificationToDelete ? 1 : selectedNotifications.length}
          notification={notificationToDelete}
          isLoading={deleting}
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