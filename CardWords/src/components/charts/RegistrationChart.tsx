import React from 'react';
import { RegistrationChartData } from '../../types/dashboard';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Bell, 
  Clock, 
  Calendar,
  BarChart3,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';

interface RegistrationChartProps {
  data: RegistrationChartData | null;
  loading: boolean;
}

const RegistrationChart: React.FC<RegistrationChartProps> = ({ data, loading }) => {
  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-8 bg-gray-300 rounded w-56 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-40"></div>
            </div>
            <div className="h-12 bg-gray-300 rounded w-40"></div>
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-xl p-4 border-2 border-gray-300">
                <div className="h-8 bg-gray-300 rounded w-8 mx-auto mb-3"></div>
                <div className="h-8 bg-gray-300 rounded w-20 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
          
          {/* Chart Skeleton */}
          <div className="h-72 bg-gray-300 rounded-2xl mb-4 border-2 border-gray-400"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Tổng Users',
      value: data?.stats.totalUsers || 0,
      icon: Users,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
      trend: '+12%'
    },
    {
      label: 'Từ vựng',
      value: data?.stats.totalVocabs || 0,
      icon: BookOpen,
      color: 'text-purple-700',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-300',
      trend: '+8%'
    },
    {
      label: 'Thông báo',
      value: data?.stats.totalNotifications || 0,
      icon: Bell,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      trend: '+5%'
    },
    {
      label: 'Phiên học',
      value: data?.stats.totalLearningSession || 0,
      icon: Clock,
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-300',
      trend: '+15%'
    }
  ];

  
  const maxCount = Math.max(...(data?.userRegistrationChart?.map(item => item.count) || [0]));
  const chartData = data?.userRegistrationChart?.slice(-15) || [];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl flex items-center justify-center mr-4 border-2 border-blue-600">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 flex items-center">
                Biểu đồ Đăng ký & Thống kê
                <Sparkles className="w-5 h-5 ml-3 text-yellow-500" />
              </h3>
              <p className="text-sm font-medium text-gray-700 mt-2">30 ngày gần nhất • Cập nhật real-time</p>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm font-bold text-gray-700 bg-blue-100 px-4 py-3 rounded-xl border-2 border-blue-200">
          <Calendar className="w-5 h-5 mr-2 text-blue-700" />
          {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-xl p-5 text-center hover:shadow-lg transition-all duration-200 transform hover:-translate-y-2`}
          >
            <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 ${stat.borderColor}`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">{stat.value.toLocaleString()}</div>
            <div className="text-sm font-bold text-gray-700 mb-3">{stat.label}</div>
            <div className="flex items-center justify-center text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
              <TrendingUp className="w-4 h-4 mr-1" />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-black text-gray-900 flex items-center">
            <Target className="w-6 h-6 mr-3 text-blue-700" />
            Đăng ký theo ngày
          </h4>
          <div className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
            Tổng: <span className="text-blue-700">{chartData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}</span> lượt
          </div>
        </div>
        
        <div className="bg-gradient-to-b from-gray-100 to-white rounded-2xl p-6 border-2 border-gray-300">
          <div className="flex items-end justify-between h-56 space-x-2">
            {chartData.map((item, index) => {
              const height = maxCount > 0 ? (item.count / maxCount) * 90 : 0;
              const isToday = new Date(item.date).toDateString() === new Date().toDateString();
              const isPeak = item.count === maxCount;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 group relative">
                  <div
                    className={`w-full rounded-t-2xl transition-all duration-500 ease-out cursor-pointer group-hover:brightness-110 shadow-lg ${
                      isToday 
                        ? 'bg-gradient-to-t from-yellow-600 to-yellow-500' 
                        : isPeak
                        ? 'bg-gradient-to-t from-red-600 to-red-500'
                        : 'bg-gradient-to-t from-blue-700 to-blue-600'
                    }`}
                    style={{ height: `${height}%` }}
                    title={`${item.date}: ${item.count} người`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap border-2 border-yellow-400">
                        <Zap className="w-3 h-3 inline mr-1 text-yellow-400" />
                        {item.count} lượt
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold mt-3 ${
                    isToday ? 'text-yellow-700' : 
                    isPeak ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    {new Date(item.date).getDate()}/{new Date(item.date).getMonth() + 1}
                  </div>
                  {(isToday || isPeak) && (
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      isToday ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Chart Legend */}
          <div className="flex justify-center mt-6 space-x-8">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-t from-blue-700 to-blue-600 rounded mr-2 shadow-md"></div>
              <span className="text-sm font-bold text-gray-700">Ngày thường</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-t from-yellow-600 to-yellow-500 rounded mr-2 shadow-md"></div>
              <span className="text-sm font-bold text-gray-700">Hôm nay</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-t from-red-600 to-red-500 rounded mr-2 shadow-md"></div>
              <span className="text-sm font-bold text-gray-700">Cao nhất</span>
            </div>
          </div>
        </div>
      </div>

      {(!data?.userRegistrationChart || data.userRegistrationChart.length === 0) && (
        <div className="text-center py-16 text-gray-600 border-4 border-dashed border-gray-300 rounded-2xl my-8">
          <BarChart3 className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-black text-gray-500">Chưa có dữ liệu biểu đồ</p>
          <p className="text-sm font-medium text-gray-500 mt-2">Dữ liệu sẽ xuất hiện khi có người dùng đăng ký</p>
        </div>
      )}
    </div>
  );
};

export default RegistrationChart;