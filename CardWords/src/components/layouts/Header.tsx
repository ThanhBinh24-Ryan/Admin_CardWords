// // import React, { useState, useRef, useEffect } from 'react';
// // import { HiMenu, HiBell, HiSearch, HiUser, HiCog, HiLogout, HiChevronDown } from 'react-icons/hi';

// // interface HeaderProps {
// //   setIsSidebarOpen: (isOpen: boolean) => void;
// // }

// // const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
// //   const [showNotifications, setShowNotifications] = useState(false);
// //   const [showUserMenu, setShowUserMenu] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const notificationRef = useRef<HTMLDivElement>(null);
// //   const userMenuRef = useRef<HTMLDivElement>(null);

// //   const [notifications] = useState([
// //     { id: 1, title: 'Người dùng mới đăng ký', time: '5 phút trước', unread: true },
// //     { id: 2, title: 'Yêu cầu đặt lại mật khẩu', time: '1 giờ trước', unread: true },
// //     { id: 3, title: 'Cập nhật hệ thống', time: '2 giờ trước', unread: false },
// //   ]);

// //   const unreadCount = notifications.filter(n => n.unread).length;

// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
// //         setShowNotifications(false);
// //       }
// //       if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
// //         setShowUserMenu(false);
// //       }
// //     };
// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => document.removeEventListener('mousedown', handleClickOutside);
// //   }, []);

// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (searchQuery.trim()) {
// //       console.log('Tìm kiếm:', searchQuery);
// //     }
// //   };

// //   return (
// //     <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
// //       <div className="flex justify-between items-center h-[60px] px-4">
// //         {/* Left */}
// //         <div className="flex items-center space-x-3">
// //           <button
// //             onClick={() => setIsSidebarOpen(true)}
// //             className="p-2 rounded-md hover:bg-gray-100 md:hidden"
// //             aria-label="Toggle sidebar"
// //           >
// //             <HiMenu className="text-2xl" />
// //           </button>
// //           <h1 className="header-wordcard text-xl font-bold text-indigo-600">CARDWORDS</h1>
// //         </div>

// //         {/* Center - search */}
// //         <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
// //           <div className="relative w-full">
// //             <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
// //             <input
// //               type="text"
// //               className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-200"
// //               placeholder="Tìm kiếm người dùng, từ vựng..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //             />
// //             {searchQuery && (
// //               <button
// //                 type="button"
// //                 onClick={() => setSearchQuery('')}
// //                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //               >
// //                 ×
// //               </button>
// //             )}
// //           </div>
// //         </form>

// //         {/* Right */}
// //         <div className="flex items-center space-x-4">
// //           {/* Notifications */}
// //           <div ref={notificationRef} className="relative">
// //             <button
// //               onClick={() => setShowNotifications(!showNotifications)}
// //               className="relative p-2 rounded-md hover:bg-gray-100"
// //             >
// //               <HiBell className="text-2xl" />
// //               {unreadCount > 0 && (
// //                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
// //                   {unreadCount}
// //                 </span>
// //               )}
// //             </button>
// //             {showNotifications && (
// //               <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border">
// //                 <div className="p-2 border-b font-semibold flex justify-between items-center">
// //                   <span>Thông báo</span>
// //                   <button className="text-sm text-indigo-600 hover:underline">Đánh dấu đã đọc</button>
// //                 </div>
// //                 <div className="max-h-60 overflow-y-auto">
// //                   {notifications.map((n) => (
// //                     <div key={n.id} className={`p-2 border-b ${n.unread ? 'bg-gray-50' : ''}`}>
// //                       <p className="font-medium text-sm">{n.title}</p>
// //                       <p className="text-xs text-gray-500">{n.time}</p>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 <div className="p-2 text-center">
// //                   <a href="/notifications" className="text-indigo-600 text-sm hover:underline">
// //                     Xem tất cả
// //                   </a>
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           {/* User */}
// //           <div ref={userMenuRef} className="relative">
// //             <button
// //               onClick={() => setShowUserMenu(!showUserMenu)}
// //               className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100"
// //             >
// //               <img
// //                 src="https://ui-avatars.com/api/?name=Admin+User&background=5b21b6&color=fff"
// //                 alt="Avatar"
// //                 className="w-8 h-8 rounded-full"
// //               />
// //               <span className="hidden md:block font-medium">Admin</span>
// //               <HiChevronDown className={`transition ${showUserMenu ? 'rotate-180' : ''}`} />
// //             </button>
// //             {showUserMenu && (
// //               <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border">
// //                 <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
// //                   <HiUser /> <span>Hồ sơ cá nhân</span>
// //                 </button>
// //                 <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
// //                   <HiCog /> <span>Cài đặt</span>
// //                 </button>
// //                 <hr />
// //                 <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center space-x-2">
// //                   <HiLogout /> <span>Đăng xuất</span>
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };

