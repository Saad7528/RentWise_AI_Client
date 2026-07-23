'use strict';
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  image?: string;
  phone?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginDemo: (role: 'landlord' | 'tenant' | 'admin') => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check login status on load
  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/auth/me');
      if (res.data && res.data.user) {
        // Map backend document fields if necessary
        const u = res.data.user;
        setUser({
          id: u.id || u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          image: u.image,
          phone: u.phone,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const loginDemo = async (role: 'landlord' | 'tenant' | 'admin') => {
    try {
      setLoading(true);
      const res = await api.post('/api/auth/demo', { role });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        return res.data.user;
      }
      throw new Error('Invalid server response during demo login');
    } catch (error: any) {
      console.error('Demo login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginDemo, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
