import React from 'react';
import { UserStatistics as UserStatsType } from '../../types/dashboard';
import { Users, UserCheck, UserX, Shield, User, PieChart } from 'lucide-react';

interface UserStatisticsProps {
  data: UserStatsType | null;
  loading: boolean;
}

const UserStatistics: React.FC<UserStatisticsProps> = ({ data, loading }) => {
  if (loading && !data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-6"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Tổng Users',
      value: data?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Tổng số tài khoản'
    },
    {
      label: 'Đã kích hoạt',
      value: data?.activatedUsers || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Tài khoản đã kích hoạt'
    },
    {
      label: 'Đã khóa',
      value: data?.bannedUsers || 0,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Tài khoản bị khóa'
    },
    {
      label: 'Admin',
      value: data?.adminUsers || 0,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Quản trị viên'
    },
    {
      label: 'User thường',
      value: data?.normalUsers || 0,
      icon: User,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      description: 'Người dùng thường'
    }
  ];

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-purple-600" />
            Thống kê Người dùng
          </h3>
          <p className="text-sm text-gray-600">Phân loại người dùng</p>
        </div>
      </div>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{stat.value.toLocaleString()}</div>
              <div className="text-xs text-gray-500">
                {calculatePercentage(stat.value, data?.totalUsers || 1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {data && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{data.activatedUsers}</div>
              <div className="text-xs text-gray-500">Đã kích hoạt</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{data.bannedUsers}</div>
              <div className="text-xs text-gray-500">Đã khóa</div>
            </div>
          </div>
        </div>
      )}

      {!data && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Chưa có dữ liệu thống kê</p>
        </div>
      )}
    </div>
  );
};

export default UserStatistics;