// // export default Header;
// // components/HeaderWithNavigation.tsx
// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { HiMenu, HiBell, HiSearch, HiUser, HiCog, HiLogout, HiChevronDown, HiKey, HiClipboardList } from 'react-icons/hi';

// interface HeaderProps {
//   setIsSidebarOpen: (isOpen: boolean) => void;
// }

// const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
//   const navigate = useNavigate();
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const notificationRef = useRef<HTMLDivElement>(null);
//   const userMenuRef = useRef<HTMLDivElement>(null);

//   // ==================== NAVIGATION FUNCTIONS ====================
//   const navigation = {
//     // Dashboard & Main Pages
//     toDashboard: () => navigate('/dashboard'),
//     toUserManagement: () => navigate('/users'),
//     toWordManagement: () => navigate('/words'),
    
//     // Search
//     searchUsers: (query: string) => navigate(`/users?search=${encodeURIComponent(query)}`),
//     searchWords: (query: string) => navigate(`/words?search=${encodeURIComponent(query)}`),
//     globalSearch: (query: string) => navigate(`/search?q=${encodeURIComponent(query)}`),
    
//     // Notifications
//     toNotifications: () => navigate('/notifications'),
//     viewNotification: (notificationId: string) => navigate(`/notifications/${notificationId}`),
//     navigateFromNotification: (type: string, targetId: string) => {
//       const routes: { [key: string]: string } = {
//         'user_registered': `/users/${targetId}`,
//         'password_reset': `/users/${targetId}/security`,
//         'system_update': '/system/updates',
//         'new_word': `/words/${targetId}`,
//         'user_report': `/reports/users/${targetId}`
//       };
//       if (routes[type]) {
//         navigate(routes[type]);
//       }
//     },
    
//     // User Menu
//     toProfile: () => navigate('/profile'),
//     toSettings: () => navigate('/settings'),
//     toChangePassword: () => navigate('/profile/change-password'),
//     toActivityLogs: () => navigate('/profile/activity-logs'),
//     logout: () => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       navigate('/login');
//     }
//   };

//   const [notifications] = useState([
//     { 
//       id: 1, 
//       title: 'Người dùng mới đăng ký', 
//       time: '5 phút trước', 
//       unread: true,
//       type: 'user_registered',
//       targetId: 'user123'
//     },
//     { 
//       id: 2, 
//       title: 'Yêu cầu đặt lại mật khẩu', 
//       time: '1 giờ trước', 
//       unread: true,
//       type: 'password_reset',
//       targetId: 'user456'
//     },
//     { 
//       id: 3, 
//       title: 'Cập nhật hệ thống', 
//       time: '2 giờ trước', 
//       unread: false,
//       type: 'system_update',
//       targetId: 'update001'
//     },
//   ]);

//   const unreadCount = notifications.filter(n => n.unread).length;

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
//         setShowNotifications(false);
//       }
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
//         setShowUserMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // ==================== SEARCH HANDLERS ====================
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigation.globalSearch(searchQuery);
//       setSearchQuery('');
//     }
//   };

//   const handleQuickSearch = (type: 'users' | 'words') => {
//     if (searchQuery.trim()) {
//       if (type === 'users') {
//         navigation.searchUsers(searchQuery);
//       } else {
//         navigation.searchWords(searchQuery);
//       }
//       setSearchQuery('');
//     }
//   };

//   // ==================== NOTIFICATION HANDLERS ====================
//   const handleNotificationClick = (notification: any) => {
//     navigation.navigateFromNotification(notification.type, notification.targetId);
//     setShowNotifications(false);
//   };

//   const handleMarkAllAsRead = () => {
//     // Gọi API đánh dấu đã đọc
//     console.log('Mark all notifications as read');
//     setShowNotifications(false);
//   };

//   // ==================== USER MENU HANDLERS ====================
//   const handleUserMenuAction = (action: string) => {
//     switch (action) {
//       case 'profile':
//         navigation.toProfile();
//         break;
//       case 'settings':
//         navigation.toSettings();
//         break;
//       case 'change-password':
//         navigation.toChangePassword();
//         break;
//       case 'activity-logs':
//         navigation.toActivityLogs();
//         break;
//       case 'logout':
//         navigation.logout();
//         break;
//     }
//     setShowUserMenu(false);
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
//       <div className="flex justify-between items-center h-[60px] px-4">
//         {/* Left */}
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="p-2 rounded-md hover:bg-gray-100 md:hidden"
//             aria-label="Toggle sidebar"
//           >
//             <HiMenu className="text-2xl" />
//           </button>
//           <button 
//             onClick={navigation.toDashboard}
//             className="header-wordcard text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
//           >
//             CARDWORDS
//           </button>
//         </div>

//         {/* Center - Search với navigation */}
//         <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
//           <div className="relative w-full">
//             <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               className="w-full pl-10 pr-24 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-200"
//               placeholder="Tìm kiếm người dùng, từ vựng..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
            
//             {/* Quick search buttons */}
//             {searchQuery && (
//               <div className="absolute right-1 top-1/2 -translate-y-1/2 flex space-x-1">
//                 <button
//                   type="button"
//                   onClick={() => handleQuickSearch('users')}
//                   className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
//                 >
//                   Tìm user
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleQuickSearch('words')}
//                   className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
//                 >
//                   Tìm từ
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setSearchQuery('')}
//                   className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
//                 >
//                   ×
//                 </button>
//               </div>
//             )}
//           </div>
//         </form>

//         {/* Right */}
//         <div className="flex items-center space-x-4">
//           {/* Notifications với navigation */}
//           <div ref={notificationRef} className="relative">
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="relative p-2 rounded-md hover:bg-gray-100"
//             >
//               <HiBell className="text-2xl" />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>
            
//             {showNotifications && (
//               <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md border">
//                 <div className="p-3 border-b font-semibold flex justify-between items-center">
//                   <span>Thông báo ({unreadCount} mới)</span>
//                   <button 
//                     onClick={handleMarkAllAsRead}
//                     className="text-sm text-indigo-600 hover:underline"
//                   >
//                     Đánh dấu đã đọc
//                   </button>
//                 </div>
                
//                 <div className="max-h-60 overflow-y-auto">
//                   {notifications.map((notification) => (
//                     <div 
//                       key={notification.id} 
//                       className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
//                         notification.unread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
//                       }`}
//                       onClick={() => handleNotificationClick(notification)}
//                     >
//                       <p className="font-medium text-sm">{notification.title}</p>
//                       <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
//                       {notification.unread && (
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="p-3 text-center border-t">
//                   <button 
//                     onClick={() => {
//                       navigation.toNotifications();
//                       setShowNotifications(false);
//                     }}
//                     className="text-indigo-600 text-sm hover:underline font-medium"
//                   >
//                     Xem tất cả thông báo
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* User Menu với navigation */}
//           <div ref={userMenuRef} className="relative">
//             <button
//               onClick={() => setShowUserMenu(!showUserMenu)}
//               className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
//             >
//               <img
//                 src="https://ui-avatars.com/api/?name=Admin+User&background=5b21b6&color=fff"
//                 alt="Avatar"
//                 className="w-8 h-8 rounded-full"
//               />
//               <span className="hidden md:block font-medium">Admin</span>
//               <HiChevronDown className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
//             </button>
            
