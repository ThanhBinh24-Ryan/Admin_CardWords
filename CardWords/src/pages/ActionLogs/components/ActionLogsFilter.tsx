import React, { useState, useEffect } from 'react';
import { ActionLogFilter, DEFAULT_PAGINATION } from '../../../types/actionLog';
import { Filter, X, Download, Trash2 } from 'lucide-react';

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

  // Sync local filters với global filters khi reset
  useEffect(() => {
    // Reset local filters khi global filters trở về default
    const isDefaultFilters = 
      filters.page === DEFAULT_PAGINATION.page &&
      filters.size === DEFAULT_PAGINATION.size &&
      filters.sortBy === DEFAULT_PAGINATION.sortBy &&
      filters.sortDirection === DEFAULT_PAGINATION.sortDirection &&
      !filters.keyword &&
      !filters.status &&
      !filters.actionType &&
      !filters.resourceType &&
      !filters.userId &&
      !filters.startDate &&
      !filters.endDate;
    
    if (isDefaultFilters) {
      setLocalFilters({});
    }
  }, [filters]);

  const handleInputChange = (key: keyof ActionLogFilter, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearLocal = () => {
    setLocalFilters({});
    // Reset hoàn toàn về trạng thái ban đầu
    onReset();
  };

  const hasActiveFilters = Object.keys(localFilters).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Bộ lọc & Tìm kiếm
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={onExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tìm kiếm */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm
          </label>
          <input
            type="text"
            value={localFilters.keyword || ''}
            onChange={(e) => handleInputChange('keyword', e.target.value)}
            placeholder="Tìm trong mô tả..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleApplyFilters}
          disabled={!hasActiveFilters}
          className={`px-4 py-2 rounded-lg transition-all flex items-center ${
            hasActiveFilters
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Áp dụng Bộ lọc
        </button>
        <button
          onClick={handleClearLocal}
          disabled={!hasActiveFilters}
          className={`px-4 py-2 border rounded-lg transition-all flex items-center ${
            hasActiveFilters
              ? 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              : 'text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          <X className="w-4 h-4 mr-2" />
          Xóa Bộ lọc
        </button>
      </div>
    </div>
  );
};

export default ActionLogsFilter;