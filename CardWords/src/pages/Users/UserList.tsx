

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { User, UserFilter } from '../../types/user';
import { USER_ROLES } from '../../constants/userRoles';
import { 
  Users, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Key, 
  Shield, 
  Ban, 
  UserCheck, 
  UserX,
  Filter,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserPlus,
  Send,
  AlertTriangle
} from 'lucide-react';

// Modal Components
import ResetPasswordModal from './modals/ResetPasswordModal';
import DeleteUserModal from './modals/DeleteUserModal';
import BanUserModal from './modals/BanUserModal';
import ActivateUserModal from './modals/ActivateUserModal';

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUserRoles,
    banUser,
    activateUser,
    deleteUser,
    searchUsers,
    clearError
  } = useUserStore();

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  // Modal states
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<UserFilter>({
    search: '',
    status: '',
    banned: null,
    activated: null,
    current_level: ''
  });

  useEffect(() => {
    loadUsers();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  const loadUsers = async () => {
    try {
      await fetchUsers({
        page: currentPage,
        size: itemsPerPage,
        sortBy: 'createdAt',
        sortDir: 'desc'
      });
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSearch = async () => {
    if (!filters.search.trim()) {
      loadUsers();
      return;
    }

    try {
      await searchUsers({
        keyword: filters.search,
        page: currentPage,
        size: itemsPerPage
      });
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    setActionLoading('delete');
    try {
      await deleteUser(selectedUser.id);
     
      setShowDeleteModal(false);
      loadUsers();
    } catch (error: any) {
     
    } finally {
      setActionLoading(null);
    }
  };



  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setShowResetPasswordModal(true);
  };

  const handleConfirmResetPassword = async () => {
    if (!selectedUser) return;
    
    setActionLoading('resetPassword');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/admin/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
     
        setShowResetPasswordModal(false);
      } else {
        throw new Error('Failed to send reset password email');
      }
    } catch (error) {
     
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/admin/users/${id}`);
  };

  const handleAssignRole = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles || []);
    setShowRoleModal(true);
  };

  const handleUpdateRoles = async () => {
    if (!selectedUser) return;

    setActionLoading('updateRoles');
    try {
      await updateUserRoles(selectedUser.id, selectedRoles);
     
      setShowRoleModal(false);
      loadUsers();
    } catch (error) {
   
    } finally {
      setActionLoading(null);
    }
  };

  const handleBanUser = (user: User, banned: boolean) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const handleConfirmBan = async (banned: boolean) => {
    if (!selectedUser) return;
    
    setActionLoading('ban');
    try {
      await banUser(selectedUser.id, banned);
    
      setShowBanModal(false);
      loadUsers();
    } catch (error) {
   
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivateUser = (user: User, activated: boolean) => {
    setSelectedUser(user);
    setShowActivateModal(true);
  };

  const handleConfirmActivate = async (activated: boolean) => {
    if (!selectedUser) return;
    
    setActionLoading('activate');
    try {
      await activateUser(selectedUser.id, activated);
   
      setShowActivateModal(false);
      loadUsers();
    } catch (error) {
   
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (key: keyof UserFilter, value: any) => {
    setFilters((prev: UserFilter) => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      banned: null,
      activated: null,
      current_level: ''
    });
    setCurrentPage(0);
    loadUsers();
  };

  const getStatusBadge = (user: User) => {
    let status = user.status;
    
    if (user.banned) {
      status = 'BANNED';
    } else if (!user.activated) {
      status = 'INACTIVE';
    } else if (!status) {
      status = 'ACTIVE';
    }

    const statusConfig: { [key: string]: { color: string; label: string } } = {
      'ACTIVE': { color: 'from-green-600 to-green-600', label: 'Hoạt động' },
      'PENDING': { color: 'from-yellow-400 to-yellow-500', label: 'Chờ xử lý' },
      'SUSPENDED': { color: 'from-red-400 to-red-500', label: 'Tạm ngưng' },
      'INACTIVE': { color: 'from-gray-400 to-gray-500', label: 'Không hoạt động' },
      'BANNED': { color: 'from-red-500 to-red-600', label: 'Bị cấm' }
    };
    
    const config = statusConfig[status] || statusConfig['ACTIVE'];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${config.color} text-white shadow-md`}>
        {config.label}
      </span>
    );
  };

  const getLevelBadge = (level: string | null) => {
    if (!level) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          N/A
        </span>
      );
    }
    
    const levelColors: { [key: string]: string } = {
      'A1': 'from-blue-400 to-blue-500',
      'A2': 'from-blue-500 to-blue-600',
      'B1': 'from-green-400 to-green-500',
      'B2': 'from-green-500 to-green-600',
      'C1': 'from-purple-400 to-purple-500',
      'C2': 'from-purple-500 to-purple-600'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${levelColors[level] || 'from-gray-400 to-gray-500'} text-white shadow-md`}>
        {level}
      </span>
    );
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev: string[]) => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] space-y-4">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quản lý người dùng
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý và theo dõi người dùng trong hệ thống
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start justify-between shadow-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Có lỗi xảy ra</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900 font-medium ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <Filter className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Bộ lọc tìm kiếm</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <UserCheck className="w-4 h-4 inline mr-1" />
                Trạng thái kích hoạt
              </label>
              <select
                value={filters.activated === null ? '' : filters.activated.toString()}
                onChange={(e) => handleFilterChange('activated', e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
              >
                <option value="">Tất cả</option>
                <option value="true">Đã kích hoạt</option>
                <option value="false">Chưa kích hoạt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                Cấp độ
              </label>
              <select
                value={filters.current_level}
                onChange={(e) => handleFilterChange('current_level', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
              >
                <option value="">Tất cả cấp độ</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Ban className="w-4 h-4 inline mr-1" />
                Trạng thái cấm
              </label>
              <select
                value={filters.banned === null ? '' : filters.banned.toString()}
                onChange={(e) => handleFilterChange('banned', e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
              >
                <option value="">Tất cả</option>
                <option value="true">Đã bị cấm</option>
                <option value="false">Chưa bị cấm</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-700">
              Tổng số: <span className="text-blue-600">{pagination.totalElements}</span> người dùng
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-md flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </button>
              <button
                onClick={clearFilters}
                className="px-6 py-2 text-gray-700 border-2 border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-md flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Cấp độ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Kích hoạt
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Quyền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full object-cover border-2 border-blue-200 shadow-md"
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLevelBadge(user.currentLevel)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-2 ${user.activated ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'} shadow-md`}></div>
                        <span className="text-sm font-medium text-gray-900">
                          {user.activated ? 'Đã kích hoạt' : 'Chờ kích hoạt'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-md"
                          >
                            {role.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="p-2 text-blue-600 hover:text-blue-900 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all transform hover:scale-110 shadow-md"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user)}
                          className="p-2 text-orange-600 hover:text-orange-900 rounded-lg bg-orange-50 hover:bg-orange-100 transition-all transform hover:scale-110 shadow-md"
                          title="Đặt lại mật khẩu"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAssignRole(user)}
                          className="p-2 text-purple-600 hover:text-purple-900 rounded-lg bg-purple-50 hover:bg-purple-100 transition-all transform hover:scale-110 shadow-md"
                          title="Quản lý quyền"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                       
                        {user.banned ? (
                          <button
                            onClick={() => handleBanUser(user, false)}
                            className="p-2 text-green-600 hover:text-green-900 rounded-lg bg-green-50 hover:bg-green-100 transition-all transform hover:scale-110 shadow-md"
                            title="Bỏ cấm"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBanUser(user, true)}
                            className="p-2 text-red-600 hover:text-red-900 rounded-lg bg-red-50 hover:bg-red-100 transition-all transform hover:scale-110 shadow-md"
                            title="Cấm người dùng"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        {user.activated ? (
                          <button
                            onClick={() => handleActivateUser(user, false)}
                            className="p-2 text-yellow-600 hover:text-yellow-900 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-all transform hover:scale-110 shadow-md"
                            title="Vô hiệu hóa"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(user, true)}
                            className="p-2 text-green-600 hover:text-green-900 rounded-lg bg-green-50 hover:bg-green-100 transition-all transform hover:scale-110 shadow-md"
                            title="Kích hoạt"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 text-red-600 hover:text-red-900 rounded-lg bg-red-50 hover:bg-red-100 transition-all transform hover:scale-110 shadow-md"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy người dùng</h3>
              <p className="text-gray-500">Thử điều chỉnh bộ lọc hoặc tiêu chí tìm kiếm</p>
            </div>
          )}

          {loading && users.length > 0 && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex items-center justify-between border-t-2 border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Hiển thị <span className="font-bold text-blue-600">{currentPage * itemsPerPage + 1}</span> đến{' '}
                  <span className="font-bold text-blue-600">
                    {Math.min((currentPage + 1) * itemsPerPage, pagination.totalElements)}
                  </span>{' '}
                  trong tổng số <span className="font-bold text-blue-600">{pagination.totalElements}</span> kết quả
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 border-2 border-gray-300 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md"
                >
                  Trước
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    let page = i;
                    if (pagination.totalPages > 5) {
                      if (currentPage < 3) {
                        page = i;
                      } else if (currentPage > pagination.totalPages - 3) {
                        page = pagination.totalPages - 5 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border-2 text-sm font-bold rounded-xl transition-all transform hover:scale-105 shadow-md ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page + 1}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, pagination.totalPages - 1))}
                  disabled={currentPage === pagination.totalPages - 1}
                  className="px-4 py-2 border-2 border-gray-300 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Modal */}
        {showRoleModal && selectedUser && (
          <UserRoleModal
            user={selectedUser}
            selectedRoles={selectedRoles}
            onRoleToggle={handleRoleToggle}
            onUpdate={handleUpdateRoles}
            onClose={() => setShowRoleModal(false)}
            loading={actionLoading === 'updateRoles'}
          />
        )}

        {/* Reset Password Modal */}
        {showResetPasswordModal && selectedUser && (
          <ResetPasswordModal
            isOpen={showResetPasswordModal}
            onClose={() => setShowResetPasswordModal(false)}
            userId={selectedUser.id}
            userName={selectedUser.name}
            onResetPassword={handleConfirmResetPassword}
            loading={actionLoading === 'resetPassword'}
          />
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedUser && (
          <DeleteUserModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            userId={selectedUser.id}
            userName={selectedUser.name}
            onDeleteUser={handleConfirmDelete}
            loading={actionLoading === 'delete'}
          />
        )}

        {/* Ban Modal */}
        {showBanModal && selectedUser && (
          <BanUserModal
            isOpen={showBanModal}
            onClose={() => setShowBanModal(false)}
            user={selectedUser}
            onBanUser={handleConfirmBan}
            loading={actionLoading === 'ban'}
          />
        )}

        {/* Activate Modal */}
        {showActivateModal && selectedUser && (
          <ActivateUserModal
            isOpen={showActivateModal}
            onClose={() => setShowActivateModal(false)}
            user={selectedUser}
            onActivateUser={handleConfirmActivate}
            loading={actionLoading === 'activate'}
          />
        )}
      </div>
    </div>
  );
};

