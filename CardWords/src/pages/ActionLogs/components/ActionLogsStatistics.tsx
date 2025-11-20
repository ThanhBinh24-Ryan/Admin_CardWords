import React from 'react';
import { ActionLogStatistics } from '../../../types/actionLog';
import { BarChart3, CheckCircle, XCircle, Users } from 'lucide-react';

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
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!statistics) return null;

  const stats = [
    {
      label: 'Tổng Hành động',
      value: statistics.totalActions.toLocaleString(),
      color: 'bg-blue-500',
      icon: BarChart3
    },
    {
      label: 'Thành công',
      value: statistics.successfulActions.toLocaleString(),
      color: 'bg-green-500',
      icon: CheckCircle
    },
    {
      label: 'Thất bại',
      value: statistics.failedActions.toLocaleString(),
      color: 'bg-red-500',
      icon: XCircle
    },
    {
      label: 'Người dùng Hoạt động',
      value: statistics.activeUsers.toLocaleString(),
      color: 'bg-purple-500',
      icon: Users
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionLogsStatistics;