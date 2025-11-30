import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle, Shield } from 'lucide-react';
import { authService } from '../../../services/authService';
import "./forgot.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email) {
      setError('Vui lòng nhập email');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.forgotPassword({ email });
    
      if (result.status === 'success' || result.status === '200') {
        setSuccess(result.message || 'Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn');
      } else {
        setError(result.message || 'Có lỗi xảy ra khi gửi yêu cầu');
      }

    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-container">
      {/* Background với floating elements */}
      <div className="forgot-password-background">
        <div className="forgot-password-floating-elements">
          <div className="floating-element element-1"><Mail size={32} /></div>
          <div className="floating-element element-2"><Shield size={32} /></div>
          <div className="floating-element element-3"><CheckCircle size={32} /></div>
        </div>
      </div>

      <div className="forgot-password-content">
        <div className="forgot-password-card">
          {/* Header */}
          <div className="forgot-password-header">
            <div className="forgot-password-logo">
              <div className="logo-icon">
                <Mail size={32} />
              </div>
              <div className="logo-text">
                <h1>Quên Mật Khẩu</h1>
                <p>Nhập email để khôi phục mật khẩu</p>
              </div>
            </div>
          </div>

          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <div className="shield-icon">
                <Shield size={48} />
              </div>
              <h2>Khôi Phục Mật Khẩu</h2>
              <p>Mật khẩu của bạn sẽ được gửi về Mail</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="success-message">
                <CheckCircle size={18} style={{ marginRight: '8px' }} />
                {success}
              </div>
            )}

            {/* Email Input */}
            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-wrapper">
               
                <input
                  className="forgot-password-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || !!success}
                  placeholder="Nhập email đã đăng ký"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="forgot-password-button"
              disabled={loading || !!success}
            >
              {loading ? (
                <div className="loading-spinner">
                  <Loader2 size={18} className="spinner" />
                  Đang gửi yêu cầu...
                </div>
              ) : success ? (
                <div className="button-content">
                  <CheckCircle size={18} />
                  Đã gửi thành công
                </div>
              ) : (
                <div className="button-content">
                  Khôi phục
                </div>
              )}
            </button>

            {/* Back to Login */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                className="back-to-login-button"
                onClick={handleBackToLogin}
                disabled={loading}
              >
                <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                Quay lại đăng nhập
              </button>
            </div>

            {/* Demo Info (optional) */}
            <div className="forgot-password-info">
              <p>Lưu ý:</p>
              <p>Kiểm tra hộp thư email và cả thư mục spam</p>
            </div>
          </form>

          {/* Footer */}
          <div className="forgot-password-footer">
            <p>© 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;