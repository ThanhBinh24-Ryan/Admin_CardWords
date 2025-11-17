// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { HiX } from 'react-icons/hi';
// import './styles/Sidebar.css'
// interface SidebarProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
//   return (
//     <aside
//       className={`sidebar fixed md:static top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 z-50
//         ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
//     >
//       <div className="flex items-center justify-between p-4 border-b">
//         <span className="image-sidebar font-bold text-indigo-600 text-lg">CARDWORDS</span>
//         <button
//           className="md:hidden p-2 rounded hover:bg-gray-100"
//           onClick={() => setIsOpen(false)}
//         >
//           <HiX className="text-xl" />
//         </button>
//       </div>

//       <nav className="mt-4">
//         <ul className="flex flex-col space-y-1">
//           {[
//             { path: '/dashboard', label: 'Dashboard' },
//             { path: '/users', label: 'Users' },
//             { path: 'admin/vocabs', label: 'Vocabulary' },
//             { path: '/notifications', label: 'Notifications' },
//              { path: 'admin/games', label: 'Games' },
//             //  { path: '/notifications/settings', label: 'NotificationSetting' },
//             { path: '/logs', label: 'Logs' }
//           ].map((item) => (
//             <li key={item.path}>
//               <NavLink
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `block px-4 py-2 hover:bg-indigo-50 ${
//                     isActive ? 'text-indigo-600 font-semibold bg-indigo-50' : ''
//                   }`
//                 }
//                 onClick={() => {
//                   if (window.innerWidth < 768) setIsOpen(false);
//                 }}
//               >
//                 {item.label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;















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
  ChevronRight
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
    { path: '/logs', label: 'Nhật ký', icon: FileText, color: 'from-indigo-500 to-indigo-600' },
     { path: 'admin/Topics', label: 'Chủ đề', icon: FileText, color: 'from-indigo-500 to-indigo-600' },
      { path: 'admin/word-types', label: 'Loại', icon: FileText, color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`sidebar fixed md:static top-0 left-0 h-full w-72 bg-white transform transition-all duration-300 z-50 border-r border-gray-100
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
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

        {/* Navigation */}
        <nav className="mt-6 px-4">
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
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
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
                            : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:' + item.color + ' group-hover:text-white'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`font-semibold flex-1 ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-indigo-600'}`}>
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
        </nav>

        {/* Footer Info */}
        {/* <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Phiên bản</p>
                <p className="text-xs text-gray-500">v1.0.0 - Admin Panel</p>
              </div>
            </div>
          </div>
        </div> */}
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
      `}</style>
    </>
  );
};

export default Sidebar;