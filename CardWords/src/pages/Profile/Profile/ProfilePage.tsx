// pages/Profile/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../../store/ProfileStore';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit2, 
  Save, 
  X,
  Camera,
  Shield,
  Activity,
  Phone,
  Cake,
  Award,
  Zap,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
    clearError
  } = useProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    currentLevel: ''
  });

  const availableLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const availableGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setEditData({
        name: profile.name || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
        currentLevel: profile.currentLevel || ''
      });
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      await fetchProfile();
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleSave = async () => {
    setActionLoading('updateProfile');
    
    try {
      await updateProfile(editData);
      showSuccess('✅ Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        name: profile.name || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
        currentLevel: profile.currentLevel || ''
      });
    }
    setIsEditing(false);
    clearError();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('❌ Chỉ chấp nhận file ảnh: JPG, JPEG, PNG, GIF, WEBP');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Kích thước file không được vượt quá 5MB');
      return;
    }

    setActionLoading('updateAvatar');
    
    try {
      await updateAvatar(file);
      showSuccess('✅ Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      setActionLoading(null);
      // Clear file input
      e.target.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const getLevelBadge = (level: string) => {
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

  const stats = [
    { 
      label: 'Trình độ', 
      value: profile?.currentLevel || 'Chưa có',
      color: 'blue'
    },
    { 
      label: 'Giới tính', 
      value: profile?.gender || 'Chưa cập nhật',
      color: 'green'
    },
    { 
      label: 'Email', 
      value: profile?.email ? 'Đã xác thực' : 'Chưa xác thực',
      color: 'purple'
    },
    { 
      label: 'Thành viên', 
      value: 'Active',
      color: 'orange'
    }
  ];

  if (loading && !profile) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p>Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <h3>Đã xảy ra lỗi</h3>
          <p>{error}</p>
          <button onClick={loadProfile} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">Hồ Sơ Cá Nhân</h1>
          <p className="profile-subtitle">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={clearError} className="error-close">
              <X size={16} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="profile-content">
          {/* Left Side - Profile Info */}
          <div className="profile-sidebar">
            {/* Avatar Section */}
            <div className="avatar-section">
              <div className="avatar-container">
                <img 
                  src={profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=4f46e5&color=fff`} 
                  alt="Avatar" 
                  className="avatar-image" 
                />
                <label className="avatar-edit-btn">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="avatar-input"
                    disabled={actionLoading === 'updateAvatar'}
                  />
                </label>
                {actionLoading === 'updateAvatar' && (
                  <div className="avatar-loading">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
              </div>
              <h2 className="user-name">{profile?.name || 'Chưa có tên'}</h2>
              <p className="user-email">{profile?.email}</p>
              {profile?.currentLevel && (
                <div className="user-level">
                  {getLevelBadge(profile.currentLevel)}
                </div>
              )}
              <div className="join-date">
                <Calendar size={14} />
                <span>
                  {profile?.dateOfBirth 
                    ? `Ngày sinh: ${new Date(profile.dateOfBirth).toLocaleDateString('vi-VN')}`
                    : 'Chưa cập nhật ngày sinh'
                  }
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <button 
                className="action-btn primary"
                onClick={() => navigate('/profile/change-password')}
              >
                <Shield size={16} />
                Đổi mật khẩu
              </button>
            </div>

            {/* Stats */}
            <div className="stats-section">
              <h3>Thống Kê</h3>
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className={`stat-card ${stat.color}`}>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Profile Details */}
          <div className="profile-details">
            <div className="details-header">
              <h3>Thông Tin Cá Nhân</h3>
              {!isEditing ? (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  <Edit2 size={16} />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="save-btn" 
                    onClick={handleSave}
                    disabled={actionLoading === 'updateProfile'}
                  >
                    {actionLoading === 'updateProfile' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Lưu
                  </button>
                  <button 
                    className="cancel-btn" 
                    onClick={handleCancel}
                    disabled={actionLoading === 'updateProfile'}
                  >
                    <X size={16} />
                    Hủy
                  </button>
                </div>
              )}
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <label className="detail-label">
                  <User size={16} />
                  Họ và tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <div className="detail-value">{profile?.name || 'Chưa có tên'}</div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">
                  <Mail size={16} />
                  Email
                </label>
                <div className="detail-value email-value">
                  {profile?.email}
                  <span className="verified-badge">Đã xác thực</span>
                </div>
              </div>

              <div className="detail-item">
                <label className="detail-label">
                  <Cake size={16} />
                  Ngày sinh
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editData.dateOfBirth}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <div className="detail-value">
                    {profile?.dateOfBirth 
                      ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN')
                      : 'Chưa cập nhật'
                    }
                  </div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">
                  <User size={16} />
                  Giới tính
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editData.gender}
                    onChange={handleInputChange}
                    className="edit-input"
                  >
                    <option value="">Chọn giới tính</option>
                    {availableGenders.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                ) : (
                  <div className="detail-value">{profile?.gender || 'Chưa cập nhật'}</div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">
                  <Award size={16} />
                  Trình độ
                </label>
                {isEditing ? (
                  <select
                    name="currentLevel"
                    value={editData.currentLevel}
                    onChange={handleInputChange}
                    className="edit-input"
                  >
                    <option value="">Chọn trình độ</option>
                    {availableLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                ) : (
                  <div className="detail-value">
                    {profile?.currentLevel ? getLevelBadge(profile.currentLevel) : 'Chưa cập nhật'}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;