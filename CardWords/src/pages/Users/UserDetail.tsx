
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { 
  ArrowLeft,
  Edit,
  Mail,
  Calendar,
  User,
  Shield,
  Ban,
  UserCheck,
  UserX,
  Key,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

// Modal components
import ResetPasswordModal from './modals/ResetPasswordModal';
import DeleteUserModal from './modals/DeleteUserModal';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentUser,
    loading,
    error,
    fetchUserById,
    banUser,
    activateUser,
    deleteUser,
    clearCurrentUser,
    clearError
  } = useUserStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadUserData();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      clearCurrentUser();
      clearError();
    };
  }, []);

  const loadUserData = async () => {
    if (!id) return;
    try {
      await fetchUserById(id);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/users/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/users');
  };

  const handleResetPassword = async () => {
    setShowResetPasswordModal(true);
  };

  const handleConfirmResetPassword = async () => {
    if (!currentUser) return;
    
    setActionLoading('resetPassword');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/admin/users/${currentUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        alert('✅ Email đặt lại mật khẩu đã được gửi thành công!');
        setShowResetPasswordModal(false);
      } else {
        throw new Error('Failed to send reset password email');
      }
    } catch (error) {
      alert('❌ Gửi email thất bại. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivateDeactivate = async () => {
    if (!currentUser) return;
    
    const action = currentUser.activated ? 'deactivate' : 'activate';
    const actionText = currentUser.activated ? 'vô hiệu hóa' : 'kích hoạt';
    
    if (window.confirm(`Bạn có chắc muốn ${actionText} tài khoản này?`)) {
      setActionLoading('activate');
      try {
        await activateUser(currentUser.id, !currentUser.activated);
        alert(`✅ Tài khoản đã được ${actionText} thành công!`);
        await loadUserData(); // Reload data
      } catch (error) {
        alert(`❌ ${actionText} tài khoản thất bại. Vui lòng thử lại.`);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleBanUnban = async () => {
    if (!currentUser) return;
    
    const action = currentUser.banned ? 'unban' : 'ban';
    const actionText = currentUser.banned ? 'bỏ cấm' : 'cấm';
    
    if (window.confirm(`Bạn có chắc muốn ${actionText} người dùng này?`)) {
      setActionLoading('ban');
      try {
        await banUser(currentUser.id, !currentUser.banned);
        alert(`✅ Người dùng đã được ${actionText} thành công!`);
        await loadUserData(); // Reload data
      } catch (error) {
        alert(`❌ ${actionText} người dùng thất bại. Vui lòng thử lại.`);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentUser) return;
    
    setActionLoading('delete');
    try {
      await deleteUser(currentUser.id);
      alert('✅ Tài khoản đã được xóa thành công!');
      setShowDeleteModal(false);
      navigate('/users');
    } catch (error) {
      alert('❌ Xóa tài khoản thất bại. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (user: any) => {
    let status = user.status;
    
    if (user.banned) {
      status = 'BANNED';
    } else if (!user.activated) {
      status = 'INACTIVE';
    } else if (!status) {
      status = 'ACTIVE';
    }

    const statusConfig: { [key: string]: { class: string; icon: React.ReactElement; label: string } } = {
      'ACTIVE': { 
        class: 'bg-green-100 text-green-800 border-green-200', 
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: 'Hoạt động'
      },
      'PENDING': { 
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: <Clock className="w-4 h-4" />,
        label: 'Chờ xử lý'
      },
      'SUSPENDED': { 
        class: 'bg-orange-100 text-orange-800 border-orange-200', 
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'Tạm ngưng'
      },
      'INACTIVE': { 
        class: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: <UserX className="w-4 h-4" />,
        label: 'Không hoạt động'
      },
      'BANNED': { 
        class: 'bg-red-100 text-red-800 border-red-200', 
        icon: <Ban className="w-4 h-4" />,
        label: 'Bị cấm'
      }
    };
    
    const config = statusConfig[status] || statusConfig.INACTIVE;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.class}`}>
        {config.icon}
        <span className="ml-2">{config.label}</span>
      </span>
    );
  };

  const getLevelBadge = (level: string | null) => {
    if (!level) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
          <Shield className="w-4 h-4 mr-1" />
          Chưa có
        </span>
      );
    }
    
    const levelColors: { [key: string]: string } = {
      'A1': 'bg-blue-100 text-blue-800 border-blue-200',
      'A2': 'bg-blue-200 text-blue-800 border-blue-300',
      'B1': 'bg-green-100 text-green-800 border-green-200',
      'B2': 'bg-green-200 text-green-800 border-green-300',
      'C1': 'bg-purple-100 text-purple-800 border-purple-200',
      'C2': 'bg-purple-200 text-purple-800 border-purple-300'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${levelColors[level] || 'bg-gray-100 text-gray-800'}`}>
        <Shield className="w-4 h-4 mr-1" />
        {level}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Quay lại Danh sách
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy người dùng</h2>
          <p className="text-gray-600 mb-6">Người dùng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Quay lại Danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
          <div className="flex-1">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Quay lại Danh sách Người dùng
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random&size=128`}
                  alt={currentUser.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{currentUser.name}</h1>
                <p className="text-lg text-gray-600 mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  {currentUser.email}
                </p>
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(currentUser)}
                  {getLevelBadge(currentUser.currentLevel)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6 lg:mt-0">
         
            <button
              onClick={handleResetPassword}
              disabled={actionLoading === 'resetPassword'}
              className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors font-medium shadow-sm"
            >
              <Key className="w-4 h-4 mr-2" />
              {actionLoading === 'resetPassword' ? 'Đang gửi...' : 'Đặt lại MK'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'overview' as const, name: 'Thông tin tổng quan', icon: <User className="w-4 h-4" /> },
                { id: 'settings' as const, name: 'Quản lý tài khoản', icon: <Shield className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Thông tin cá nhân
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Họ và tên
                        </span>
                        <span className="font-medium text-gray-900">{currentUser.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </span>
                        <span className="font-medium text-gray-900">{currentUser.email}</span>
                      </div>
                      {currentUser.dateOfBirth && (
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <span className="text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Ngày sinh
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatDate(currentUser.dateOfBirth)}
                          </span>
                        </div>
                      )}
                      {currentUser.gender && (
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <span className="text-gray-600">Giới tính</span>
                          <span className="font-medium text-gray-900">{currentUser.gender}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Thông tin tài khoản
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">ID người dùng</span>
                        <span className="font-mono text-sm text-gray-900">{currentUser.id}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Tham gia từ
                        </span>
                        <span className="font-medium text-gray-900">{formatDate(currentUser.createdAt)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Cập nhật cuối
                        </span>
                        <span className="font-medium text-gray-900">{formatDate(currentUser.updatedAt)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Trạng thái kích hoạt</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          currentUser.activated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {currentUser.activated ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Đã kích hoạt
                            </>
                          ) : (
                            <>
                              <UserX className="w-4 h-4 mr-1" />
                              Chưa kích hoạt
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Quyền</span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {currentUser.roles?.map((role, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                            >
                              {role.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-yellow-800">
                        Quản lý tài khoản
                      </h3>
                      <div className="mt-2 text-yellow-700">
                        <p>Hãy thận trọng khi thực hiện các hành động này vì chúng có thể ảnh hưởng đến quyền truy cập và dữ liệu của người dùng.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Reset Password */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Key className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Đặt lại mật khẩu</h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Gửi email đặt lại mật khẩu cho người dùng. Họ sẽ nhận được hướng dẫn để thiết lập mật khẩu mới.
                        </p>
                        <button 
                          onClick={handleResetPassword}
                          disabled={actionLoading === 'resetPassword'}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                          {actionLoading === 'resetPassword' ? 'Đang gửi...' : 'Gửi email đặt lại'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activation Status */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <UserCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {currentUser.activated ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          {currentUser.activated 
                            ? 'Tạm thời vô hiệu hóa tài khoản này. Người dùng sẽ không thể truy cập nền tảng.' 
                            : 'Kích hoạt tài khoản này. Người dùng sẽ được khôi phục toàn quyền truy cập nền tảng.'}
                        </p>
                        <button 
                          onClick={handleActivateDeactivate}
                          disabled={actionLoading === 'activate'}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                            currentUser.activated
                              ? 'bg-gray-600 text-white hover:bg-gray-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {actionLoading === 'activate' ? 'Đang xử lý...' : currentUser.activated ? 'Vô hiệu hóa TK' : 'Kích hoạt TK'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ban/Unban */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Ban className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {currentUser.banned ? 'Bỏ cấm người dùng' : 'Cấm người dùng'}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          {currentUser.banned 
                            ? 'Gỡ bỏ hạn chế và khôi phục toàn quyền truy cập nền tảng cho người dùng này.' 
                            : 'Hạn chế người dùng này truy cập nền tảng do vi phạm chính sách.'}
                        </p>
                        <button 
                          onClick={handleBanUnban}
                          disabled={actionLoading === 'ban'}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                            currentUser.banned
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {actionLoading === 'ban' ? 'Đang xử lý...' : currentUser.banned ? 'Bỏ cấm' : 'Cấm người dùng'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-red-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Trash2 className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Xóa tài khoản</h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Xóa vĩnh viễn tài khoản người dùng này và tất cả dữ liệu liên quan. Hành động này không thể hoàn tác.
                        </p>
                        <button 
                          onClick={handleDeleteAccount}
                          disabled={actionLoading === 'delete'}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                          {actionLoading === 'delete' ? 'Đang xóa...' : 'Xóa tài khoản'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        userId={currentUser?.id || ''}
        userName={currentUser?.name || ''}
        onResetPassword={handleConfirmResetPassword}
        loading={actionLoading === 'resetPassword'}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        userId={currentUser?.id || ''}
        userName={currentUser?.name || ''}
        onDeleteUser={handleConfirmDelete}
        loading={actionLoading === 'delete'}
      />
    </div>
  );
};

export default UserDetail;