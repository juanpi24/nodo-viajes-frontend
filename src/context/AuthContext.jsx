import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

// El contexto nunca se exporta.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const userData = await authApi.getMe();
          if (isMounted) setUser(userData);
        } catch {
          if (isMounted) setUser(null);
        }
      }
      if (isMounted) setLoading(false);
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook consumidor con guardia: si se usa afuera del Provider, falla explÃ­cito.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth() tiene que usarse adentro de <AuthProvider>');
  }

  return contexto;
}
