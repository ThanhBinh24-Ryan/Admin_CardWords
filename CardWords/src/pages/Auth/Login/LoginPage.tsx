import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../../../store/authStore';
import { authService } from '../../../services/authService';
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  KeyRound,
  Sparkles
} from 'lucide-react';
import "./Loginpage.css";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login(formData);

      // setSuccess('Đăng nhập thành công!');

      const accessToken = result.data.accessToken;
      const refreshToken = result.data.refreshToken;

      // store tokens first
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // decode token payload to check role/authorities
      const decodePayload = (token: string | null) => {
        if (!token) return null;
        try {
          const parts = token.split('.');
          if (parts.length < 2) return null;
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          return payload;
        } catch (e) {
          return null;
        }
      };

      const payload = decodePayload(accessToken);

      const hasAdminRole = (() => {
        if (!payload) return false;
        if (payload.role) {
          if (Array.isArray(payload.role)) return payload.role.includes('ROLE_ADMIN') || payload.role.includes('admin');
          return payload.role === 'ROLE_ADMIN' || payload.role === 'admin';
        }
        if (payload.roles) {
          if (Array.isArray(payload.roles)) return payload.roles.includes('ROLE_ADMIN') || payload.roles.includes('admin');
          return payload.roles === 'ROLE_ADMIN' || payload.roles === 'admin';
        }
        if (payload.authorities && Array.isArray(payload.authorities)) {
          return payload.authorities.some((a: any) => {
            if (typeof a === 'string') return a === 'ROLE_ADMIN' || a === 'admin';
            if (a && typeof a === 'object') return a.authority === 'ROLE_ADMIN' || a.authority === 'admin';
            return false;
          });
        }
        if (payload.scope && typeof payload.scope === 'string') {
          return payload.scope.split(' ').includes('ROLE_ADMIN') || payload.scope.split(' ').includes('admin');
        }
        if (payload.scopes && Array.isArray(payload.scopes)) {
          return payload.scopes.includes('ROLE_ADMIN') || payload.scopes.includes('admin');
        }
        return false;
      })();

      if (!hasAdminRole) {
        // remove tokens and show notification
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        try {
          if ((window as any).showNotification) {
            (window as any).showNotification('Tài khoản của bạn không có quyền truy cập.');
          } else {
            window.alert('Tài khoản của bạn không có quyền truy cập.');
          }
        } catch (_) {}

        // don't call authStore.login() and remain on login page
        setLoading(false);
        return;
      }

      // authorized: update auth store so ProtectedRoute and other listeners know we're authenticated
      try {
        authStore.getState().login();
      } catch (_) {
        // ignore if store not available for some reason
      }

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedEmail', formData.email);
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgotpw');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      {/* Background với floating elements */}
      <div className="login-background">
        <div className="login-floating-elements">
          <div className="floating-element element-1"><Shield size={32} /></div>
          <div className="floating-element element-2"><KeyRound size={32} /></div>
          <div className="floating-element element-3"><Sparkles size={32} /></div>
          <div className="floating-element element-4"><Lock size={32} /></div>
          <div className="floating-element element-5"><Mail size={32} /></div>
        </div>
      </div>

      <div className="login-content">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">
                <Shield size={32} />
              </div>
              <div className="logo-text">
                <h1>Welcome Back</h1>
                <p>Đăng nhập để tiếp tục</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <div className="shield-icon">
                <Lock size={48} />
              </div>
              <h2>Đăng Nhập Tài Khoản</h2>
              <p>Nhập thông tin đăng nhập của bạn</p>
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
                {success}
              </div>
            )}

            {/* Email Input */}
            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-wrapper">
              
                <input
                  className="login-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="input-group">
              <label className="input-label">Mật khẩu</label>
              <div className="input-wrapper">
            
                <input
                  className="login-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Form Options */}
            <div className="form-options">
              {/* <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                Ghi nhớ đăng nhập
              </label> */}
              <button
                type="button"
                className="forgot-password"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner">
                  <Loader2 size={18} className="spinner" />
                  Đang đăng nhập...
                </div>
              ) : (
                <div className="button-content">
                  Đăng nhập <ArrowRight size={18} />
                </div>
              )}
            </button>

       
          </form>

      
        </div>
      </div>
    </div>
  );
};

export default LoginForm;