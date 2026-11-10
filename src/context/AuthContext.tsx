import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address, SavedPaymentMethod } from '../types';
import { authService } from '../services/authService';
import { mockUsers } from '../data/mockUsers';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: 'customer' | 'admin') => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  addPaymentMethod: (pm: Omit<SavedPaymentMethod, 'id'>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { success, error } = useToast();

  useEffect(() => {
    // Initialize session with current user (or default customer Alex)
    const current = authService.getCurrentUser();
    setUser(current);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await authService.login(email);
      setUser(res.data);
      success(`Welcome back, ${res.data.name}!`, 'Signed In');
      return true;
    } catch (err: any) {
      error(err.message || 'Login failed', 'Authentication Error');
      return false;
    }
  };

  const signup = async (name: string, email: string, phone: string): Promise<boolean> => {
    try {
      const res = await authService.signup(name, email, phone);
      setUser(res.data);
      success(`Welcome to Swigi, ${res.data.name}!`, 'Account Created');
      return true;
    } catch (err: any) {
      error(err.message || 'Signup failed', 'Registration Error');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    success('You have been signed out.', 'Logged Out');
  };

  const switchDemoRole = (role: 'customer' | 'admin') => {
    const target = mockUsers.find((u) => u.role === role) || mockUsers[0];
    localStorage.setItem('foodhub_session_user', JSON.stringify(target));
    setUser(target);
    success(`Switched active view to ${target.name} (${target.role.toUpperCase()})`);
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const res = await authService.updateProfile(updates);
      setUser(res.data);
      success('Profile details updated successfully');
    } catch (err: any) {
      error(err.message || 'Could not update profile');
    }
  };

  const addAddress = async (newAddr: Omit<Address, 'id'>) => {
    if (!user) return;
    const address: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };
    let updatedAddresses = [...user.savedAddresses];
    if (address.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(address);
    await updateProfile({ savedAddresses: updatedAddresses });
  };

  const deleteAddress = async (id: string) => {
    if (!user) return;
    const updatedAddresses = user.savedAddresses.filter((a) => a.id !== id);
    if (updatedAddresses.length > 0 && !updatedAddresses.some((a) => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    await updateProfile({ savedAddresses: updatedAddresses });
  };

  const setDefaultAddress = async (id: string) => {
    if (!user) return;
    const updated = user.savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    await updateProfile({ savedAddresses: updated });
  };

  const addPaymentMethod = async (newPm: Omit<SavedPaymentMethod, 'id'>) => {
    if (!user) return;
    const pm: SavedPaymentMethod = {
      ...newPm,
      id: `pm-${Date.now()}`,
    };
    let updated = [...user.paymentMethods];
    if (pm.isDefault) {
      updated = updated.map((p) => ({ ...p, isDefault: false }));
    }
    updated.push(pm);
    await updateProfile({ paymentMethods: updated });
  };

  const deletePaymentMethod = async (id: string) => {
    if (!user) return;
    const updated = user.paymentMethods.filter((p) => p.id !== id);
    if (updated.length > 0 && !updated.some((p) => p.isDefault)) {
      updated[0].isDefault = true;
    }
    await updateProfile({ paymentMethods: updated });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        switchDemoRole,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        addPaymentMethod,
        deletePaymentMethod,
      }}
    >
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

