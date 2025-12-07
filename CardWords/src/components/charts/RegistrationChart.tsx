import React, { useState } from 'react';
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
  Zap,
  LineChart
} from 'lucide-react';

interface RegistrationChartProps {
  data: RegistrationChartData | null;
  loading: boolean;
}

const RegistrationChart: React.FC<RegistrationChartProps> = ({ data, loading }) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    date: string;
    count: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    date: '',
    count: 0
  });

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
  const minCount = Math.min(...(data?.userRegistrationChart?.map(item => item.count) || [0]));
  const chartData = data?.userRegistrationChart?.slice(-15) || [];
  
  // Tính toán giá trị cho grid lines
  const gridLines = 5;
  const gridValues = Array.from({ length: gridLines }, (_, i) => {
    return Math.round((maxCount / (gridLines - 1)) * i);
  });

  const handlePointHover = (event: React.MouseEvent, item: { date: string; count: number }, index: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const parentRect = event.currentTarget.closest('.relative')?.getBoundingClientRect();
    
    if (parentRect) {
      setTooltip({
        visible: true,
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 50,
        date: item.date,
        count: item.count
      });
    }
  };

  const handlePointLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleAreaHover = (event: React.MouseEvent, index: number) => {
    const item = chartData[index];
    if (!item) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const parentRect = event.currentTarget.closest('.relative')?.getBoundingClientRect();
    
    if (parentRect) {
      setTooltip({
        visible: true,
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 50,
        date: item.date,
        count: item.count
      });
    }
  };
  
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

      {/* Line Chart */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-black text-gray-900 flex items-center">
            <LineChart className="w-6 h-6 mr-3 text-blue-700" />
            Biểu đồ Đăng ký theo ngày
          </h4>
          <div className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
            Tổng: <span className="text-blue-700">{chartData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}</span> lượt
          </div>
        </div>
        
        <div className="bg-gradient-to-b from-gray-100 to-white rounded-2xl p-6 border-2 border-gray-300">
          <div className="relative h-64">
            {/* Tooltip */}
            {tooltip.visible && (
              <div 
                className="absolute z-50 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg border-2 border-yellow-400 shadow-xl transform -translate-x-1/2 -translate-y-full"
                style={{ 
                  left: `${tooltip.x}px`, 
                  top: `${tooltip.y}px`,
                  minWidth: '120px'
                }}
              >
                <div className="flex items-center mb-1">
                  <Zap className="w-3 h-3 mr-1 text-yellow-400" />
                  <span className="text-yellow-300 font-black">{tooltip.count} lượt</span>
                </div>
                <div className="text-gray-300 text-[10px] font-medium">
                  {new Date(tooltip.date).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r-2 border-b-2 border-yellow-400"></div>
              </div>
            )}

            {/* Y-axis grid lines and labels */}
            <div className="absolute inset-0 flex flex-col justify-between pb-10 pr-10">
              {gridValues.map((value, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-8 -top-2 text-xs font-bold text-gray-500 w-8 text-right">
                    {value.toLocaleString()}
                  </div>
                  <div className="border-t border-gray-300 border-dashed"></div>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div className="absolute inset-0 pl-8 pb-10">
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${chartData.length * 60} 180`}
                preserveAspectRatio="none"
                className="overflow-visible"
              >
                {/* Gradient fill under the line */}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Hover areas for each data point */}
                {chartData.map((item, index) => {
                  const x = index * 60 + 30;
                  const y = 180 - ((item.count - minCount) / (maxCount - minCount || 1)) * 160;
                  
                  return (
                    <g key={`hover-area-${index}`}>
                      {/* Invisible hover area */}
                      <rect
                        x={x - 30}
                        y="0"
                        width="60"
                        height="180"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={(e) => {
                          const syntheticEvent = e as unknown as React.MouseEvent;
                          handleAreaHover(syntheticEvent, index);
                        }}
                        onMouseLeave={handlePointLeave}
                      />
                    </g>
                  );
                })}

                {/* Data points and line */}
                {chartData.map((item, index) => {
                  const x = index * 60 + 30;
                  const y = 180 - ((item.count - minCount) / (maxCount - minCount || 1)) * 160;
                  const isToday = new Date(item.date).toDateString() === new Date().toDateString();
                  const isPeak = item.count === maxCount;
                  const prevItem = chartData[index - 1];
                  
                  // Draw line to previous point
                  if (prevItem) {
                    const prevX = (index - 1) * 60 + 30;
                    const prevY = 180 - ((prevItem.count - minCount) / (maxCount - minCount || 1)) * 160;
                    
                    return (
                      <g key={`line-${index}`}>
                        {/* Smooth line */}
                        <path
                          d={`M ${prevX} ${prevY} L ${x} ${y}`}
                          stroke={isToday ? "#eab308" : isPeak ? "#ef4444" : "#3b82f6"}
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          className="transition-all duration-300"
                        />
                        
                        {/* Data point */}
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill={isToday ? "#fbbf24" : isPeak ? "#f87171" : "#60a5fa"}
                          stroke="white"
                          strokeWidth="2"
                          className="cursor-pointer transition-all duration-300 hover:r-7"
                          onMouseEnter={(e) => handlePointHover(e, item, index)}
                          onMouseLeave={handlePointLeave}
                        />
                      </g>
                    );
                  }
                  
                  // First point
                  return (
                    <circle
                      key={`point-${index}`}
                      cx={x}
                      cy={y}
                      r="5"
                      fill={isToday ? "#fbbf24" : isPeak ? "#f87171" : "#60a5fa"}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-300 hover:r-7"
                      onMouseEnter={(e) => handlePointHover(e, item, index)}
                      onMouseLeave={handlePointLeave}
                    />
                  );
                })}

                {/* Fill under the line */}
                {chartData.length > 1 && (
                  <path
                    d={`M 30 ${180 - ((chartData[0].count - minCount) / (maxCount - minCount || 1)) * 160} ${
                      chartData.map((item, index) => 
                        `L ${index * 60 + 30} ${180 - ((item.count - minCount) / (maxCount - minCount || 1)) * 160}`
                      ).join(' ')
                    } L ${(chartData.length - 1) * 60 + 30} 180 L 30 180 Z`}
                    fill="url(#lineGradient)"
                    className="cursor-pointer"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parentRect = e.currentTarget.closest('.relative')?.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const index = Math.floor((x / rect.width) * chartData.length);
                      const item = chartData[Math.min(index, chartData.length - 1)];
                      
                      if (item && parentRect) {
                        setTooltip({
                          visible: true,
                          x: x,
                          y: rect.top - parentRect.top - 50,
                          date: item.date,
                          count: item.count
                        });
                      }
                    }}
                    onMouseLeave={handlePointLeave}
                  />
                )}
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-between pl-8 pr-2">
              {chartData.map((item, index) => {
                const isToday = new Date(item.date).toDateString() === new Date().toDateString();
                const isPeak = item.count === maxCount;
                
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center relative"
                    style={{ width: `${100 / chartData.length}%` }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parentRect = e.currentTarget.closest('.relative')?.getBoundingClientRect();
                      
                      if (parentRect) {
                        setTooltip({
                          visible: true,
                          x: rect.left - parentRect.left + rect.width / 2,
                          y: rect.top - parentRect.top - 50,
                          date: item.date,
                          count: item.count
                        });
                      }
                    }}
                    onMouseLeave={handlePointLeave}
                  >
                    <div className={`text-xs font-bold ${
                      isToday ? 'text-yellow-700' : 
                      isPeak ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      {new Date(item.date).getDate()}/{new Date(item.date).getMonth() + 1}
                    </div>
                    {(isToday || isPeak) && (
                      <div className={`w-2 h-2 rounded-full mt-1 ${
                        isToday ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Chart Legend */}
          <div className="flex justify-center mt-8 space-x-8">
            <div className="flex items-center">
              <div className="w-4 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded mr-2 shadow-md"></div>
              <span className="text-sm font-bold text-gray-700">Ngày thường</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded mr-2 shadow-md"></div>
              <span className="text-sm font-bold text-gray-700">Hôm nay</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded mr-2 shadow-md"></div>
              <span className="text-sm font-bold text-gray-700">Cao nhất</span>
            </div>
          </div>

          {/* Guide text */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 font-medium">
              <span className="inline-flex items-center">
                <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                Hover vào bất kỳ điểm nào trên biểu đồ để xem chi tiết
              </span>
            </p>
          </div>
        </div>
      </div>

      {(!data?.userRegistrationChart || data.userRegistrationChart.length === 0) && (
        <div className="text-center py-16 text-gray-600 border-4 border-dashed border-gray-300 rounded-2xl my-8">
          <LineChart className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-black text-gray-500">Chưa có dữ liệu biểu đồ</p>
          <p className="text-sm font-medium text-gray-500 mt-2">Dữ liệu sẽ xuất hiện khi có người dùng đăng ký</p>
        </div>
      )}
    </div>
  );
};

export default RegistrationChart;