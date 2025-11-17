// import React from "react";
// import {
//   Home,
//   Users,
//   Settings,
//   BookOpen,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { NavLink } from "react-router-dom";

// const Sidebar = ({ isOpen, setIsOpen }) => {
//   const menu = [
//     { name: "Dashboard", path: "/admin", icon: <Home size={18} /> },
//     { name: "Người dùng", path: "/admin/users", icon: <Users size={18} /> },
//     { name: "Từ vựng", path: "/admin/words", icon: <BookOpen size={18} /> },
//     { name: "Cài đặt", path: "/admin/settings", icon: <Settings size={18} /> },
//   ];

//   return (
//     <aside
//       className={`fixed md:relative z-50 bg-white h-full shadow-md border-r transform transition-transform duration-300 ${
//         isOpen ? "translate-x-0 w-64" : "-translate-x-full md:w-20"
//       }`}
//     >
//       <div className="flex items-center justify-between px-4 py-3 border-b">
//         <div className="flex items-center gap-2">
//           <img
//             src="/assets/logo-cardwords.png" // bạn thêm ảnh logo ở đây
//             alt="CardWords Logo"
//             className="w-8 h-8"
//           />
//           {isOpen && (
//             <span className="font-semibold text-lg text-indigo-600">
//               CardWords
//             </span>
//           )}
//         </div>
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="hidden md:flex p-1 rounded hover:bg-gray-100"
//         >
//           {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
//         </button>
//       </div>

//       <nav className="p-3">
//         {menu.map((item, idx) => (
//           <NavLink
//             key={idx}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
//                 isActive
//                   ? "bg-indigo-50 text-indigo-600"
//                   : "text-gray-700 hover:bg-gray-50"
//               }`
//             }
//           >
//             {item.icon}
//             {isOpen && <span>{item.name}</span>}
//           </NavLink>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
