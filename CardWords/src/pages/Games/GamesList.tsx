import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { gameService } from '../../services/gameService';
import { Game, GameSession } from '../../types/game';
import { 
  ArrowLeft, Eye, Trash2, Search, X, Gamepad2, Trophy, Target, 
  TrendingUp, BarChart3, Star, Clock, CheckCircle, XCircle, 
  Calendar, Filter, Loader2, AlertTriangle
} from 'lucide-react';

const GameStatsCard: React.FC<{
  title: string;
  value: number;
  type: string;
  subtitle?: string;
  icon: React.ElementType;
}> = ({ title, value, type, subtitle, icon: IconComponent }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getGradient = () => {
    switch (type) {
      case 'sessions': return 'from-blue-500 to-blue-600';
      case 'score': return 'from-purple-500 to-purple-600';
      case 'accuracy': return 'from-green-500 to-green-600';
      default: return 'from-orange-500 to-orange-600';
    }
  };

  const formatValue = () => {
    if (type === 'accuracy') return `${value.toFixed(1)}%`;
    if (type === 'score') return value.toFixed(1);
    return value;
  };

  return (
    <div className={`transform transition-all duration-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
        <div className={`h-2 bg-gradient-to-r ${getGradient()}`}></div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${getGradient()} transform group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatValue()}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const SessionDetailsModal: React.FC<{
  session: GameSession;
  details: any;
  loading: boolean;
  onClose: () => void;
}> = ({ session, details, loading, onClose }) => {
  return (
    <div className="fixed inset-0 mt-19 mb-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[75vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-7 z-10">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-2xl font-bold flex items-center">
                <BarChart3 className="w-6 h-6 mr-3" />
                Chi tiết phiên chơi
              </h3>
              <p className="text-blue-100 mt-1">{session.userName}</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all duration-200">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center border border-blue-200 transform hover:scale-105 transition-transform">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-600 font-medium mb-1">Điểm số</p>
              <p className="text-3xl font-bold text-blue-700">{session.score.toFixed(1)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center border border-green-200 transform hover:scale-105 transition-transform">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-600 font-medium mb-1">Độ chính xác</p>
              <p className="text-3xl font-bold text-green-700">{session.accuracy}%</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center border border-purple-200 transform hover:scale-105 transition-transform">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-purple-600 font-medium mb-1">Trả lời đúng</p>
              <p className="text-3xl font-bold text-purple-700">{session.correctCount}/{session.totalQuestions}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center border border-orange-200 transform hover:scale-105 transition-transform">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-orange-600 font-medium mb-1">Thời lượng</p>
              <p className="text-3xl font-bold text-orange-700">
                {session.finishedAt ? `${Math.round((new Date(session.finishedAt).getTime() - new Date(session.startedAt).getTime()) / 1000 / 60)}p` : 'N/A'}
              </p>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col justify-center items-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Đang tải chi tiết...</p>
            </div>
          )}

          {details && (
            <div>
              <div className="flex items-center mb-4">
                <BarChart3 className="w-6 h-6 text-gray-700 mr-2" />
                <h4 className="text-xl font-bold text-gray-900">Chi tiết câu hỏi</h4>
              </div>
              <div className="space-y-3">
                {details.details.map((detail: any, index: number) => (
                  <div key={index} className={`p-5 rounded-xl border-2 transform hover:scale-[1.02] transition-all duration-200 ${
                      detail.isCorrect 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 hover:shadow-lg hover:shadow-green-100' 
                        : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 hover:shadow-lg hover:shadow-red-100'
                    }`} style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {detail.isCorrect ? <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> : <XCircle className="w-5 h-5 text-red-600 mr-2" />}
                          <p className="font-bold text-gray-900 text-lg">{detail.word}</p>
                        </div>
                        <p className="text-gray-600 ml-7">{detail.meaning}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${detail.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {detail.isCorrect ? 'Đúng' : 'Sai'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } } .animate-fade-in { animation: fade-in 0.3s ease-out; } .animate-scale-in { animation: scale-in 0.3s ease-out; }`}</style>
    </div>
  );
};

