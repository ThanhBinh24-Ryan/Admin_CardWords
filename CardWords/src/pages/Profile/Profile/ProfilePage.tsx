// pages/Profile/ProfilePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit2, 
  Save, 
  X,
  Camera,
  Shield,
  Activity
} from 'lucide-react';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Admin User',
    email: 'admin@cardwords.com',
    role: 'Super Administrator',
    joinDate: '15/03/2024',
    location: 'Hồ Chí Minh, Vietnam',
    phone: '+84 123 456 789',
    bio: 'Quản trị viên hệ thống CardWords với hơn 2 năm kinh nghiệm trong việc quản lý nền tảng học tiếng Anh.',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=5b21b6&color=fff'
  });

  const [editData, setEditData] = useState({ ...userData });

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const stats = [
    { label: 'Người dùng quản lý', value: '1,234', color: 'blue' },
    { label: 'Từ vựng đã duyệt', value: '45,678', color: 'green' },
    { label: 'Bài học tạo', value: '567', color: 'purple' },
    { label: 'Hoạt động tuần', value: '89', color: 'orange' }
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">Hồ Sơ Cá Nhân</h1>
          <p className="profile-subtitle">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="profile-content">
          {/* Left Side - Profile Info */}
          <div className="profile-sidebar">
            {/* Avatar Section */}
            <div className="avatar-section">
              <div className="avatar-container">
                <img src={userData.avatar} alt="Avatar" className="avatar-image" />
                <button className="avatar-edit-btn">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="user-name">{userData.name}</h2>
              <p className="user-role">{userData.role}</p>
              <div className="join-date">
                <Calendar size={14} />
                <span>Tham gia từ {userData.joinDate}</span>
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
              <button 
                className="action-btn secondary"
                onClick={() => navigate('/profile/activity-logs')}
              >
                <Activity size={16} />
                Nhật ký hoạt động
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
                >
                  <Edit2 size={16} />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    <Save size={16} />
                    Lưu
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
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
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="edit-input"
                  />
                ) : (
                  <div className="detail-value">{userData.name}</div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">
                  <Mail size={16} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="edit-input"
                  />
                ) : (
                  <div className="detail-value">{userData.email}</div>
                )}
              </div>

              <div className="detail-item">
                <label className="detail-label">
                  <MapPin size={16} />
                  Địa chỉ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData({...editData, location: e.target.value})}
                    className="edit-input"
                  />
                ) : (
                  <div className="detail-value">{userData.location}</div>
                )}
              </div>

              <div className="detail-item full-width">
                <label className="detail-label">Số điện thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="edit-input"
                  />
                ) : (
                  <div className="detail-value">{userData.phone}</div>
                )}
              </div>

              <div className="detail-item full-width">
                <label className="detail-label">Giới thiệu bản thân</label>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    className="edit-textarea"
                    rows={4}
                  />
                ) : (
                  <div className="detail-value bio">{userData.bio}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;