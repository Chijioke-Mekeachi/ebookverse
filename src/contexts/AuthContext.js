// src/contexts/AuthContext.js (Multiple Dummy Users)
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Pre-defined dummy users
const DUMMY_USERS = [
  {
    id: '1',
    email: 'john@ebookverse.com',
    name: 'John Reader',
    joinedDate: '2024-01-15T10:30:00.000Z',
    avatar: '👨‍💼'
  },
  {
    id: '2', 
    email: 'sarah@ebookverse.com',
    name: 'Sarah Bookworm',
    joinedDate: '2024-02-20T14:45:00.000Z',
    avatar: '👩‍🎓'
  },
  {
    id: '3',
    email: 'alex@ebookverse.com',
    name: 'Alex Page-Turner',
    joinedDate: '2024-03-10T09:15:00.000Z',
    avatar: '🧑‍💻'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DUMMY_USERS[0]); // Start with first dummy user
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    // Find user by email or use default
    const foundUser = DUMMY_USERS.find(u => u.email === email) || DUMMY_USERS[0];
    setUser(foundUser);
    console.log('Logged in as:', foundUser.name);
    return true;
  };

  const register = async (email, password, name) => {
    // Create new user from provided details
    const newUser = {
      id: Date.now().toString(),
      email: email || `user${Date.now()}@ebookverse.com`,
      name: name || 'New Member',
      joinedDate: new Date().toISOString(),
      avatar: '👤'
    };
    setUser(newUser);
    console.log('Registered new user:', newUser.name);
    return true;
  };

  const logout = async () => {
    console.log('Logged out', user?.name);
    setUser(null);
    
    // Auto login to a different user after 1.5 seconds
    setTimeout(() => {
      const randomUser = DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)];
      setUser(randomUser);
      console.log('Auto-logged in as:', randomUser.name);
    }, 1500);
  };

  // Bonus: Method to switch between dummy users
  const switchUser = (userId) => {
    const newUser = DUMMY_USERS.find(u => u.id === userId) || DUMMY_USERS[0];
    setUser(newUser);
    console.log('Switched to user:', newUser.name);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    switchUser, // Optional: if you want to add user switching
    dummyUsers: DUMMY_USERS // Optional: expose dummy users
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};