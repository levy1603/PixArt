import { FormEvent, useMemo, useState } from 'react';

type AuthMode = 'login' | 'register';

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

interface AuthModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onLogin: (payload: LoginPayload) => Promise<void>;
  onRegister: (payload: RegisterPayload) => Promise<void>;
}

export default function AuthModal({
  open,
  loading = false,
  onClose,
  onLogin,
  onRegister,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');

  const defaultAvatar = useMemo(
    () =>
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username || 'PixArt')}&backgroundColor=ffdfbf`,
    [username],
  );

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        await onLogin({ username, password });
      } else {
        await onRegister({
          username,
          password,
          displayName,
          avatar: avatar || defaultAvatar,
        });
      }
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Xác thực thất bại';
      setError(message);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            Đóng
          </button>
        </div>

        <div className="mb-4 flex gap-2 rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              mode === 'login' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              mode === 'register' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Tên đăng nhập"
            autoComplete="username"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
          />

          {mode === 'register' && (
            <>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Tên hiển thị"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
              />
              <input
                value={avatar}
                onChange={(event) => setAvatar(event.target.value)}
                placeholder="URL ảnh đại diện (không bắt buộc)"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
              />
            </>
          )}

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mật khẩu"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
          />

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
}
