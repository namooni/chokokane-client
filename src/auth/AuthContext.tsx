import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../apis/apiClient';
import { clearTokens, getAccessToken, saveAccessToken } from './tokenStorage';

type LoginCredentials = { email: string; password: string };
type LoginNotice =
  { reason: 'passwordChanged'; email?: string } | { reason: 'accountDeleted' };
type AuthContextValue = {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: (notice?: LoginNotice) => void;
  loginNotice: LoginNotice | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState(() => getAccessToken());
  const [loginNotice, setLoginNotice] = useState<LoginNotice | null>(null);

  useEffect(() => {
    const handleAuthExpired = () => setAccessToken(null);
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await api<{ accessToken: string }>('/login', {
      method: 'POST',
      data: credentials,
    });
    if (!response.accessToken) throw new Error('Missing access token');
    saveAccessToken(response.accessToken);
    setLoginNotice(null);
    setAccessToken(response.accessToken);
  };

  const clearSession = (notice?: LoginNotice) => {
    setLoginNotice(notice ?? null);
    clearTokens();
    setAccessToken(null);
  };

  const logout = async () => {
    await api('/logout', {
      method: 'POST',
    });
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(accessToken),
        login,
        logout,
        clearSession,
        loginNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
