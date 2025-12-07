import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NoInternetPage: React.FC = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastChecked(new Date());
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setLastChecked(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Kiểm tra kết nối định kỳ
    const interval = setInterval(() => {
      setIsOnline(navigator.onLine);
      setLastChecked(new Date());
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleRetryConnection = () => {
    setRetryCount(prev => prev + 1);
    setLastChecked(new Date());
    setIsOnline(navigator.onLine);
    
    if (navigator.onLine) {
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleGoHome = () => {
    if (isOnline) {
      navigate('/dashboard');
    } else {
      alert('Vui lòng kiểm tra kết nối internet trước!');
    }
  };

  const handleGoBack = () => {
    if (isOnline) {
      navigate(-1);
    } else {
      alert('Vui lòng kiểm tra kết nối internet trước!');
    }
  };

  if (isOnline) {
    setTimeout(() => navigate(-1), 1500);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-green-200">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
            <div className="text-3xl">📶</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Đã kết nối lại!
          </h1>
          <p className="text-gray-600 mb-6">
            Kết nối internet của bạn đã được khôi phục. Đang chuyển hướng về trang trước...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-green-500 h-2 rounded-full" style={{ animation: 'progress 1.5s linear forwards' }}></div>
          </div>
          <p className="text-sm text-gray-500">
            Chuyển hướng tự động trong 1 giây...
          </p>
        </div>

        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-200 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Background Decoration */}
        <div className="relative mb-8">
          <div className="text-7xl font-bold text-gray-800 opacity-10 absolute inset-0 transform -translate-y-4">
            MẤT KẾT NỐI
          </div>
          
          {/* Animated Icon */}
          <div className="relative flex justify-center items-center mb-6">
            <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl">
              <div className="text-5xl">📴</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-gray-200">
          {/* Alert Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-full">
              <div className="w-6 h-6 text-red-600">⚠️</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Mất kết nối Internet
            </h1>
          </div>

          {/* Status Message */}
          <div className="space-y-4 mb-8">
            <p className="text-xl text-gray-700 font-medium">
              Không thể kết nối đến internet
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p className="text-lg font-semibold text-red-600 flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    Đang ngoại tuyến
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lần thử lại</p>
                  <p className="text-lg font-semibold text-blue-600">{retryCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kiểm tra lúc</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {lastChecked.toLocaleTimeString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mã sự cố</p>
                  <p className="text-lg font-semibold text-gray-800">NET-001</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600">
              Vui lòng kiểm tra:
            </p>
            
            <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Cáp mạng/Wi-Fi của bạn đã được kết nối chưa?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Bạn có đang ở trong vùng phủ sóng không?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Thử khởi động lại modem/router của bạn</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={handleRetryConnection}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <span className="mr-2">🔄</span>
              Thử lại kết nối
              {retryCount > 0 && (
                <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                  {retryCount}
                </span>
              )}
            </button>
            
            <button
              onClick={handleGoHome}
              className="px-8 py-4 bg-gray-100 text-gray-700 border-2 border-gray-300 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center hover:bg-gray-200"
            >
              <span className="mr-2">🏠</span>
              Về trang chủ
            </button>
            
            <button
              onClick={handleGoBack}
              className="px-8 py-4 bg-gray-100 text-gray-700 border-2 border-gray-300 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center hover:bg-gray-200"
            >
              <span className="mr-2">↩️</span>
              Quay lại
            </button>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm">Đang chờ kết nối internet...</span>
          </div>

          {/* Auto Retry Timer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Tự động thử lại sau: <span className="font-mono text-blue-600">10 giây</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ animation: 'autoRetry 10s linear infinite' }}></div>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div>🌐</div>
            <p className="text-sm">
              Cần hỗ trợ? Liên hệ bộ phận kỹ thuật
            </p>
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Hotline: <span className="font-semibold">1900 1234</span> (Miễn phí)</p>
            <p>Email: <span className="font-semibold">support@company.com</span></p>
          </div>
        </div>

        <style>{`
          @keyframes autoRetry {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default NoInternetPage;