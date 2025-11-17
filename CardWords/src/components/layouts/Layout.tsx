// // import React, { useState, useEffect, ReactNode } from 'react';
// // import { Outlet } from 'react-router-dom';
// // import Header from './Header';
// // import Sidebar from './Sidebar';

// // interface LayoutProps {
// //   children?: ReactNode;
// // }

// // const Layout: React.FC<LayoutProps> = ({ children }) => {
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
// //   const [isMobile, setIsMobile] = useState(false);

// //   useEffect(() => {
// //     const handleResize = () => {
// //       if (window.innerWidth < 768) {
// //         setIsSidebarOpen(false);
// //         setIsMobile(true);
// //       } else {
// //         setIsSidebarOpen(true);
// //         setIsMobile(false);
// //       }
// //     };

// //     handleResize();
// //     window.addEventListener('resize', handleResize);
// //     return () => window.removeEventListener('resize', handleResize);
// //   }, []);

// //   return (
// //     <div className="h-screen flex flex-col bg-gray-50">
// //       <Header setIsSidebarOpen={setIsSidebarOpen} />

// //       <div className="flex flex-1 pt-[60px] relative">
// //         <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

// //         {/* Overlay trên mobile */}
// //         {isSidebarOpen && isMobile && (
// //           <div
// //             className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
// //             onClick={() => setIsSidebarOpen(false)}
// //           ></div>
// //         )}

// //         {/* Nội dung chính */}
// //         <main
// //           className={`flex-1 p-4 overflow-auto transition-all duration-300 ${
// //             !isMobile ? 'ml-64' : ''
// //           }`}
// //         >
// //           {children || <Outlet />}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Layout;

















// import React, { useState, useEffect, ReactNode } from 'react';
// import { Outlet } from 'react-router-dom';
// import Header from './Header';
// import Sidebar from './Sidebar';

// interface LayoutProps {
//   children?: ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setIsSidebarOpen(false);
//         setIsMobile(true);
//       } else {
//         setIsSidebarOpen(true);
//         setIsMobile(false);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
//       {/* Header */}
//       <Header setIsSidebarOpen={setIsSidebarOpen} />

//       <div className="flex flex-1 pt-16 relative overflow-hidden">
//         {/* Sidebar */}
//         <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

//         {/* Overlay cho mobile */}
//         {isSidebarOpen && isMobile && (
//           <div
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
//             onClick={() => setIsSidebarOpen(false)}
//           ></div>
//         )}

//         {/* Main Content */}
//         <main
//           className={`flex-1 overflow-auto transition-all duration-300 ${
//             !isMobile && isSidebarOpen ? 'md:ml-0' : ''
//           }`}
//         >
//           {/* Content Wrapper với animation */}
//           <div className="container mx-auto p-4 lg:p-6 animate-fade-in-up">
//             {/* Background decoration */}
//             <div className="fixed top-20 right-10 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -z-10"></div>
//             <div className="fixed bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-pink-200/30 rounded-full blur-3xl -z-10"></div>
            
//             {/* Content */}
//             <div className="relative z-10">
//               {children || <Outlet />}
//             </div>
//           </div>
//         </main>
//       </div>

//       <style>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }

//         .animate-fade-in-up {
//           animation: fade-in-up 0.5s ease-out;
//         }

//         /* Custom scrollbar */
//         ::-webkit-scrollbar {
//           width: 8px;
//           height: 8px;
//         }

//         ::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 10px;
//         }

//         ::-webkit-scrollbar-thumb {
//           background: linear-gradient(to bottom, #6366f1, #8b5cf6);
//           border-radius: 10px;
//         }

//         ::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(to bottom, #4f46e5, #7c3aed);
//         }

//         /* Smooth transitions */
//         * {
//           transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
//           transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
//           transition-duration: 150ms;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Layout;



















import React, { useState, useEffect, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
        setIsMobile(true);
      } else {
        setIsSidebarOpen(true);
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <Header setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex flex-1 pt-16 relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Overlay cho mobile */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content - Thêm margin-left khi sidebar mở trên desktop */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${
            !isMobile && isSidebarOpen ? 'ml-72' : 'ml-0'
          }`}
        >
          {/* Content Wrapper với animation */}
          <div className="container mx-auto p-4 lg:p-6 animate-fade-in-up">
            {/* Background decoration */}
            <div className="fixed top-20 right-10 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -z-10"></div>
            <div className="fixed bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-pink-200/30 rounded-full blur-3xl -z-10"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {children || <Outlet />}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }

        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </div>
  );
};

export default Layout;