//             {showUserMenu && (
//               <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border py-1">
//                 <div className="px-4 py-2 border-b">
//                   <p className="font-semibold">Admin User</p>
//                   <p className="text-sm text-gray-500">admin@cardwords.com</p>
//                 </div>
                
//                 <button 
//                   onClick={() => handleUserMenuAction('profile')}
//                   className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3"
//                 >
//                   <HiUser className="text-gray-500" />
//                   <span>Hồ sơ cá nhân</span>
//                 </button>
                
//                 <button 
//                   onClick={() => handleUserMenuAction('settings')}
//                   className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3"
//                 >
//                   <HiCog className="text-gray-500" />
//                   <span>Cài đặt hệ thống</span>
//                 </button>
                
//                 <button 
//                   onClick={() => handleUserMenuAction('change-password')}
//                   className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3"
//                 >
//                   <HiKey className="text-gray-500" />
//                   <span>Đổi mật khẩu</span>
//                 </button>
                
//                 <button 
//                   onClick={() => handleUserMenuAction('activity-logs')}
//                   className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3"
//                 >
//                   <HiClipboardList className="text-gray-500" />
//                   <span>Nhật ký hoạt động</span>
//                 </button>
                
//                 <hr className="my-1" />
                
//                 <button 
//                   onClick={() => handleUserMenuAction('logout')}
//                   className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-3"
//                 >
//                   <HiLogout />
//                   <span>Đăng xuất</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;



















