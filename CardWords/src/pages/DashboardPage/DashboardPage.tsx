import React, { useEffect, useState } from 'react';
import {
  useDashboardStore,
  useSystemOverview,
  useUserStatistics,
  useRegistrationChart,
  useGameStats,
  useTopPlayers,
  useDashboardLoading,
  useDashboardError
} from '../../store/dashboardStore';
import StatsCards from './../../components/charts/StatsCards';
import RegistrationChart from './../../components/charts/RegistrationChart';
import TopLearners from './../../components/charts/TopLearners';
import GameStats from './../../components/charts/GameStats';
import UserStatistics from './../../components/charts/UserStatistics';
import LeaderboardSection from './../../components/charts/LeaderboardSection';
import { 
  RefreshCw, 
  TrendingUp, 
  Users, 
  GamepadIcon, 
  Award, 
  AlertCircle,
  Home,
  BarChart3,
  Sparkles,
  Rocket,
  Crown
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const systemOverview = useSystemOverview();
  const userStatistics = useUserStatistics();
  const registrationChart = useRegistrationChart();
  const gameStats = useGameStats();
  const topPlayers = useTopPlayers();
  const loading = useDashboardLoading();
  const error = useDashboardError();

  const {
    fetchSystemOverview,
    fetchUserStatistics,
    fetchRegistrationChart,
    fetchGameStats,
    fetchAllLeaderboards,
    clearError
  } = useDashboardStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchSystemOverview(),
        fetchUserStatistics(),
        fetchRegistrationChart(),
        fetchGameStats(),
        fetchAllLeaderboards()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadAllData();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-red-200 p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-red-800">Lỗi tải dữ liệu</h3>
                <div className="mt-2 text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={clearError}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - CHÍNH GIỮA */}
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-3">
              TỔNG QUAN HỆ THỐNG
            </h1>
            <p className="text-gray-700 text-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
              Thống kê và phân tích toàn bộ hệ thống học tập
            </p>
          </div>
          
          {/* Refresh Button - vẫn ở bên phải nhưng căn giữa container */}
          <div className="flex justify-center">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-6 py-3 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-xl hover:from-blue-800 hover:to-purple-800 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 flex items-center shadow-2xl hover:shadow-3xl"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Đang tải dữ liệu...' : 'Làm mới dữ liệu'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && !systemOverview && (
          <div className="flex flex-col justify-center items-center h-96">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-300 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Rocket className="w-8 h-8 text-blue-700 animate-bounce" />
              </div>
            </div>
            <p className="mt-4 text-gray-700 font-bold text-lg">Đang tải dữ liệu hệ thống...</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCards
            systemOverview={systemOverview}
            userStatistics={userStatistics}
            loading={loading}
          />
        </div>

        {/* Charts and Additional Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Registration Chart */}
          <div className="xl:col-span-2">
            <RegistrationChart
              data={registrationChart}
              loading={loading}
            />
          </div>

          {/* User Statistics */}
          <div>
            <UserStatistics
              data={userStatistics}
              loading={loading}
            />
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mb-8">
          <LeaderboardSection
            topPlayers={topPlayers}
            loading={loading}
          />
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Learners */}
          <div>
            <TopLearners
              data={registrationChart?.topLearners || null}
              loading={loading}
            />
          </div>

          {/* Game Statistics */}
          <div>
            <GameStats
              data={gameStats}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;