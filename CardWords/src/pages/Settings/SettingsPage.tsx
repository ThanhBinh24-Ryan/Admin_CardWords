// pages/Settings/SettingsPage.tsx
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Monitor,
  Smartphone
} from 'lucide-react';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    weeklyReports: true,
    
    // Privacy
    profileVisibility: 'public',
    dataSharing: false,
    twoFactorAuth: true,
    
    // Appearance
    theme: 'light',
    fontSize: 'medium',
    compactMode: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: 'Chung', icon: SettingsIcon },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'privacy', label: 'Bảo mật', icon: Shield },
    { id: 'appearance', label: 'Giao diện', icon: Palette }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-content">
            <h3>Cài Đặt Chung</h3>
            <div className="settings-group">
              <div className="setting-item">
                <label>Ngôn ngữ</label>
                <select 
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>Múi giờ</label>
                <select 
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                >
                  <option value="Asia/Ho_Chi_Minh">GMT+7 (Vietnam)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>Định dạng ngày</label>
                <select 
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-content">
            <h3>Cài Đặt Thông Báo</h3>
            <div className="settings-group">
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>Thông báo email</label>
                  <p>Nhận thông báo qua email về các hoạt động hệ thống</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>Thông báo đẩy</label>
                  <p>Hiển thị thông báo trực tiếp trên trình duyệt</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>Cảnh báo bảo mật</label>
                  <p>Nhận cảnh báo về các hoạt động bảo mật quan trọng</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.securityAlerts}
                    onChange={(e) => handleSettingChange('securityAlerts', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>Báo cáo tuần</label>
                  <p>Gửi báo cáo tổng quan hoạt động hàng tuần</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="settings-content">
            <h3>Cài Đặt Bảo Mật & Quyền Riêng Tư</h3>
            <div className="settings-group">
              <div className="setting-item">
                <label>Hiển thị hồ sơ</label>
                <select 
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                >
                  <option value="public">Công khai</option>
                  <option value="private">Chỉ mình tôi</option>
                  <option value="team">Chỉ thành viên nhóm</option>
                </select>
              </div>
              
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>Chia sẻ dữ liệu ẩn danh</label>
                  <p>Cho phép chia sẻ dữ liệu sử dụng để cải thiện hệ thống</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.dataSharing}
                    onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>Xác thực 2 yếu tố (2FA)</label>
                  <p>Tăng cường bảo mật bằng mã xác thực từ ứng dụng</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-content">
            <h3>Tùy Chỉnh Giao Diện</h3>
            <div className="settings-group">
              <div className="setting-item">
                <label>Chủ đề</label>
                <div className="theme-options">
                  <button 
                    className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleSettingChange('theme', 'light')}
                  >
                    <Monitor size={20} />
                    <span>Sáng</span>
                  </button>
                  <button 
                    className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleSettingChange('theme', 'dark')}
                  >
                    <Monitor size={20} />
                    <span>Tối</span>
                  </button>
                  <button 
                    className={`theme-option ${settings.theme === 'auto' ? 'active' : ''}`}
                    onClick={() => handleSettingChange('theme', 'auto')}
                  >
                    <Smartphone size={20} />
                    <span>Tự động</span>
                  </button>
                </div>
              </div>
              
              <div className="setting-item">
                <label>Cỡ chữ</label>
                <select 
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                >
                  <option value="small">Nhỏ</option>
                  <option value="medium">Vừa</option>
                  <option value="large">Lớn</option>
                </select>
              </div>
              
              <div className="setting-item toggle">
                <div className="setting-info">
                  <label>Chế độ compact</label>
                  <p>Hiển thị nhiều nội dung hơn trên màn hình</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Cài Đặt Hệ Thống</h1>
          <p>Tùy chỉnh trải nghiệm và cài đặt hệ thống của bạn</p>
        </div>

        <div className="settings-layout">
          {/* Sidebar */}
          <div className="settings-sidebar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="settings-main">
            {renderContent()}
            
            <div className="settings-actions">
              <button className="save-settings-btn">
                <Save size={16} />
                Lưu thay đổi
              </button>
              <button className="reset-settings-btn">
                Đặt lại mặc định
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;