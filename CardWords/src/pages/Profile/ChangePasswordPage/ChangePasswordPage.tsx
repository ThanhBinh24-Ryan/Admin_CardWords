// pages/Profile/ChangePasswordPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Shield,
  Key
} from 'lucide-react';
import './ChangePasswordPage.css';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password strength requirements
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const checkPasswordStrength = (password: string) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    
    if (field === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const isFormValid = () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;
    const requirementsMet = Object.values(passwordRequirements).every(req => req);
    
    return currentPassword && 
           newPassword && 
           confirmPassword && 
           newPassword === confirmPassword && 
           requirementsMet &&
           newPassword !== currentPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success
      setMessage({
        type: 'success',
        text: 'Mật khẩu đã được thay đổi thành công!'
      });
      
      // Reset form
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Đã xảy ra lỗi. Vui lòng thử lại.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const metCount = Object.values(passwordRequirements).filter(req => req).length;
    if (metCount === 0) return { text: 'Rất yếu', color: '#ef4444', width: '20%' };
    if (metCount <= 2) return { text: 'Yếu', color: '#f59e0b', width: '40%' };
    if (metCount <= 3) return { text: 'Trung bình', color: '#eab308', width: '60%' };
    if (metCount <= 4) return { text: 'Mạnh', color: '#84cc16', width: '80%' };
    return { text: 'Rất mạnh', color: '#10b981', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="change-password-page">
      <div className="change-password-container">
        {/* Header */}
        <div className="password-header">
          <button 
            className="back-button"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="header-content">
            <div className="header-icon">
              <Shield size={32} />
            </div>
            <div>
              <h1>Đổi Mật Khẩu</h1>
              <p>Bảo vệ tài khoản của bạn với mật khẩu mạnh</p>
            </div>
          </div>
        </div>

        <div className="password-content">
          {/* Left Side - Form */}
          <div className="password-form-section">
            <form onSubmit={handleSubmit} className="password-form">
              {message && (
                <div className={`message ${message.type}`}>
                  {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Current Password */}
              <div className="input-group">
                <label className="input-label">
                  <Lock size={16} />
                  Mật khẩu hiện tại
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwords.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="password-input"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="input-group">
                <label className="input-label">
                  <Key size={16} />
                  Mật khẩu mới
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwords.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="password-input"
                    placeholder="Tạo mật khẩu mới"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength */}
                {passwords.newPassword && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{
                          width: strength.width,
                          backgroundColor: strength.color
                        }}
                      ></div>
                    </div>
                    <div className="strength-text">
                      Độ mạnh: <span style={{ color: strength.color }}>{strength.text}</span>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                <div className="password-requirements">
                  <h4>Yêu cầu mật khẩu:</h4>
                  <div className="requirements-list">
                    <div className={`requirement ${passwordRequirements.length ? 'met' : ''}`}>
                      {passwordRequirements.length ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      <span>Ít nhất 8 ký tự</span>
                    </div>
                    <div className={`requirement ${passwordRequirements.uppercase ? 'met' : ''}`}>
                      {passwordRequirements.uppercase ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      <span>Chứa chữ hoa (A-Z)</span>
                    </div>
                    <div className={`requirement ${passwordRequirements.lowercase ? 'met' : ''}`}>
                      {passwordRequirements.lowercase ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      <span>Chứa chữ thường (a-z)</span>
                    </div>
                    <div className={`requirement ${passwordRequirements.number ? 'met' : ''}`}>
                      {passwordRequirements.number ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      <span>Chứa số (0-9)</span>
                    </div>
                    <div className={`requirement ${passwordRequirements.special ? 'met' : ''}`}>
                      {passwordRequirements.special ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      <span>Chứa ký tự đặc biệt</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="input-group">
                <label className="input-label">
                  <Lock size={16} />
                  Xác nhận mật khẩu mới
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwords.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="password-input"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                  <div className="error-text">Mật khẩu xác nhận không khớp</div>
                )}
                {passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword && (
                  <div className="success-text">Mật khẩu khớp</div>
                )}
              </div>

              {/* Security Tips */}
              <div className="security-tips">
                <h4>💡 Mẹo bảo mật:</h4>
                <ul>
                  <li>Không sử dụng mật khẩu cũ đã từng dùng</li>
                  <li>Tránh sử dụng thông tin cá nhân dễ đoán</li>
                  <li>Sử dụng cụm mật khẩu độc đáo</li>
                  <li>Không sử dụng cùng mật khẩu cho nhiều tài khoản</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-button"
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  'Đổi Mật Khẩu'
                )}
              </button>
            </form>
          </div>

          {/* Right Side - Security Info */}
          <div className="security-info-section">
            <div className="security-card">
              <div className="security-icon">
                <Shield size={48} />
              </div>
              <h3>Bảo Mật Tài Khoản</h3>
              <p>Mật khẩu mạnh là tuyến phòng thủ đầu tiên bảo vệ tài khoản của bạn</p>
              
              <div className="security-features">
                <div className="feature">
                  <div className="feature-icon">🔒</div>
                  <div>
                    <h4>Mật khẩu mạnh</h4>
                    <p>Bảo vệ chống lại tấn công brute-force</p>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon">🔄</div>
                  <div>
                    <h4>Đổi mật khẩu định kỳ</h4>
                    <p>Nên thay đổi mật khẩu 3-6 tháng/lần</p>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon">📧</div>
                  <div>
                    <h4>Thông báo bảo mật</h4>
                    <p>Nhận cảnh báo khi có đăng nhập mới</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h4>Hoạt động gần đây</h4>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon success">✓</div>
                  <div>
                    <p>Đăng nhập thành công</p>
                    <span>Hôm nay, 08:30 - Chrome, Windows</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon info">i</div>
                  <div>
                    <p>Yêu cầu đổi mật khẩu</p>
                    <span>2 ngày trước</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon success">✓</div>
                  <div>
                    <p>Đăng nhập từ thiết bị mới</p>
                    <span>1 tuần trước - Safari, macOS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;