import React from 'react';
import { GameStats as GameStatsType } from '../../types/dashboard';
import { GamepadIcon, Target, Trophy, TrendingUp, BarChart3, CheckCircle } from 'lucide-react';

interface GameStatsProps {
  data: GameStatsType[] | null;
  loading: boolean;
}

const GameStats: React.FC<GameStatsProps> = ({ data, loading }) => {
  if (loading && !data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="mb-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getGameIcon = (gameName: string) => {
    const icons: Record<string, any> = {
      'Quick Quiz': Target,
      'Image Matching': TrendingUp,
      'Word Definition': BarChart3,
      'default': GamepadIcon
    };
    return icons[gameName] || icons.default;
  };

  const getCompletionRate = (completed: number, total: number) => {
    return total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <GamepadIcon className="w-5 h-5 mr-2 text-green-600" />
            Thống kê Game
          </h3>
          <p className="text-sm text-gray-600">Hiệu suất các trò chơi</p>
        </div>
      </div>

      <div className="space-y-6">
        {data?.map((game, index) => {
          const GameIcon = getGameIcon(game.gameName);
          const completionRate = getCompletionRate(game.completedSessions, game.totalSessions);
          
          return (
            <div key={game.gameId} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <GameIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{game.gameName}</h4>
                  <p className="text-sm text-gray-500">ID: {game.gameId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{game.totalSessions}</div>
                  <div className="text-xs text-gray-500">Tổng phiên</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{game.completedSessions}</div>
                  <div className="text-xs text-gray-500">Hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{game.averageScore.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Điểm TB</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{game.highestScore}</div>
                  <div className="text-xs text-gray-500">Điểm cao</div>
                </div>
              </div>

              {/* Progress bar for completion rate */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Tỷ lệ hoàn thành</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Accuracy */}
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">Độ chính xác:</span>
                <span className="font-semibold text-gray-900">{game.averageAccuracy.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {(!data || data.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <GamepadIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Chưa có dữ liệu game</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            Tổng số game: {data.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;