import { AuthUser } from '../types';

export const AUTH_STORAGE_KEY = 'pixart-auth-user';
export const AUTH_USERS_STORAGE_KEY = 'pixart-auth-users';

export type MockAuthUser = AuthUser & {
  password: string;
};

export const DEFAULT_MOCK_AUTH_USERS: MockAuthUser[] = [
  {
    id: 'u_demo_1',
    username: 'demo',
    displayName: 'Tài khoản Demo',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Demo&backgroundColor=ffdfbf',
    followers: 120,
    following: 85,
    password: '123456',
  },
  {
    id: 'u_demo_2',
    username: 'artist',
    displayName: 'Nghệ sĩ Mẫu',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Artist&backgroundColor=b6e3f4',
    followers: 430,
    following: 210,
    password: '123456',
  },
];

export interface AuthRepository {
  loadUsers(): Promise<MockAuthUser[]>;
  saveUsers(users: MockAuthUser[]): Promise<void>;
  loadSession(): Promise<AuthUser | null>;
  saveSession(user: AuthUser | null): Promise<void>;
}

export const localAuthRepository: AuthRepository = {
  async loadUsers() {
    const rawUsers = localStorage.getItem(AUTH_USERS_STORAGE_KEY);
    if (!rawUsers) {
      localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_AUTH_USERS));
      return DEFAULT_MOCK_AUTH_USERS;
    }

    try {
      const parsedUsers = JSON.parse(rawUsers) as MockAuthUser[];
      if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
        return parsedUsers;
      }
    } catch {
      // Fall back to defaults below.
    }

    localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_AUTH_USERS));
    return DEFAULT_MOCK_AUTH_USERS;
  },

  async saveUsers(users) {
    localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(users));
  },

  async loadSession() {
    const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  },

  async saveSession(user) {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return;
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
