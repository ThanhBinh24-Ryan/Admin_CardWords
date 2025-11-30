import React from 'react';
import { TopPlayersData, LeaderboardEntry } from '../../types/dashboard';
import { Trophy, Crown, Star, TrendingUp, Users, Award } from 'lucide-react';

interface LeaderboardSectionProps {
  topPlayers: TopPlayersData | null;
  loading: boolean;
}

const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({ topPlayers, loading }) => {
  if (loading && !topPlayers) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500 bg-yellow-50';
      case 2: return 'text-gray-500 bg-gray-50';
      case 3: return 'text-orange-500 bg-orange-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-4 h-4" />;
      case 2: return <Trophy className="w-4 h-4" />;
      case 3: return <Award className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  
  const renderLeaderboard = (title: string, data: LeaderboardEntry[] | undefined, game: string) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
        <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
        {title}
      </h4>
      <div className="space-y-2">
        {(data || []).slice(0, 5).map((player, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRankColor(player.rank)}`}>
                {getRankIcon(player.rank)}
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                {player.avatar ? (
                  <img src={player.avatar} alt={player.userName} className="w-8 h-8 rounded-full" />
                ) : (
                  <Users className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900">{player.userName}</div>
                <div className="text-xs text-gray-500">{player.totalScore} điểm</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{player.accuracy}%</div>
              <div className="text-xs text-gray-500">Độ chính xác</div>
            </div>
          </div>
        ))}
        {(!data || data.length === 0) && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Chưa có dữ liệu
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Bảng Xếp Hạng
          </h3>
          <p className="text-sm text-gray-600">Top người chơi xuất sắc</p>
        </div>
        {topPlayers && (
          <div className="text-sm text-gray-500">
            {topPlayers.totalActivePlayers.toLocaleString()} người chơi hoạt động
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderLeaderboard('Quick Quiz', topPlayers?.quickQuizTop10, 'quiz')}
        {renderLeaderboard('Image Matching', topPlayers?.imageMatchingTop10, 'matching')}
        {renderLeaderboard('Word Definition', topPlayers?.wordDefinitionTop10, 'definition')}
      </div>

      {!topPlayers && (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Chưa có dữ liệu bảng xếp hạng</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardSection;