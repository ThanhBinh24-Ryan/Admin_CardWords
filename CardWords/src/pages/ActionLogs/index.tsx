import React, { useEffect, useState } from 'react';
import { 
  useActionLogs, 
  useActionLogsLoading,
  useActionLogsError,
  useActionLogsFilters,
  useActionLogsPagination,
  useActionLogsStatistics,
  useActionLogStore
} from '../../store/actionLogStore';
import ActionLogsTable from './components/ActionLogsTable';
import ActionLogsFilter from './components/ActionLogsFilter';
import ActionLogsStatistics from './components/ActionLogsStatistics';
import CleanupModal from './modals/CleanupModal';
import { Activity } from 'lucide-react';
import { actionLogService } from '../../services/actionLogService';

const ActionLogsPage: React.FC = () => {
  const logs = useActionLogs();
  const loading = useActionLogsLoading();
  const error = useActionLogsError();
  const filters = useActionLogsFilters();
  const pagination = useActionLogsPagination();
  const statistics = useActionLogsStatistics();
  
  // Lấy actions từ store
  const fetchActionLogs = useActionLogStore((state) => state.fetchActionLogs);
  const fetchStatistics = useActionLogStore((state) => state.fetchStatistics);
  const setFilters = useActionLogStore((state) => state.setFilters);
  const resetFilters = useActionLogStore((state) => state.resetFilters);
  const clearError = useActionLogStore((state) => state.clearError);
  const cleanupOldLogs = useActionLogStore((state) => state.cleanupOldLogs);

  const [showCleanupModal, setShowCleanupModal] = useState(false);

  // Fetch data khi component mount
  useEffect(() => {
    fetchActionLogs();
    fetchStatistics();
  }, []);

  // Xử lý filter - gọi API ngay lập tức
  const handleFilterChange = async (newFilters: any) => {
    // Reset về trang đầu tiên khi filter
    const filtersWithResetPage = { ...newFilters, page: 0 };
    setFilters(filtersWithResetPage);
    await fetchActionLogs(filtersWithResetPage);
  };

  // Xử lý reset filter
  const handleResetFilters = async () => {
    resetFilters();
    await fetchActionLogs();
  };

  // Xử lý phân trang
  const handlePageChange = async (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    await fetchActionLogs(newFilters);
  };

  const handleCleanup = () => {
    setShowCleanupModal(true);
  };

  const handleCleanupConfirm = async (daysToKeep: number) => {
    try {
      await cleanupOldLogs(daysToKeep);
      setShowCleanupModal(false);
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  };

  const handleExport = async () => {
    try {
      // Export với filters hiện tại (không bao gồm pagination)
      const { page, size, sortBy, sortDirection, ...exportFilters } = filters;
      await actionLogService.downloadActionLogsExport(exportFilters);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">Đã xảy ra lỗi</h3>
                <div className="mt-2 text-red-700">
                  <p>{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="mt-3 bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Nhật ký Hành động</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Theo dõi và quản lý mọi hoạt động người dùng trong hệ thống
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <ActionLogsStatistics 
            statistics={statistics} 
            loading={loading}
          />
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <ActionLogsFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            onExport={handleExport}
            onCleanup={handleCleanup}
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <ActionLogsTable
            logs={logs}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Modals */}
        <CleanupModal
          isOpen={showCleanupModal}
          onClose={() => setShowCleanupModal(false)}
          onConfirm={handleCleanupConfirm}
        />
      </div>
    </div>
  );
};

export default ActionLogsPage;