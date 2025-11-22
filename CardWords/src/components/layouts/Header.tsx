import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Bell, Search, User, Settings, LogOut, ChevronDown, 
  Key, ClipboardList, X,
  Loader2
} from 'lucide-react';
import { useProfileStore } from '../../store/ProfileStore'; // Điều chỉnh đường dẫn theo project của bạn

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sử dụng store profile
  const {
    profile,
    loading,
    fetchProfile
  } = useProfileStore();

  const navigation = {
    toDashboard: () => navigate('/dashboard'),
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

  useEffect(() => {
    // Load profile khi component mount
    loadProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProfile = async () => {
    try {
      await fetchProfile();
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
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

  // Lấy avatar URL hoặc fallback
  const getAvatarUrl = () => {
    if (profile?.avatar) {
      return profile.avatar;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=6366f1&color=fff`;
  };

  // Lời chào theo thời gian trong ngày
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
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

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Lời chào và tên người dùng */}
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm text-gray-600 font-medium">
              {getGreeting()}
            </span>
            <span className="text-base font-semibold text-gray-800">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin inline" />
              ) : (
                profile?.name || 'Người dùng'
              )}
            </span>
          </div>

          {/* User Menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 pl-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
            >
              {loading ? (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                </div>
              ) : (
                <img
                  src={getAvatarUrl()}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full ring-2 ring-white group-hover:ring-indigo-200 transition-all duration-200 object-cover"
                />
              )}
              <span className="hidden lg:block font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
                {loading ? 'Loading...' : profile?.name || 'User'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-fade-in">
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <p className="font-bold text-lg truncate">
                    {profile?.name || 'Người dùng'}
                  </p>
                  <p className="text-sm text-indigo-100 mt-0.5 truncate">
                    {profile?.email || 'Chưa có email'}
                  </p>
                  {profile?.currentLevel && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                        {profile.currentLevel}
                      </span>
                    </div>
                  )}
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