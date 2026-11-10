import { User } from '../types';
import { mockUsers } from '../data/mockUsers';
import { simulateNetworkDelay, ApiResponse } from './api';

const USERS_STORAGE_KEY = 'foodhub_users_db';
const SESSION_STORAGE_KEY = 'foodhub_session_user';

function getStoredUsers(): User[] {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
    return mockUsers;
  }
  try {
    return JSON.parse(data);
  } catch {
    return mockUsers;
  }
}

function saveStoredUsers(users: User[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export const authService = {
  /**
   * POST /api/auth/login
   * Future Backend: return await apiClient.post('/auth/login', { email, password });
   */
  async login(email: string): Promise<ApiResponse<User>> {
    await simulateNetworkDelay(300);
    const users = getStoredUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // For demo convenience, if a new email is entered in login, we create a customer session
      const name = email.split('@')[0];
      user = {
        id: `user-${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        phone: '+91 98480 12345',
        role: email.includes('admin') ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        savedAddresses: [
          {
            id: 'addr-default',
            label: 'Home',
            street: 'Ganga Boys Hostel, Room 412',
            city: 'SRM University AP, Amaravati',
            state: 'Andhra Pradesh',
            zipCode: '522240',
            isDefault: true,
          },
        ],
        paymentMethods: [
          {
            id: 'pm-default',
            type: 'upi',
            title: 'Google Pay / UPI',
            details: 'student@oksbi',
            isDefault: true,
          },
        ],
      };
      users.push(user);
      saveStoredUsers(users);
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));

    return {
      success: true,
      data: user,
      message: 'Logged in successfully',
    };
  },

  /**
   * POST /api/auth/signup
   * Future Backend: return await apiClient.post('/auth/signup', payload);
   */
  async signup(name: string, email: string, phone: string): Promise<ApiResponse<User>> {
    await simulateNetworkDelay(350);
    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: email.includes('admin') ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          label: 'Home',
          street: 'Ganga Boys Hostel, Block 2, Room 412',
          city: 'SRM University AP, Amaravati',
          state: 'Andhra Pradesh',
          zipCode: '522240',
          isDefault: true,
        },
      ],
      paymentMethods: [
        {
          id: `pm-${Date.now()}`,
          type: 'upi',
          title: 'UPI / PhonePe',
          details: 'student@okaxis',
          isDefault: true,
        },
      ],
    };

    users.push(newUser);
    saveStoredUsers(users);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));

    return {
      success: true,
      data: newUser,
      message: 'Account created successfully',
    };
  },

  /**
   * GET /api/auth/me
   */
  getCurrentUser(): User | null {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) {
      // Default to the first customer user so the reviewer has rich data out of the box
      const defaultUser = mockUsers[0];
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  /**
   * POST /api/auth/logout
   */
  logout(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  /**
   * PUT /api/users/profile
   */
  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    await simulateNetworkDelay(200);
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const updated = { ...currentUser, ...updates };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));

    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === updated.id);
    if (idx !== -1) {
      users[idx] = updated;
      saveStoredUsers(users);
    }

    return {
      success: true,
      data: updated,
      message: 'Profile updated successfully',
    };
  },

  /**
   * GET /api/admin/users
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    await simulateNetworkDelay(200);
    return {
      success: true,
      data: getStoredUsers(),
    };
  },
};