const GamesList: React.FC = () => {
  const navigate = useNavigate();
  const { games, overviewStatistics, loading, error, fetchAllGames, fetchGamesOverviewStatistics, deleteGameSession, clearError } = useGameStore();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [gameStatistics, setGameStatistics] = useState<any>(null);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<GameSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<GameSession | null>(null);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [loadingSessionDetails, setLoadingSessionDetails] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [filters, setFilters] = useState({ search: '', sortBy: 'sessionCount', sortDir: 'desc' as 'asc' | 'desc' });

  useEffect(() => {
    loadGames();
    loadOverviewStatistics();
    setTimeout(() => setPageLoaded(true), 200);
  }, []);

  useEffect(() => {
    if (selectedGame) {
      loadGameSessions(selectedGame.id);
      loadGameStatistics(selectedGame.id);
    }
  }, [selectedGame, currentPage]);

  const loadGames = async () => {
    try { await fetchAllGames(); } catch (error) { console.error('Failed to load games:', error); }
  };

  const loadOverviewStatistics = async () => {
    try { await fetchGamesOverviewStatistics(); } catch (error) { console.error('Failed to load overview statistics:', error); }
  };

  const loadGameSessions = async (gameId: number) => {
    setLoadingSessions(true);
    try {
      const response = await gameService.getGameSessions(gameId, { page: currentPage, size: itemsPerPage });
      setGameSessions(response.data.content);
    } catch (error) { console.error('Failed to load game sessions:', error); } finally { setLoadingSessions(false); }
  };

  const loadGameStatistics = async (gameId: number) => {
    setLoadingStats(true);
    try {
      const response = await gameService.getGameStatistics(gameId);
      setGameStatistics(response.data);
    } catch (error) { console.error('Failed to load game statistics:', error); } finally { setLoadingStats(false); }
  };

  const loadSessionDetails = async (sessionId: number) => {
    setLoadingSessionDetails(true);
    try {
      const response = await gameService.getGameSessionDetail(sessionId);
      setSessionDetails(response.data);
    } catch (error) { console.error('Failed to load session details:', error); } finally { setLoadingSessionDetails(false); }
  };

  const handleViewGame = (game: Game) => { setSelectedGame(game); setCurrentPage(0); };
  const handleBackToList = () => { setSelectedGame(null); setGameSessions([]); setGameStatistics(null); setCurrentPage(0); };
  
  const handleViewSession = async (session: GameSession) => {
    setSelectedSession(session);
    setShowSessionModal(true);
    await loadSessionDetails(session.sessionId);
  };

  const handleDeleteSession = async (session: GameSession) => {
    setSessionToDelete(session);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    
    try {
      setDeleteLoading(true);
      await deleteGameSession(sessionToDelete.sessionId);
      if (selectedGame) loadGameSessions(selectedGame.id);
    
      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (error: any) { 
     
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => { setFilters(prev => ({ ...prev, [key]: value })); };
  const clearFilters = () => { setFilters({ search: '', sortBy: 'sessionCount', sortDir: 'desc' }); };

  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200';
    if (accuracy >= 70) return 'bg-blue-100 text-blue-800 ring-1 ring-blue-200';
    if (accuracy >= 50) return 'bg-amber-100 text-amber-800 ring-1 ring-amber-200';
    return 'bg-red-100 text-red-800 ring-1 ring-red-200';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200';
    if (score >= 70) return 'bg-blue-100 text-blue-800 ring-1 ring-blue-200';
    if (score >= 50) return 'bg-amber-100 text-amber-800 ring-1 ring-amber-200';
    return 'bg-red-100 text-red-800 ring-1 ring-red-200';
  };

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    game.description.toLowerCase().includes(filters.search.toLowerCase())
  ).sort((a, b) => {
    const multiplier = filters.sortDir === 'desc' ? -1 : 1;
    if (filters.sortBy === 'name') return multiplier * a.name.localeCompare(b.name);
    if (filters.sortBy === 'sessionCount') return multiplier * (a.sessionCount - b.sessionCount);
    if (filters.sortBy === 'createdAt') return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return 0;
  });

  if (loading && games.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className={`mb-8 transform transition-all duration-700 ${pageLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <button onClick={handleBackToList} className="flex items-center text-blue-600 hover:text-blue-800 mb-6 group transition-all duration-300 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg">
              <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Quay lại danh sách</span>
            </button>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <Gamepad2 className="w-8 h-8 text-blue-600 mr-3" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{selectedGame.name}</h1>
                  </div>
                  <p className="text-gray-600 text-lg">{selectedGame.description}</p>
                </div>
                <div className="text-right bg-gradient-to-br from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl shadow-lg">
                  <p className="text-sm opacity-90 mb-1">Tổng phiên chơi</p>
                  <p className="text-3xl font-bold">{selectedGame.sessionCount}</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex justify-between items-center shadow-md animate-fade-in">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 mr-3" />
                <div><strong className="font-semibold">Lỗi:</strong> {error}</div>
              </div>
              <button onClick={clearError} className="text-red-700 hover:text-red-900 font-medium transition-colors"><X className="w-5 h-5" /></button>
            </div>
          )}

          {gameStatistics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GameStatsCard title="Tổng phiên chơi" value={gameStatistics.totalSessions} type="sessions" subtitle="Tất cả phiên" icon={Gamepad2} />
              <GameStatsCard title="Điểm trung bình" value={gameStatistics.averageScore} type="score" subtitle="Hiệu suất chung" icon={BarChart3} />
              <GameStatsCard title="Điểm cao nhất" value={gameStatistics.highestScore} type="score" subtitle="Thành tích tốt nhất" icon={Trophy} />
              <GameStatsCard title="Độ chính xác TB" value={gameStatistics.averageAccuracy} type="accuracy" subtitle="Câu trả lời đúng" icon={Target} />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-3" />Các phiên chơi
              </h2>
              <p className="text-blue-100 text-sm mt-1">Tìm thấy {gameSessions.length} phiên chơi</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Người chơi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Điểm số</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Độ chính xác</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Câu hỏi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thời gian bắt đầu</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gameSessions.map((session, index) => (
                    <tr key={session.sessionId} className="hover:bg-blue-50 transition-colors duration-200" style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {session.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{session.userName}</div>
                            <div className="text-sm text-gray-500">{session.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getScoreBadge(session.score)}`}>{session.score.toFixed(1)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getAccuracyBadge(session.accuracy)}`}>{session.accuracy}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          <span className="font-semibold">{session.correctCount}</span>
                          <span className="text-gray-500 mx-1">/</span>
                          <span>{session.totalQuestions}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(session.startedAt).toLocaleString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleViewSession(session)} className="flex items-center text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg text-sm bg-blue-50 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md">
                            <Eye className="w-4 h-4 mr-1" />Xem
                          </button>
                          <button onClick={() => handleDeleteSession(session)} className="flex items-center text-red-600 hover:text-red-800 px-4 py-2 rounded-lg text-sm bg-red-50 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md">
                            <Trash2 className="w-4 h-4 mr-1" />Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {gameSessions.length === 0 && !loadingSessions && (
              <div className="text-center py-16">
                <div className="text-gray-300 mb-4"><Gamepad2 className="w-24 h-24 mx-auto" /></div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Chưa có phiên chơi</h3>
                <p className="text-gray-500">Trò chơi này chưa có phiên chơi nào.</p>
              </div>
            )}

            {loadingSessions && (
              <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            )}
          </div>

          {showSessionModal && selectedSession && (
            <SessionDetailsModal session={selectedSession} details={sessionDetails} loading={loadingSessionDetails} onClose={() => { setShowSessionModal(false); setSelectedSession(null); setSessionDetails(null); }} />
          )}

          {showDeleteModal && sessionToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="w-6 h-6 text-white mr-3" />
                      <h3 className="text-xl font-bold text-white">Xác nhận xóa</h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setSessionToDelete(null);
                      }}
                      className="text-white hover:text-gray-200 transition-colors"
                      disabled={deleteLoading}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Xóa phiên chơi của {sessionToDelete.userName}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Bạn có chắc chắn muốn xóa phiên chơi này? Hành động này không thể hoàn tác.
                    </p>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-700 text-sm">
                        <span className="font-bold">Thông tin phiên chơi:</span>
                        <br />
                        Điểm: {sessionToDelete.score.toFixed(1)} | Độ chính xác: {sessionToDelete.accuracy}%
                        <br />
                        Ngày: {new Date(sessionToDelete.startedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setSessionToDelete(null);
                      }}
                      disabled={deleteLoading}
                      className="flex-1 px-4 py-3 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all font-medium hover:shadow-md"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      disabled={deleteLoading}
                      className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      {deleteLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Đang xóa...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5 mr-2" />
                          Xóa vĩnh viễn
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className={`mb-8 transform transition-all duration-700 ${pageLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Quản Lý Trò Chơi</h1>
            <p className="text-gray-600 text-lg">Theo dõi và phân tích hiệu suất trò chơi</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex justify-between items-center shadow-md animate-fade-in">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 mr-3" />
              <div><strong className="font-semibold">Lỗi:</strong> {error}</div>
            </div>
            <button onClick={clearError} className="text-red-700 hover:text-red-900 font-medium transition-colors"><X className="w-5 h-5" /></button>
          </div>
        )}

        {overviewStatistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GameStatsCard title="Tổng số trò chơi" value={overviewStatistics.totalGames} type="sessions" icon={Target} />
            <GameStatsCard title="Tổng phiên chơi" value={overviewStatistics.totalSessions} type="sessions" icon={Gamepad2} />
            <GameStatsCard title="Điểm TB chung" value={overviewStatistics.overallAverageScore} type="score" icon={TrendingUp} />
            <GameStatsCard title="Điểm cao nhất" value={overviewStatistics.overallHighestScore} type="score" icon={Trophy} />
          </div>
        )}

        <div className={`bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 transform transition-all duration-700 delay-300 ${pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Tìm kiếm trò chơi..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
              <select value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <option value="sessionCount">Số phiên chơi</option>
                <option value="name">Tên trò chơi</option>
                <option value="createdAt">Ngày tạo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự</label>
              <select value={filters.sortDir} onChange={(e) => handleFilterChange('sortDir', e.target.value as 'asc' | 'desc')} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <option value="desc">Giảm dần</option>
                <option value="asc">Tăng dần</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="font-medium">Tổng cộng:</span>
              <span className="ml-2 text-blue-600 font-semibold">{filteredGames.length} trò chơi</span>
            </div>
            <button onClick={clearFilters} className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center shadow-sm hover:shadow-md">
              <X className="w-4 h-4 mr-2" />Xóa bộ lọc
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <div key={game.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 group" style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` }}>
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-3 transform group-hover:scale-110 transition-transform duration-300">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{game.name}</h3>
                  </div>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-md">{game.sessionCount}</span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">{game.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-5 pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>{new Date(game.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>{new Date(game.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <button onClick={() => handleViewGame(game)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Eye className="w-5 h-5 mr-2" />Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-gray-300 mb-6"><Gamepad2 className="w-32 h-32 mx-auto" /></div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Không tìm thấy trò chơi</h3>
            <p className="text-gray-500 text-lg">Thử điều chỉnh tiêu chí tìm kiếm của bạn</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GamesList;