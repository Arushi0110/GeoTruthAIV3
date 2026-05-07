import React, { createContext, useContext, useState, useEffect } from 'react';

const UsersContext = createContext(null);

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load users from localStorage
    try {
      const savedUsers = localStorage.getItem('geotruthUsers');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
    } catch {
      setUsers([]);
    }
  }, []);

  const saveUser = (newUser) => {
    setUsers(prev => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(u => u.email === newUser.email || u.phone === newUser.phone);
      
      if (existingIndex > -1) {
        // Update existing
        updated[existingIndex] = { ...updated[existingIndex], ...newUser };
      } else {
        // Add new
        updated.unshift(newUser);
      }
      
      localStorage.setItem('geotruthUsers', JSON.stringify(updated));
      return updated;
    });
  };

  const checkUserExists = (email, phone) => {
    return users.some(u => u.email === email || u.phone === phone);
  };

  const getUserByEmail = (email) => {
    return users.find(u => u.email === email);
  };

  const deleteUser = (email) => {
    setUsers(prev => {
      const updated = prev.filter(u => u.email !== email);
      localStorage.setItem('geotruthUsers', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    users,
    saveUser,
    checkUserExists,
    getUserByEmail,
    deleteUser
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

