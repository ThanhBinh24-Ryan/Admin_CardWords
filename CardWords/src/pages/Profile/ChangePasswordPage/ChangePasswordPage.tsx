import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../../../store/ProfileStore';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Shield,
  Key,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import './ChangePasswordPage.css';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    changePassword,
    error,
    clearError
  } = useProfileStore();

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    
    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage(null);
    clearError();

    try {
      await changePassword(passwords);
      setSuccessMessage('Đổi mật khẩu thành công!');
      
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    } catch (error) {
      console.error('Failed to change password:', error);
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
         <div className="password-header">
          <button 
            className="back-button"
            onClick={() => navigate('/profile')}
            disabled={isLoading}
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
          <div className="password-form-section">
            <form onSubmit={handleSubmit} className="password-form">
              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                  <button onClick={clearError} className="error-close">
                    <XCircle size={16} />
                  </button>
                </div>
              )}

              {successMessage && (
                <div className="success-message">
                  <CheckCircle2 size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

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
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                    disabled={isLoading}
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

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
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                    disabled={isLoading}
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

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
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                    disabled={isLoading}
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

                <div className="security-tips">
                <h4>💡 Mẹo bảo mật:</h4>
                <ul>
                  <li>Không sử dụng mật khẩu cũ đã từng dùng</li>
                  <li>Tránh sử dụng thông tin cá nhân dễ đoán</li>
                  <li>Sử dụng cụm mật khẩu độc đáo</li>
                  <li>Không sử dụng cùng mật khẩu cho nhiều tài khoản</li>
                </ul>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  'Đổi Mật Khẩu'
                )}
              </button>
            </form>
          </div>

          <div className="security-info-section">
            <div className="security-card">
              <div className="security-icon">
                <Shield size={48} />
              </div>
                           <h3>Bảo Mật Tài Khoản</h3>
              <p>Mật khẩu mạnh là tuyến phòng thủ đầu tiên bảo vệ tài khoản của bạn</p>
              
              <div className="security-features">
                <div className="feature">
                  <div className="feature-icon"></div>
                  <div>
                    <h4>Mật khẩu mạnh</h4>
                    <p>Bảo vệ chống lại tấn công brute-force</p>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon"></div>
                  <div>
                    <h4>Đổi mật khẩu định kỳ</h4>
                    <p>Nên thay đổi mật khẩu 3-6 tháng/lần</p>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon"></div>
                  <div>
                    <h4>Thông báo bảo mật</h4>
                    <p>Nhận cảnh báo khi có đăng nhập mới</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h4>Lưu ý quan trọng</h4>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon success">✓</div>
                  <div>
                    <p>Mật khẩu sẽ được thay đổi ngay lập tức</p>
                    <span>Bạn sẽ cần đăng nhập lại</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon info">!</div>
                  <div>
                    <p>Đảm bảo mật khẩu mạnh</p>
                    <span>Kết hợp chữ hoa, thường, số và ký tự đặc biệt</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon warning">⚠</div>
                  <div>
                    <p>Không chia sẻ mật khẩu</p>
                    <span>Bảo mật thông tin cá nhân của bạn</span>
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