import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Bell, Search, User, Settings, LogOut, ChevronDown, 
  Key, ClipboardList, X
} from 'lucide-react';

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigation = {
    toDashboard: () => navigate('/dashboard'),
    toUserManagement: () => navigate('/users'),
    toWordManagement: () => navigate('/words'),
    searchUsers: (query: string) => navigate(`/users?search=${encodeURIComponent(query)}`),
    searchWords: (query: string) => navigate(`/words?search=${encodeURIComponent(query)}`),
    globalSearch: (query: string) => navigate(`/search?q=${encodeURIComponent(query)}`),
    toNotifications: () => navigate('/notifications'),
    viewNotification: (notificationId: string) => navigate(`/notifications/${notificationId}`),
    navigateFromNotification: (type: string, targetId: string) => {
      const routes: { [key: string]: string } = {
        'user_registered': `/users/${targetId}`,
        'password_reset': `/users/${targetId}/security`,
        'system_update': '/system/updates',
        'new_word': `/words/${targetId}`,
        'user_report': `/reports/users/${targetId}`
      };
      if (routes[type]) navigate(routes[type]);
    },
    toProfile: () => navigate('/profile'),
    toSettings: () => navigate('/settings'),
    toChangePassword: () => navigate('/profile/change-password'),
    toActivityLogs: () => navigate('/profile/activity-logs'),
    logout: () => {
      if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const [notifications] = useState([
    { 
      id: 1, 
      title: 'Người dùng mới đăng ký', 
      time: '5 phút trước', 
      unread: true,
      type: 'user_registered',
      targetId: 'user123'
    },
    { 
      id: 2, 
      title: 'Yêu cầu đặt lại mật khẩu', 
      time: '1 giờ trước', 
      unread: true,
      type: 'password_reset',
      targetId: 'user456'
    },
    { 
      id: 3, 
      title: 'Cập nhật hệ thống', 
      time: '2 giờ trước', 
      unread: false,
      type: 'system_update',
      targetId: 'update001'
    },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigation.globalSearch(searchQuery);
      setSearchQuery('');
    }
  };

  const handleQuickSearch = (type: 'users' | 'words') => {
    if (searchQuery.trim()) {
      if (type === 'users') {
        navigation.searchUsers(searchQuery);
      } else {
        navigation.searchWords(searchQuery);
      }
      setSearchQuery('');
    }
  };

  const handleNotificationClick = (notification: any) => {
    navigation.navigateFromNotification(notification.type, notification.targetId);
    setShowNotifications(false);
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all notifications as read');
    setShowNotifications(false);
  };

  const handleUserMenuAction = (action: string) => {
    switch (action) {
      case 'profile':
        navigation.toProfile();
        break;
      case 'settings':
        navigation.toSettings();
        break;
      case 'change-password':
        navigation.toChangePassword();
        break;
      case 'activity-logs':
        navigation.toActivityLogs();
        break;
      case 'logout':
        navigation.logout();
        break;
    }
    setShowUserMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="flex justify-between items-center h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 md:hidden transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <button 
            onClick={navigation.toDashboard}
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              CARDWORDS
            </span>
          </button>
        </div>

        {/* Center - Search */}
        {/* <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-6">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-12 pr-32 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Tìm kiếm người dùng, từ vựng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {searchQuery && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                <button
                  type="button"
                  onClick={() => handleQuickSearch('users')}
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-200 flex items-center space-x-1"
                >
                  <User className="w-3 h-3" />
                  <span>User</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSearch('words')}
                  className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center space-x-1"
                >
                  <span>Từ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </form> */}

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
            >
              <Bell className="w-6 h-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-fade-in">
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">Thông báo</h3>
                      <p className="text-xs text-indigo-100">{unreadCount} thông báo mới</p>
                    </div>
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm"
                    >
                      Đánh dấu đã đọc
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 ${
                        notification.unread ? 'bg-blue-50 border-l-4 border-l-indigo-500' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 text-center border-t bg-gray-50">
                  <button 
                    onClick={() => {
                      navigation.toNotifications();
                      setShowNotifications(false);
                    }}
                    className="text-indigo-600 text-sm hover:text-indigo-800 font-semibold transition-colors"
                  >
                    Xem tất cả thông báo →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 pl-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
            >
              <img
                src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"
                alt="Avatar"
                className="w-9 h-9 rounded-full ring-2 ring-white group-hover:ring-indigo-200 transition-all duration-200"
              />
              <span className="hidden lg:block font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">Admin</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-fade-in">
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <p className="font-bold text-lg">Admin User</p>
                  <p className="text-sm text-indigo-100 mt-0.5">admin@cardwords.com</p>
                </div>
                
                <div className="py-2">
                  <button 
                    onClick={() => handleUserMenuAction('profile')}
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 flex items-center space-x-3 transition-all duration-200 group"
                  >
                    <User className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Hồ sơ cá nhân</span>
                  </button>
                  
                  <button 
                    onClick={() => handleUserMenuAction('settings')}
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 flex items-center space-x-3 transition-all duration-200 group"
                  >
                    <Settings className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Cài đặt hệ thống</span>
                  </button>
                  
                  <button 
                    onClick={() => handleUserMenuAction('change-password')}
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 flex items-center space-x-3 transition-all duration-200 group"
                  >
                    <Key className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Đổi mật khẩu</span>
                  </button>
                  
                  <button 
                    onClick={() => handleUserMenuAction('activity-logs')}
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 flex items-center space-x-3 transition-all duration-200 group"
                  >
                    <ClipboardList className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Nhật ký hoạt động</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-200 p-2">
                  <button 
                    onClick={() => handleUserMenuAction('logout')}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-3 transition-all duration-200 group"
                  >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;