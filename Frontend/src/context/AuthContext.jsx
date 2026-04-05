import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('mh_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (userData) => {
    localStorage.setItem('mh_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = (userData) => {
    localStorage.setItem('mh_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('mh_user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout, isLoggedIn: !!user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}