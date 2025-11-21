import React from 'react';
import { ActionLogStatistics } from '../../../types/actionLog';
import { BarChart3, CheckCircle, XCircle, Users, TrendingUp, Activity } from 'lucide-react';

interface ActionLogsStatisticsProps {
  statistics: ActionLogStatistics | null;
  loading: boolean;
}

const ActionLogsStatistics: React.FC<ActionLogsStatisticsProps> = ({ 
  statistics, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="text-center text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Không có dữ liệu</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Đảm bảo tất cả các giá trị đều có giá trị mặc định nếu undefined
  const safeStatistics = {
    totalActions: statistics.totalActions || 0,
    successfulActions: statistics.successfulActions || 0,
    failedActions: statistics.failedActions || 0,
    activeUsers: statistics.activeUsers || 0
  };

  const stats = [
    {
      label: 'Tổng Hành động',
      value: safeStatistics.totalActions.toLocaleString(),
      color: 'from-blue-500 to-blue-600',
      icon: BarChart3,
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Thành công',
      value: safeStatistics.successfulActions.toLocaleString(),
      color: 'from-green-500 to-green-600',
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Thất bại',
      value: safeStatistics.failedActions.toLocaleString(),
      color: 'from-red-500 to-red-600',
      icon: XCircle,
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      textColor: 'text-red-600'
    },
    {
      label: 'Người dùng Hoạt động',
      value: safeStatistics.activeUsers.toLocaleString(),
      color: 'from-purple-500 to-purple-600',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="group">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
            
            {/* Progress bar indicator */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                  style={{ 
                    width: stat.label === 'Thành công' ? `${(safeStatistics.successfulActions / safeStatistics.totalActions) * 100}%` :
                           stat.label === 'Thất bại' ? `${(safeStatistics.failedActions / safeStatistics.totalActions) * 100}%` :
                           '100%' 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionLogsStatistics;