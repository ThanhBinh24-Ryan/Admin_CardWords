import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Bell, 
  Gamepad2, 
  FileText,
  ChevronRight,
  FolderOpen,
  Tag,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { path: '/dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { path: '/users', label: 'Người dùng', icon: Users, color: 'from-purple-500 to-purple-600' },
    { path: '/admin/vocabs', label: 'Từ vựng', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { path: '/notifications', label: 'Thông báo', icon: Bell, color: 'from-yellow-500 to-orange-600' },
    { path: '/admin/games', label: 'Trò chơi', icon: Gamepad2, color: 'from-pink-500 to-rose-600' },
    { path: '/action-logs', label: 'Nhật ký', icon: FileText, color: 'from-indigo-500 to-indigo-600' },
    { path: '/admin/topics', label: 'Chủ đề', icon: FolderOpen, color: 'from-amber-500 to-amber-600' },
    { path: '/admin/word-types', label: 'Loại từ', icon: Tag, color: 'from-teal-500 to-teal-600' },
    { path: '/admin/vocab-progress', label: 'Tiến độ từ vựng', icon: BarChart3, color: 'from-cyan-500 to-cyan-600' },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`sidebar fixed md:static top-0 left-0 h-full w-72 bg-white transform transition-all duration-300 z-50 border-r border-gray-100 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CARDWORDS
            </span>
          </div>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4">
            <ul className="flex flex-col space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.path} style={{ animation: `slideIn 0.3s ease-out ${index * 0.05}s both` }}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden
                        ${isActive 
                          ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg transform scale-105' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md'
                        }`
                      }
                      onClick={() => {
                        if (window.innerWidth < 768) setIsOpen(false);
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`p-2 rounded-lg transition-all duration-200 ${
                            isActive 
                              ? 'bg-white/20' 
                              : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:' + item.color.split(' ')[0] + ' group-hover:' + item.color.split(' ')[1] + ' group-hover:text-white'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`font-semibold flex-1 ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                            {item.label}
                          </span>
                          {isActive && (
                            <ChevronRight className="w-5 h-5 animate-pulse" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Footer Info */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="p-4">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Phiên bản</p>
                  <p className="text-xs text-gray-500">v1.0.0 - Admin Panel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Custom scrollbar for sidebar */
        .sidebar nav {
          scrollbar-width: thin;
          scrollbar-color: #c7d2fe #f1f5f9;
        }
        
        .sidebar nav::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar nav::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .sidebar nav::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        
        .sidebar nav::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }
      `}</style>
    </>
  );
};

export default Sidebar;