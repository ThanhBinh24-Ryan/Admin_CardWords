import React, { useState } from 'react';
import { ActionLogFilter } from '../../../types/actionLog';
import { Download, Trash2, Filter, X } from 'lucide-react';

interface ActionLogsFilterProps {
  filters: ActionLogFilter;
  onFilterChange: (filters: Partial<ActionLogFilter>) => void;
  onReset: () => void;
  onExport: () => void;
  onCleanup: () => void;
}

const ActionLogsFilter: React.FC<ActionLogsFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
  onExport,
  onCleanup
}) => {
  const [localFilters, setLocalFilters] = useState<Partial<ActionLogFilter>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (key: keyof ActionLogFilter, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };
// const handleApplyFilters = () => {
//   // Clean filters - remove empty values
//   const cleanedFilters = Object.fromEntries(
//     Object.entries(localFilters).filter(([_, value]) => 
//       value !== undefined && value !== null && value !== ''
//     )
//   );
  const handleClearLocal = () => {
    setLocalFilters({});
  };

  const hasActiveFilters = Object.keys(localFilters).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Bộ lọc
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={onExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất CSV
          </button>
          <button
            onClick={onCleanup}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Dọn dẹp
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tìm kiếm */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm
          </label>
          <input
            type="text"
            value={localFilters.keyword || ''}
            onChange={(e) => handleInputChange('keyword', e.target.value)}
            placeholder="Tìm trong mô tả, email, tên..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            value={localFilters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="SUCCESS">Thành công</option>
            <option value="FAILED">Thất bại</option>
          </select>
        </div>

        {/* Loại hành động */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại hành động
          </label>
          <input
            type="text"
            value={localFilters.actionType || ''}
            onChange={(e) => handleInputChange('actionType', e.target.value)}
            placeholder="Loại hành động..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Loại tài nguyên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại tài nguyên
          </label>
          <input
            type="text"
            value={localFilters.resourceType || ''}
            onChange={(e) => handleInputChange('resourceType', e.target.value)}
            placeholder="Loại tài nguyên..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {showAdvanced ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            {/* Ngày bắt đầu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="datetime-local"
                value={localFilters.startDate || ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Ngày kết thúc */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="datetime-local"
                value={localFilters.endDate || ''}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={localFilters.userId || ''}
                onChange={(e) => handleInputChange('userId', e.target.value)}
                placeholder="UUID của user..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Nút hành động */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <button
            onClick={handleApplyFilters}
            disabled={!hasActiveFilters}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
              hasActiveFilters
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Áp dụng Bộ lọc
          </button>
          <button
            onClick={handleClearLocal}
            disabled={!hasActiveFilters}
            className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors flex items-center ${
              hasActiveFilters
                ? 'text-gray-700 hover:bg-gray-50'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <X className="w-4 h-4 mr-2" />
            Xóa
          </button>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center"
        >
          Đặt lại Tất cả Bộ lọc
        </button>
      </div>
    </div>
  );
};

export default ActionLogsFilter;