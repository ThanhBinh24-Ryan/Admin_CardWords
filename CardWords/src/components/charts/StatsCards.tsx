import React from 'react';
import { SystemOverview, UserStatistics } from '../../types/dashboard';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Folder, 
  GamepadIcon, 
  Target, 
  Award, 
  Book, 
  Zap, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface StatsCardsProps {
  systemOverview: SystemOverview | null;
  userStatistics: UserStatistics | null;
  loading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ systemOverview, userStatistics, loading }) => {
  const stats = [
    {
      title: 'Tổng Người dùng',
      value: systemOverview?.totalUsers || userStatistics?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-700 to-blue-800',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-700',
      description: 'Tổng số tài khoản',
      trend: '+12%'
    },
    {
      title: 'Hoạt động Hôm nay',
      value: systemOverview?.activeUsersToday || 0,
      icon: UserCheck,
      color: 'from-green-700 to-green-800',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-700',
      description: 'Người dùng hoạt động',
      trend: '+5%'
    },
    {
      title: 'Từ vựng',
      value: systemOverview?.totalVocabs || 0,
      icon: BookOpen,
      color: 'from-purple-700 to-purple-800',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-700',
      description: 'Tổng số từ vựng',
      trend: '+8%'
    },
    {
      title: 'Chủ đề',
      value: systemOverview?.totalTopics || 0,
      icon: Folder,
      color: 'from-orange-700 to-orange-800',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-700',
      description: 'Tổng số chủ đề',
      trend: '+3%'
    },
    {
      title: 'Phiên Game',
      value: systemOverview?.totalGameSessions || 0,
      icon: GamepadIcon,
      color: 'from-red-700 to-red-800',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-700',
      description: 'Tổng số phiên chơi',
      trend: '+15%'
    },
    {
      title: 'Điểm TB',
      value: systemOverview?.averageScore || 0,
      icon: Target,
      color: 'from-indigo-700 to-indigo-800',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-700',
      description: 'Điểm trung bình',
      isDecimal: true,
      trend: '+2%'
    },
    {
      title: 'Điểm Cao nhất',
      value: systemOverview?.highestScore || 0,
      icon: Award,
      color: 'from-yellow-600 to-yellow-700',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-700',
      description: 'Điểm số cao nhất',
      isDecimal: true,
      trend: '+7%'
    },
    // {
    //   title: 'Từ đã Học',
    //   value: systemOverview?.totalWordsLearned || 0,
    //   icon: Book,
    //   color: 'from-teal-700 to-teal-800',
    //   bgColor: 'bg-teal-100',
    //   iconColor: 'text-teal-700',
    //   description: 'Tổng số từ đã học',
    //   trend: '+10%'
    // }
  ];

  if (loading && !systemOverview) {
    return (
      <>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse hover:shadow-xl transition-all duration-300 border-2 border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-xl mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                <div className="h-7 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className={`p-3 rounded-xl ${stat.bgColor} mr-4 border-2 border-gray-200`}>
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-700">{stat.title}</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">
                    {stat.isDecimal ? stat.value.toFixed(1) : stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm font-medium text-gray-600">{stat.description}</p>
                <div className="flex items-center bg-green-100 px-3 py-1 rounded-full border border-green-200">
                  <TrendingUp className="w-4 h-4 text-green-700 mr-1" />
                  <span className="text-sm font-bold text-green-700">{stat.trend}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress bar for visual effect */}
          <div className="mt-4">
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${stat.color} shadow-md`}
                style={{ width: `${Math.min((stat.value / 1000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StatsCards;