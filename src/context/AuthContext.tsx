// app/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react'; // ✅ removed useEffect

interface AuthUser {
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: false,
});

function getInitialUser(): AuthUser | null {
  if (typeof window === 'undefined') return null; // SSR guard
  const token = localStorage.getItem('access_token');
  return token ? { token } : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser); // ✅ lazy init
  const [loading, setLoading] = useState<boolean>(false);

  const login = (token: string) => {
    localStorage.setItem('access_token', token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);