// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const NotFoundPage: React.FC = () => {
//   const navigate = useNavigate();

//   const handleGoHome = () => {
//     navigate('/');
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
//       <div className="max-w-2xl w-full text-center">
//         {/* Animated 404 Number */}
//         <div className="relative mb-8">
//           <div className="text-9xl font-bold text-white opacity-10 absolute inset-0 transform -translate-y-4">
//             404
//           </div>
//           <div className="relative">
//             <span className="text-8xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
//               4
//             </span>
//             <span className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse inline-block mx-2">
//               0
//             </span>
//             <span className="text-8xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
//               4
//             </span>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="bg-black/40 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/10">
//           {/* Animated Icon */}
//           <div className="mb-6">
//             <div className="relative inline-block">
//               <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-4 mx-auto shadow-2xl floating">
//                 🚀
//               </div>
//               <div className="absolute -top-1 -right-1">
//                 <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-lg animate-pulse shadow-lg">
//                   ⚡
//                 </div>
//               </div>
//             </div>
//           </div>

//           <h1 className="text-4xl font-bold text-white mb-4">
//             Lost in Space?
//           </h1>
          
//           <p className="text-xl text-gray-300 mb-2">
//             This page has drifted off into the cosmic void.
//           </p>
          
//           <p className="text-gray-400 mb-8">
//             Don't panic! We'll help you navigate back to familiar territory.
//           </p>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
//             <button
//               onClick={handleGoHome}
//               className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center border border-cyan-400/20"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//               </svg>
//               Beam Me Home
//             </button>
            
//             <button
//               onClick={handleGoBack}
//               className="px-8 py-4 bg-white/10 text-white border-2 border-white/20 rounded-xl font-semibold shadow-2xl hover:shadow-white/10 transform hover:scale-105 transition-all duration-300 flex items-center justify-center hover:border-white/30 backdrop-blur-sm"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Previous Orbit
//             </button>
//           </div>

//           {/* Search Suggestion */}
//           <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
//             <h3 className="text-lg font-semibold text-white mb-3">
//               Mission Control Search
//             </h3>
//             <div className="flex max-w-md mx-auto">
//               <input
//                 type="text"
//                 placeholder="Scan the universe..."
//                 className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
//               />
//               <button className="px-6 bg-cyan-600 text-white rounded-r-xl hover:bg-cyan-700 transition-colors font-semibold border border-cyan-500/20">
//                 🔍 Search
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Helpful Links */}
//         <div className="bg-black/40 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/10">
//           <h3 className="text-lg font-semibold text-white mb-4">
//             Navigation Portals
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <a href="/dashboard" className="group">
//               <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-4 text-center hover:shadow-2xl transition-all duration-300 group-hover:transform group-hover:scale-105 border border-cyan-500/20 hover:border-cyan-500/40">
//                 <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white mx-auto mb-2 group-hover:bg-cyan-600 transition-colors shadow-lg">
//                   🌌
//                 </div>
//                 <span className="font-medium text-cyan-300">Dashboard</span>
//               </div>
//             </a>
            
//             <a href="/users" className="group">
//               <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-4 text-center hover:shadow-2xl transition-all duration-300 group-hover:transform group-hover:scale-105 border border-purple-500/20 hover:border-purple-500/40">
//                 <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-2 group-hover:bg-purple-600 transition-colors shadow-lg">
//                   👨‍🚀
//                 </div>
//                 <span className="font-medium text-purple-300">Crew</span>
//               </div>
//             </a>
            
//             <a href="/settings" className="group">
//               <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-4 text-center hover:shadow-2xl transition-all duration-300 group-hover:transform group-hover:scale-105 border border-green-500/20 hover:border-green-500/40">
//                 <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-2 group-hover:bg-green-600 transition-colors shadow-lg">
//                   🛰️
//                 </div>
//                 <span className="font-medium text-green-300">Systems</span>
//               </div>
//             </a>
//           </div>
//         </div>

//         {/* Animated Background Elements */}
//         <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
//         <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-400 rounded-full opacity-40 animate-bounce delay-1000"></div>
//         <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-70 animate-pulse delay-500"></div>
//         <div className="absolute bottom-1/4 right-1/3 w-5 h-5 bg-blue-400 rounded-full opacity-50 animate-bounce delay-1500"></div>

//         {/* Footer */}
//         <div className="mt-8 text-gray-400 text-sm">
//           <p>Signal lost? Contact mission control for assistance.</p>
//           <p className="mt-2">
//             <a href="/support" className="text-cyan-400 hover:text-cyan-300 underline">
//               🛰️ Contact Mission Control
//             </a>
//           </p>
//         </div>
//       </div>

//       {/* Background Animation */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(180deg); }
//         }
        
//         .floating {
//           animation: float 6s ease-in-out infinite;
//         }

//         /* Starfield background */
//         .starfield {
//           background-image: 
//             radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
//             radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
//             radial-gradient(1px 1px at 90px 40px, #ddd, rgba(0,0,0,0)),
//             radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
//             radial-gradient(2px 2px at 160px 30px, #eee, rgba(0,0,0,0));
//           background-repeat: repeat;
//           background-size: 200px 100px;
//           animation: stars 20s linear infinite;
//         }

//         @keyframes stars {
//           from { background-position: 0 0; }
//           to { background-position: -200px 100px; }
//         }
//       `}</style>
//       <div className="starfield absolute inset-0 opacity-30"></div>
//     </div>
//   );
// };

// export default NotFoundPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-800 opacity-10 absolute inset-0 transform -translate-y-4">
            404
          </div>
          <div className="relative">
            <span className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              4
            </span>
            <span className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce inline-block mx-2">
              0
            </span>
            <span className="text-8xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
              4
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
          {/* Animated Icon */}
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto shadow-lg">
                🔍
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm animate-pulse">
                  ❗
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            The page you're looking for seems to have vanished into the digital void.
          </p>
          
          <p className="text-gray-500 mb-8">
            Don't worry, even the best explorers get lost sometimes. Let's get you back on track!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleGoHome}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </button>
            
            <button
              onClick={handleGoBack}
              className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center hover:border-gray-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Can't find what you're looking for?
            </h3>
            <div className="flex max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search our website..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors font-semibold">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Quick Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="/dashboard" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:transform group-hover:scale-105 border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-2 group-hover:bg-blue-600 transition-colors">
                  📊
                </div>
                <span className="font-medium text-blue-700">Dashboard</span>
              </div>
            </a>
            
            <a href="/users" className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:transform group-hover:scale-105 border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-2 group-hover:bg-green-600 transition-colors">
                  👥
                </div>
                <span className="font-medium text-green-700">Users</span>
              </div>
            </a>
            
            <a href="/settings" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:transform group-hover:scale-105 border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-2 group-hover:bg-purple-600 transition-colors">
                  ⚙️
                </div>
                <span className="font-medium text-purple-700">Settings</span>
              </div>
            </a>
          </div>
        </div>

        {/* Floating Elements for Visual Interest */}
        <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-12 h-12 bg-blue-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-10 h-10 bg-green-400 rounded-full opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 right-10 w-6 h-6 bg-purple-400 rounded-full opacity-40 animate-bounce delay-500"></div>

        {/* Footer */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>If you believe this is an error, please contact our support team.</p>
          <p className="mt-2">
            <a href="/support" className="text-blue-600 hover:text-blue-800 underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;