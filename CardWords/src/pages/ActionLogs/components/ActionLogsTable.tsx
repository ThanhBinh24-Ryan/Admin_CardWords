import React from 'react';
import { ActionLog } from '../../../types/actionLog';
import { Trash2, User, Calendar, MapPin, Shield, Activity } from 'lucide-react';

interface ActionLogsTableProps {
  logs: ActionLog[] | undefined;
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  onPageChange: (page: number) => void;
  onDeleteLog: (log: ActionLog) => void;
}

const ActionLogsTable: React.FC<ActionLogsTableProps> = ({
  logs,
  loading,
  pagination,
  onPageChange,
  onDeleteLog
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-semibold";
    if (status === 'SUCCESS') {
      return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
    }
  };

  const getUserDisplay = (userId: string | null) => {
    // Kiểm tra nếu userId là null hoặc undefined
    if (!userId) {
      return "Không xác định";
    }
    
    // Hiển thị 8 ký tự đầu của userId để dễ nhận biết
    return userId.substring(0, 8) + '...';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Kiểm tra logs có tồn tại và có phần tử không
  if (!logs || logs.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="text-gray-300 text-8xl mb-6">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Không tìm thấy nhật ký hành động</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Hãy thử điều chỉnh bộ lọc hoặc thử lại sau để xem kết quả.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Table Header Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Tổng cộng: <span className="text-blue-600 font-bold">{pagination.totalElements}</span> bản ghi
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Trang {pagination.currentPage + 1} / {pagination.totalPages}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Thông tin
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Hành động & Mô tả
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Địa chỉ IP
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {getUserDisplay(log.userId)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        User ID
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {log.actionType}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 font-medium">{log.resourceType}</div>
                    <div className="text-sm text-gray-600">{log.description}</div>
                    {log.actionCategory && (
                      <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded inline-block">
                        {log.actionCategory}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(log.status)}>
                    {log.status === 'SUCCESS' ? '✅ Thành công' : '❌ Thất bại'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm font-mono font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {log.ipAddress}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(log.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onDeleteLog(log)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors duration-150 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị{' '}
              <span className="font-semibold">
                {Math.max(pagination.currentPage * pagination.pageSize + 1, 1)}
              </span>{' '}
              đến{' '}
              <span className="font-semibold">
                {Math.min(pagination.currentPage * pagination.pageSize + logs.length, pagination.totalElements)}
              </span>{' '}
              của{' '}
              <span className="font-semibold">{pagination.totalElements}</span>{' '}
              kết quả
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  pagination.currentPage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                }`}
              >
                ← Trước
              </button>
              
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => onPageChange(index)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    pagination.currentPage === index
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages - 1}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  pagination.currentPage === pagination.totalPages - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
                }`}
              >
                Sau →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionLogsTable;