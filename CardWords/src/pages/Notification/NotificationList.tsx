import React, { useState, useEffect } from 'react';
import { 
  useNotificationStore, 
  useUsers,
  useSummary,
  useCategories,
  useNotificationLoading,
  useNotificationError,
  useLastCreatedNotification
} from '../../store/notificationStore';
import CreateNotificationModal from './modals/CreateNotificationModal';
import BroadcastNotificationModal from './modals/BroadcastNotificationModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import SuccessModal from './modals/SuccessModal';
import { 
  Bell, 
  Plus, 
  Send, 
  Filter, 
  BookOpen, 
  Trophy, 
  GamepadIcon,
  Zap,
  AlertTriangle,
  Star,
  Target,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';

const NotificationList: React.FC = () => {
  const users = useUsers();
  const summary = useSummary();
  const categories = useCategories();
  const loading = useNotificationLoading();
  const error = useNotificationError();
  const lastCreatedNotification = useLastCreatedNotification();
  
  const {
    fetchUsers,
    fetchSummary,
    fetchCategories,
    refreshAllData,
    clearError,
    clearLastCreated
  } = useNotificationStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('🔄 Initial data loading...');
    fetchUsers();
    fetchSummary();
    fetchCategories(); // Gọi CẢ HAI API
  }, [fetchUsers, fetchSummary, fetchCategories]);

  useEffect(() => {
    if (lastCreatedNotification) {
      setShowSuccessModal(true);
    }
  }, [lastCreatedNotification]);

  // Hàm refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshAllData();
    setRefreshing(false);
  };

  // Tính toán thống kê - ƯU TIÊN SUMMARY TRƯỚC, NẾU KHÔNG CÓ THÌ DÙNG CATEGORIES
  const getTotalCount = () => {
    // Ưu tiên dùng summary trước
    if (summary && Array.isArray(summary)) {
      const allItem = summary.find(item => 
        item.category === 'All Notifications' || item.category === 'Total'
      );
      if (allItem) return allItem.count;
    }
    
    // Nếu summary không có thì dùng categories
    if (categories && Array.isArray(categories)) {
      const allItem = categories.find(item => 
        item.category === 'All Notifications' || item.category === 'Total'
      );
      return allItem ? allItem.count : 0;
    }
    
    return 0;
  };

  const getUnreadCount = () => {
    // Ưu tiên dùng summary trước
    if (summary && Array.isArray(summary)) {
      const unreadItem = summary.find(item => 
        item.category === 'Unread'
      );
      if (unreadItem) return unreadItem.count;
    }
    
    // Nếu summary không có thì dùng categories
    if (categories && Array.isArray(categories)) {
      const unreadItem = categories.find(item => 
        item.category === 'Unread'
      );
      return unreadItem ? unreadItem.count : 0;
    }
    
    return 0;
  };

  const getReadCount = () => {
    return getTotalCount() - getUnreadCount();
  };

  // Hàm chuyển đổi category sang tiếng Việt
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
      'System Alerts': 'Cảnh báo Hệ thống'
    };
    return labels[category] || category;
  };

  // Hàm lấy icon theo category
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
      'Read': <Bell className="w-5 h-5" />
    };
    return icons[category] || <Bell className="w-5 h-5" />;
  };

  // Hàm lấy màu theo category
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
      'Read': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Lấy data để hiển thị - KẾT HỢP CẢ SUMMARY VÀ CATEGORIES
  const getDisplayData = () => {
    // Ưu tiên dùng categories trước (vì nó có đầy đủ các loại thông báo)
    if (categories && Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    
    // Nếu categories không có thì dùng summary
    if (summary && Array.isArray(summary) && summary.length > 0) {
      return summary;
    }
    
    return [];
  };

  const displayData = getDisplayData();

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
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Thông báo</h1>
              <p className="text-gray-600">Tạo và quản lý thông báo cho người dùng</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Đang tải...' : 'Làm mới'}
              </button>
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
            </div>

            <div className="text-sm text-gray-600">
              {Array.isArray(users) ? users.length : 0} users trong hệ thống
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Thống kê theo Loại
              </h3>
              
              <div className="space-y-2">
                {/* Tất cả Thông báo */}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>Tất cả Thông báo</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedCategory === 'all'
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {getTotalCount()}
                    </span>
                  </div>
                </button>

                {/* Các loại thông báo - DÙNG DISPLAY DATA (KẾT HỢP CẢ SUMMARY VÀ CATEGORIES) */}
                {Array.isArray(displayData) && displayData.map((item, index) => (
                  <button
                    key={`${item.category}-${index}`}
                    onClick={() => setSelectedCategory(item.category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === item.category
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{getTypeLabel(item.category)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedCategory === item.category
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.count || 0}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Bell className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Thông báo</h3>
                  <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
                    Sử dụng các API có sẵn để quản lý thông báo hệ thống
                  </p>
                  
                  {/* Thống kê tổng quan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
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
                  </div>

                  {/* Các loại thông báo - DÙNG DISPLAY DATA */}
                  {Array.isArray(displayData) && displayData.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-900 mb-6 text-lg">
                        Các loại thông báo trong hệ thống:
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
                      <p className="text-gray-500">Cả hai API /notifications/summary và /notifications/categories đều không trả về dữ liệu.</p>
                      <button
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Thử lại
                      </button>
                    </div>
                  )}

                  {/* Debug info */}
                  <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Debug Info:</h4>
                    <div className="text-left text-sm">
                      <p><strong>Categories data:</strong> {Array.isArray(categories) ? categories.length : 0} items</p>
                      <p><strong>Summary data:</strong> {Array.isArray(summary) ? summary.length : 0} items</p>
                      <p><strong>Users data:</strong> {Array.isArray(users) ? users.length : 0} items</p>
                      <p><strong>Display data:</strong> {Array.isArray(displayData) ? displayData.length : 0} items</p>
                      <p><strong>Data source:</strong> {Array.isArray(categories) && categories.length > 0 ? 'Categories' : Array.isArray(summary) && summary.length > 0 ? 'Summary' : 'None'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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