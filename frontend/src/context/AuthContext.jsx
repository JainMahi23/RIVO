import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import authAPI from '../services/authAPI';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const res = await authAPI.me();
      setUser(res?.user || res || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('rivo:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('rivo:unauthorized', handleUnauthorized);
  }, [loadUser]);

  const login = async (identifier, password) => {
    const res = await authAPI.loginWithPassword(identifier, password);
    if (res?.token) localStorage.setItem('rivo_auth_token', res.token);
    setUser(res?.user || res);
    return res;
  };

  const verifyOtpLogin = async (mobile, otp) => {
    const res = await authAPI.verifyOtp(mobile, otp);
    if (res?.token) localStorage.setItem('rivo_auth_token', res.token);
    setUser(res?.user || res);
    return res;
  };

  const register = async (payload) => {
    const res = await authAPI.register(payload);
    if (res?.token) localStorage.setItem('rivo_auth_token', res.token);
    setUser(res?.user || res);
    return res;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('rivo_auth_token');
      setUser(null);
    }
  };

  const value = { user, loading, login, verifyOtpLogin, register, logout, refresh: loadUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
