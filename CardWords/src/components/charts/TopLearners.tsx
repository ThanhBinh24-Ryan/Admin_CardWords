import React from 'react';
import { RegistrationChartData } from '../../types/dashboard';
import { Award, Star, TrendingUp, Book, Zap, Users } from 'lucide-react';

interface TopLearnersProps {
  data: RegistrationChartData['topLearners'] | null | undefined; // THÊM undefined
  loading: boolean;
}

const TopLearners: React.FC<TopLearnersProps> = ({ data, loading }) => {
  if (loading && !data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 1: return 'bg-gray-100 text-gray-800 border-gray-200';
      case 2: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Award className="w-4 h-4" />;
      case 1: return <TrendingUp className="w-4 h-4" />;
      case 2: return <Star className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  // SỬA: Sử dụng data || [] để tránh undefined
  const learners = data || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Top Học Viên
          </h3>
          <p className="text-sm text-gray-600">Những người học xuất sắc nhất</p>
        </div>
      </div>

      <div className="space-y-3">
        {learners.slice(0, 10).map((learner, index) => (
          <div key={learner.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${getRankColor(index)}`}>
                {getRankIcon(index)}
              </div>
              
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {learner.avatarUrl ? (
                  <img src={learner.avatarUrl} alt={learner.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <Users className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">{learner.name}</div>
                <div className="text-xs text-gray-500 truncate">{learner.email}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-right">
              <div className="text-center">
                <div className="font-bold text-gray-900 text-sm">{learner.totalWordsLearned}</div>
                <div className="text-xs text-gray-500">Từ</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-sm flex items-center">
                  <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                  {learner.currentStreak}
                </div>
                <div className="text-xs text-gray-500">Streak</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-sm">{learner.totalScore}</div>
                <div className="text-xs text-gray-500">Điểm</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {learners.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Book className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Chưa có dữ liệu học viên</p>
        </div>
      )}

      {learners.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            Hiển thị {Math.min(learners.length, 10)} trong tổng số {learners.length} học viên
          </div>
        </div>
      )}
    </div>
  );
};

export default TopLearners;