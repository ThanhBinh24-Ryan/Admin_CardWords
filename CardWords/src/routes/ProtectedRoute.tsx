import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import authStore from '../store/authStore';

function isTokenExpired(token?: string | null) {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return true;
    // exp is in seconds
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
}

export default function ProtectedRoute({ children }: React.PropsWithChildren<{}>) {
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const expired = isTokenExpired(token);

  useEffect(() => {
    if (expired) {
      // Clear auth state and tokens
      try {
        authStore.getState().logout();
      } catch (_) {}

      // Notify user and redirect to login
      try {
        // Prefer non-blocking UI notification if available — fallback to alert
        if ((window as any).showNotification) {
          (window as any).showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else {
          window.alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        }
      } catch (_) {
        // ignore
      }

      navigate('/login', { state: { from: location }, replace: true });
    } else if (!isAuthenticated && token) {
      // token exists and not expired but store maybe not synced — sync it
      const sync = authStore.getState().syncFromStorage;
      if (sync) sync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  if (!isAuthenticated && (!token || expired)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
