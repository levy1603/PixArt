import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User, Bell, Shield, Save } from 'lucide-react';
import { AuthUser } from '../types';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onSaveProfile: (payload: { displayName: string; avatar: string }) => void;
}

const SETTINGS_STORAGE_KEY = 'pixart-user-settings';

type LocalSettings = {
  emailNoti: boolean;
  pushNoti: boolean;
  showMatureContent: boolean;
};

const DEFAULT_LOCAL_SETTINGS: LocalSettings = {
  emailNoti: true,
  pushNoti: true,
  showMatureContent: false,
};

export default function SettingsModal({ open, onClose, currentUser, onSaveProfile }: SettingsModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<LocalSettings>(DEFAULT_LOCAL_SETTINGS);

  useEffect(() => {
    if (!open) return;
    setDisplayName(currentUser?.displayName || '');
    setAvatar(currentUser?.avatar || '');
    setSaved(false);

    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      try {
        setSettings({ ...DEFAULT_LOCAL_SETTINGS, ...(JSON.parse(raw) as Partial<LocalSettings>) });
      } catch {
        setSettings(DEFAULT_LOCAL_SETTINGS);
      }
    } else {
      setSettings(DEFAULT_LOCAL_SETTINGS);
    }
  }, [open, currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      onSaveProfile({ displayName, avatar });
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[160] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            className="relative z-10 w-full max-w-3xl bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Cài đặt tài khoản</h2>
                <p className="text-sm text-gray-500 mt-0.5">Tùy chỉnh hồ sơ và tùy chọn cá nhân</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                aria-label="Đóng"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <section className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3 inline-flex items-center gap-2">
                  <User size={15} />
                  Hồ sơ
                </p>
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-xs text-gray-500">Tên hiển thị</span>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Nhập tên hiển thị"
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-violet-300"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-gray-500">URL ảnh đại diện</span>
                    <input
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://..."
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-violet-300"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3 inline-flex items-center gap-2">
                  <Bell size={15} />
                  Thông báo
                </p>
                <div className="space-y-2">
                  <label className="flex items-center justify-between rounded-xl bg-white border border-gray-100 px-3 py-2 text-sm text-gray-700">
                    Nhận thông báo qua email
                    <input
                      type="checkbox"
                      checked={settings.emailNoti}
                      onChange={(e) => setSettings((prev) => ({ ...prev, emailNoti: e.target.checked }))}
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-xl bg-white border border-gray-100 px-3 py-2 text-sm text-gray-700">
                    Nhận thông báo đẩy
                    <input
                      type="checkbox"
                      checked={settings.pushNoti}
                      onChange={(e) => setSettings((prev) => ({ ...prev, pushNoti: e.target.checked }))}
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3 inline-flex items-center gap-2">
                  <Shield size={15} />
                  Quyền riêng tư
                </p>
                <label className="flex items-center justify-between rounded-xl bg-white border border-gray-100 px-3 py-2 text-sm text-gray-700">
                  Hiển thị nội dung nhạy cảm
                  <input
                    type="checkbox"
                    checked={settings.showMatureContent}
                    onChange={(e) => setSettings((prev) => ({ ...prev, showMatureContent: e.target.checked }))}
                  />
                </label>
              </section>
            </div>

            <div className="px-5 pb-5 flex items-center justify-end gap-2">
              {saved && <p className="text-xs text-emerald-600 mr-auto">Đã lưu cài đặt.</p>}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-95 transition-opacity inline-flex items-center gap-1.5 disabled:opacity-70"
              >
                <Save size={14} />
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
