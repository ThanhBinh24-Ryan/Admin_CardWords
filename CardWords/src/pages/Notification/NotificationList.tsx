import React, { useState, useEffect } from 'react';

// Định nghĩa types
interface Notification {
  id: string;
  created_at: string;
  updated_at: string;
  content: string;
  is_read: boolean;
  title: string;
  type: NotificationType;
  user_id: string;
}

type NotificationType = 
  | 'SYSTEM_ALERT'
  | 'VOCAB_REMINDER'
  | 'STUDY_PROGRESS'
  | 'ACHIEVEMENT'
  | 'SECURITY_ALERT'
  | 'NEW_FEATURE'
  | 'MAINTENANCE'
  | 'PROMOTIONAL';

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    created_at: '2024-01-20T14:30:00',
    updated_at: '2024-01-20T14:30:00',
    content: 'Your vocabulary review session is scheduled for tomorrow. Make sure to complete your daily practice to maintain your learning streak!',
    is_read: false,
    title: 'Vocabulary Review Reminder',
    type: 'VOCAB_REMINDER',
    user_id: 'user1'
  },
  {
    id: '2',
    created_at: '2024-01-20T12:15:00',
    updated_at: '2024-01-20T12:15:00',
    content: 'New vocabulary package "Business English Advanced" has been added to your available courses. Start learning now to expand your professional vocabulary.',
    is_read: false,
    title: 'New Vocabulary Package Available',
    type: 'NEW_FEATURE',
    user_id: 'user1'
  },
  {
    id: '3',
    created_at: '2024-01-19T16:45:00',
    updated_at: '2024-01-19T16:45:00',
    content: 'Congratulations! You have reached 30-day learning streak. Keep up the great work and continue your language learning journey.',
    is_read: true,
    title: '30-Day Learning Streak Achieved! 🎉',
    type: 'ACHIEVEMENT',
    user_id: 'user1'
  },
  {
    id: '4',
    created_at: '2024-01-19T10:20:00',
    updated_at: '2024-01-19T10:20:00',
    content: 'System maintenance is scheduled for January 21st, 2024 from 2:00 AM to 4:00 AM UTC. The application may be temporarily unavailable during this time.',
    is_read: true,
    title: 'Scheduled Maintenance Notice',
    type: 'MAINTENANCE',
    user_id: 'user1'
  },
  {
    id: '5',
    created_at: '2024-01-18T15:30:00',
    updated_at: '2024-01-18T15:30:00',
    content: 'We have detected a new login to your account from a new device. If this was not you, please secure your account immediately.',
    is_read: true,
    title: 'Security Alert: New Login Detected',
    type: 'SECURITY_ALERT',
    user_id: 'user1'
  },
  {
    id: '6',
    created_at: '2024-01-18T09:15:00',
    updated_at: '2024-01-18T09:15:00',
    content: 'Your progress report for last week is ready. You learned 45 new words with 92% accuracy. Great job!',
    is_read: true,
    title: 'Weekly Progress Report',
    type: 'STUDY_PROGRESS',
    user_id: 'user1'
  },
  {
    id: '7',
    created_at: '2024-01-17T14:00:00',
    updated_at: '2024-01-17T14:00:00',
    content: 'Special offer: Get 50% off on premium subscription for the next 48 hours. Upgrade now to unlock advanced features!',
    is_read: true,
    title: 'Limited Time Offer 🚀',
    type: 'PROMOTIONAL',
    user_id: 'user1'
  },
  {
    id: '8',
    created_at: '2024-01-17T11:30:00',
    updated_at: '2024-01-17T11:30:00',
    content: 'New speaking practice feature is now available. Practice your pronunciation with AI-powered feedback.',
    is_read: true,
    title: 'New Feature: Speaking Practice',
    type: 'NEW_FEATURE',
    user_id: 'user1'
  },
  {
    id: '9',
    created_at: '2024-01-16T17:20:00',
    updated_at: '2024-01-16T17:20:00',
    content: 'Important system update: We have improved the performance of vocabulary review algorithms for better learning experience.',
    is_read: true,
    title: 'System Update Completed',
    type: 'SYSTEM_ALERT',
    user_id: 'user1'
  },
  {
    id: '10',
    created_at: '2024-01-16T13:45:00',
    updated_at: '2024-01-16T13:45:00',
    content: 'You have 15 words waiting for review in your "Travel Vocabulary" package. Complete your review to maintain optimal learning progress.',
    is_read: true,
    title: 'Vocabulary Review Pending',
    type: 'VOCAB_REMINDER',
    user_id: 'user1'
  }
];

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, notifications]);

  const applyFilters = () => {
    let result = [...notifications];

    if (filter === 'unread') {
      result = result.filter(notif => !notif.is_read);
    } else if (filter !== 'all') {
      result = result.filter(notif => notif.type === filter);
    }

    setFilteredNotifications(result);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  const getTypeIcon = (type: NotificationType) => {
    const icons: Record<NotificationType, string> = {
      'SYSTEM_ALERT': '🔔',
      'VOCAB_REMINDER': '📚',
      'STUDY_PROGRESS': '📊',
      'ACHIEVEMENT': '🏆',
      'SECURITY_ALERT': '🛡️',
      'NEW_FEATURE': '🆕',
      'MAINTENANCE': '🔧',
      'PROMOTIONAL': '🎁'
    };
    return icons[type];
  };

  const getTypeColor = (type: NotificationType) => {
    const colors: Record<NotificationType, string> = {
      'SYSTEM_ALERT': 'bg-blue-100 text-blue-800 border-blue-200',
      'VOCAB_REMINDER': 'bg-green-100 text-green-800 border-green-200',
      'STUDY_PROGRESS': 'bg-purple-100 text-purple-800 border-purple-200',
      'ACHIEVEMENT': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'SECURITY_ALERT': 'bg-red-100 text-red-800 border-red-200',
      'NEW_FEATURE': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'MAINTENANCE': 'bg-gray-100 text-gray-800 border-gray-200',
      'PROMOTIONAL': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[type];
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, is_read: true } : notif
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, is_read: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, is_read: true }))
    );
    setSelectedNotifications([]);
  };

  const deleteNotification = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      setSelectedNotifications(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const deleteSelected = () => {
    if (selectedNotifications.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedNotifications.length} notification(s)?`)) {
      setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
      setSelectedNotifications([]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === currentNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(currentNotifications.map(notif => notif.id));
    }
  };

  const toggleSelectNotification = (id: string) => {
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
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Manage your notifications and stay updated</p>
      </div>

      {/* Stats and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-6 mb-4 lg:mb-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <div className="text-sm text-gray-500">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
              <div className="text-sm text-gray-500">Read</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark All as Read
            </button>
            
            <button
              onClick={deleteSelected}
              disabled={selectedNotifications.length === 0}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected ({selectedNotifications.length})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Notifications', count: notifications.length },
                { value: 'unread', label: 'Unread', count: unreadCount },
                { value: 'VOCAB_REMINDER', label: 'Vocabulary Reminders', count: notifications.filter(n => n.type === 'VOCAB_REMINDER').length },
                { value: 'STUDY_PROGRESS', label: 'Study Progress', count: notifications.filter(n => n.type === 'STUDY_PROGRESS').length },
                { value: 'ACHIEVEMENT', label: 'Achievements', count: notifications.filter(n => n.type === 'ACHIEVEMENT').length },
                { value: 'NEW_FEATURE', label: 'New Features', count: notifications.filter(n => n.type === 'NEW_FEATURE').length },
                { value: 'SYSTEM_ALERT', label: 'System Alerts', count: notifications.filter(n => n.type === 'SYSTEM_ALERT').length },
                { value: 'SECURITY_ALERT', label: 'Security', count: notifications.filter(n => n.type === 'SECURITY_ALERT').length },
                { value: 'MAINTENANCE', label: 'Maintenance', count: notifications.filter(n => n.type === 'MAINTENANCE').length },
                { value: 'PROMOTIONAL', label: 'Promotional', count: notifications.filter(n => n.type === 'PROMOTIONAL').length }
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
                    {filteredNotifications.length} notification(s) found
                  </span>
                </div>
                
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="divide-y divide-gray-200">
              {currentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 transition-colors ${
                    notification.is_read ? 'bg-white' : 'bg-blue-50'
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
                        notification.is_read ? 'bg-gray-100' : 'bg-blue-100'
                      }`}>
                        {getTypeIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`text-lg font-semibold ${
                            notification.is_read ? 'text-gray-900' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                              {notification.type.replace('_', ' ').toLowerCase()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {getTimeAgo(notification.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {notification.content}
                      </p>

                      <div className="flex items-center space-x-4">
                        {!notification.is_read ? (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Mark as Read
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsUnread(notification.id)}
                            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                          >
                            Mark as Unread
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {currentNotifications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔔</div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications found</h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? "You're all caught up! No notifications at the moment."
                    : `No ${filter === 'unread' ? 'unread' : filter.toLowerCase().replace('_', ' ')} notifications found.`
                  }
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredNotifications.length)} of {filteredNotifications.length} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 border text-sm rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;