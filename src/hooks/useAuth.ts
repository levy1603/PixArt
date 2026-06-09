import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthUser } from '../types';
import {
  AuthRepository,
  localAuthRepository,
  MockAuthUser,
} from '../repositories/authRepository';

interface RegisterPayload {
  username: string;
  displayName: string;
  avatar: string;
  password: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function toPublicUser(user: MockAuthUser): AuthUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export function useAuth(repository: AuthRepository = localAuthRepository) {
  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<MockAuthUser[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const [storedUsers, session] = await Promise.all([
        repository.loadUsers(),
        repository.loadSession(),
      ]);
      if (!active) return;
      setUsers(storedUsers);
      setAuthUser(session);
      setInitialized(true);
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, [repository]);

  const saveUsers = useCallback(
    async (nextUsers: MockAuthUser[]) => {
      setUsers(nextUsers);
      await repository.saveUsers(nextUsers);
    },
    [repository],
  );

  const saveAuthUser = useCallback(
    async (user: AuthUser | null) => {
      setAuthUser(user);
      await repository.saveSession(user);
    },
    [repository],
  );

  const handleLogin = useCallback(
    async (payload: LoginPayload) => {
      setAuthLoading(true);
      try {
        const username = normalizeUsername(payload.username);
        const password = payload.password;

        if (!username || !password) {
          throw new Error('Vui lòng nhập tên đăng nhập và mật khẩu.');
        }

        const matchedUser = users.find(
          (user) =>
            normalizeUsername(user.username) === username &&
            user.password === password,
        );

        if (!matchedUser) {
          throw new Error('Sai tên đăng nhập hoặc mật khẩu.');
        }

        await saveAuthUser(toPublicUser(matchedUser));
      } finally {
        setAuthLoading(false);
      }
    },
    [saveAuthUser, users],
  );

  const handleRegister = useCallback(
    async (payload: RegisterPayload) => {
      setAuthLoading(true);
      try {
        const username = normalizeUsername(payload.username);
        const displayName = payload.displayName.trim();
        const avatar = payload.avatar.trim();
        const password = payload.password;

        if (!username || !displayName || !password) {
          throw new Error('Vui lòng nhập đầy đủ thông tin đăng ký.');
        }

        if (!/^[a-z0-9_]{3,30}$/.test(username)) {
          throw new Error(
            'Tên đăng nhập phải từ 3-30 ký tự và chỉ gồm a-z, 0-9, _.',
          );
        }

        if (password.length < 6) {
          throw new Error('Mật khẩu phải có ít nhất 6 ký tự.');
        }

        const existed = users.some(
          (user) => normalizeUsername(user.username) === username,
        );
        if (existed) {
          throw new Error('Tên đăng nhập đã tồn tại.');
        }

        const newUser: MockAuthUser = {
          id: `u_${Date.now()}`,
          username,
          displayName,
          avatar:
            avatar ||
            `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
              displayName,
            )}&backgroundColor=ffdfbf`,
          followers: 0,
          following: 0,
          password,
        };

        const nextUsers = [newUser, ...users];
        await saveUsers(nextUsers);
        await saveAuthUser(toPublicUser(newUser));
      } finally {
        setAuthLoading(false);
      }
    },
    [saveAuthUser, saveUsers, users],
  );

  const handleLogout = useCallback(async () => {
    await saveAuthUser(null);
  }, [saveAuthUser]);

  const saveProfile = useCallback(
    async (payload: { displayName: string; avatar: string }) => {
      if (!authUser) return;

      const displayName = payload.displayName.trim();
      const avatar = payload.avatar.trim() || authUser.avatar;

      if (!displayName) {
        throw new Error('Tên hiển thị không được để trống.');
      }

      const updatedAuthUser: AuthUser = {
        ...authUser,
        displayName,
        avatar,
      };

      const updatedUsers = users.map((user) =>
        user.id === authUser.id ? { ...user, displayName, avatar } : user,
      );

      await saveUsers(updatedUsers);
      await saveAuthUser(updatedAuthUser);
    },
    [authUser, saveAuthUser, saveUsers, users],
  );

  const isAuthenticated = useMemo(() => Boolean(authUser), [authUser]);

  return {
    initialized,
    authLoading,
    authUser,
    isAuthenticated,
    handleLogin,
    handleRegister,
    handleLogout,
    saveProfile,
  };
}
