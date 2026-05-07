import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  try {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser({ ...parsedUser, token });
    } else {
      setUser(null);
    }
  } catch (error) {
    console.error(error);
    setUser(null);
  } finally {
    setLoading(false);
  }
}, []);

  const login = (token, userData = {}) => {
  const fullUser = {
    ...userData,
    token
  };

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(fullUser));
  setUser(fullUser);
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};