// Role Modal Component
const UserRoleModal: React.FC<{
  user: User;
  selectedRoles: string[];
  onRoleToggle: (role: string) => void;
  onUpdate: () => void;
  onClose: () => void;
  loading: boolean;
}> = ({ user, selectedRoles, onRoleToggle, onUpdate, onClose, loading }) => {
  const availableRoles = [USER_ROLES.USER, USER_ROLES.ADMIN];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-white mr-3" />
              <h3 className="text-xl font-bold text-white">
                Quản lý quyền
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-2">
            Người dùng: <span className="font-semibold text-white">{user.name}</span>
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            {availableRoles.map((role) => (
              <label 
                key={role} 
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                  selectedRoles.includes(role)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 shadow-lg'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  onChange={() => onRoleToggle(role)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                  disabled={loading}
                />
                <div className="flex-1">
                  <span className={`text-base font-bold ${selectedRoles.includes(role) ? 'text-white' : 'text-gray-700'}`}>
                    {role.replace('ROLE_', '')}
                  </span>
                  <p className={`text-xs mt-1 ${selectedRoles.includes(role) ? 'text-blue-100' : 'text-gray-500'}`}>
                    {role === USER_ROLES.ADMIN ? 'Quyền quản trị viên - Toàn quyền quản lý' : 'Quyền người dùng - Quyền cơ bản'}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 text-base font-bold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all transform hover:scale-105 shadow-md"
            >
              Hủy
            </button>
            <button
              onClick={onUpdate}
              disabled={loading}
              className="flex-1 px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Cập nhật
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;