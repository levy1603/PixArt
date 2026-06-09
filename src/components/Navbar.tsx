import { useState } from 'react';
import { Search, Bell, Upload, User, Palette, Menu, X } from 'lucide-react';

interface NavbarProps {
  onUploadClick: () => void;
  onOpenProfile: () => void;
  onOpenMyWorks: () => void;
  onOpenFavoriteWorks: () => void;
  onOpenSettings: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  isAuthenticated: boolean;
  currentUserName?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Navbar({
  onUploadClick,
  onOpenProfile,
  onOpenMyWorks,
  onOpenFavoriteWorks,
  onOpenSettings,
  onLoginClick,
  onLogoutClick,
  isAuthenticated,
  currentUserName,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-md">
            <Palette size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent hidden sm:block">
            PixArt
          </span>
        </div>

        <div className="flex-1 max-w-xl relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tác phẩm, nghệ sĩ, tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 text-sm text-gray-800 placeholder-gray-400 border border-transparent focus:border-violet-300 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600">
          <a href="#" className="px-3 py-1.5 rounded-lg hover:bg-violet-50 hover:text-violet-600 transition-colors">Khám phá</a>
          <a href="#" className="px-3 py-1.5 rounded-lg hover:bg-violet-50 hover:text-violet-600 transition-colors">Theo dõi</a>
          <a href="#" className="px-3 py-1.5 rounded-lg hover:bg-violet-50 hover:text-violet-600 transition-colors">Xếp hạng</a>
        </nav>

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Upload size={14} />
            <span className="hidden sm:block">Đăng tải</span>
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              className="relative w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Bell size={16} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50">
                <p className="text-xs font-semibold text-gray-500 mb-2 px-1">Thông báo</p>
                {[
                  { text: 'AkiraStudio vừa đăng tác phẩm mới', time: '2 phút trước', dot: 'bg-violet-500' },
                  { text: 'LunaCanvas đã thích tranh của bạn', time: '15 phút trước', dot: 'bg-pink-500' },
                  { text: 'Bạn có người theo dõi mới', time: '1 giờ trước', dot: 'bg-emerald-500' },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                    <div>
                      <p className="text-sm text-gray-700">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 hover:from-violet-200 hover:to-pink-200 flex items-center justify-center transition-colors"
            >
              <User size={16} className="text-violet-600" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-11 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50">
                <button
                  onClick={() => {
                    onOpenProfile();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hồ sơ cá nhân
                </button>
                {currentUserName && <p className="px-3 py-1 text-xs text-gray-400">Đăng nhập: {currentUserName}</p>}
                <button
                  onClick={() => {
                    onOpenMyWorks();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Tác phẩm của tôi
                </button>
                <button
                  onClick={() => {
                    onOpenFavoriteWorks();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Yêu thích
                </button>
                <button
                  onClick={() => {
                    onOpenSettings();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cài đặt
                </button>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      onLogoutClick();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm text-rose-500 mt-1 border-t border-gray-100 pt-2 hover:bg-rose-50 transition-colors"
                  >
                    Đăng xuất
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onLoginClick();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm text-violet-600 mt-1 border-t border-gray-100 pt-2 hover:bg-violet-50 transition-colors"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors md:hidden"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex gap-2">
          {['Khám phá', 'Theo dõi', 'Xếp hạng'].map((item) => (
            <a key={item} href="#" className="flex-1 text-center py-2 rounded-xl bg-gray-50 text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-colors">
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
