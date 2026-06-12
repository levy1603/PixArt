import { FormEvent, useEffect, useRef, useState } from 'react';
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
  searchInput: string;
  onSearchInputChange: (q: string) => void;
  onSearchSubmit: (q?: string) => void;
  suggestions: string[];
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
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  suggestions,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!searchWrapRef.current) return;
      if (!searchWrapRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const showSuggestions =
    searchFocused && searchInput.trim().length > 0 && suggestions.length > 0;

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchSubmit();
    setSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-4 px-4">
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-md">
            <Palette size={16} className="text-white" />
          </div>
          <span className="hidden bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-xl font-bold text-transparent sm:block">
            PixArt
          </span>
        </div>

        <div ref={searchWrapRef} className="relative max-w-xl flex-1">
          <form onSubmit={handleSearch} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tác phẩm, nghệ sĩ, tag..."
              value={searchInput}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => onSearchInputChange(e.target.value)}
              className="w-full rounded-xl border border-transparent bg-gray-100 py-2 pl-9 pr-20 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-violet-300 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-violet-600"
            >
              Tìm
            </button>
          </form>

          {showSuggestions && (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
              <p className="px-2 pb-1 text-xs font-semibold text-gray-400">Gợi ý tìm kiếm</p>
              <div className="max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      onSearchInputChange(suggestion);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Search size={13} className="text-gray-400" />
                    <span className="truncate">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <nav className="hidden items-center gap-1 text-sm font-medium text-gray-600 md:flex">
          <a href="#" className="rounded-lg px-3 py-1.5 transition-colors hover:bg-violet-50 hover:text-violet-600">Khám phá</a>
          <a href="#" className="rounded-lg px-3 py-1.5 transition-colors hover:bg-violet-50 hover:text-violet-600">Theo dõi</a>
          <a href="#" className="rounded-lg px-3 py-1.5 transition-colors hover:bg-violet-50 hover:text-violet-600">Xếp hạng</a>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-3 py-1.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95"
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
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200"
            >
              <Bell size={16} className="text-gray-600" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl">
                <p className="mb-2 px-1 text-xs font-semibold text-gray-500">Thông báo</p>
                {[
                  { text: 'AkiraStudio vừa đăng tác phẩm mới', time: '2 phút trước', dot: 'bg-violet-500' },
                  { text: 'LunaCanvas đã thích tranh của bạn', time: '15 phút trước', dot: 'bg-pink-500' },
                  { text: 'Bạn có người theo dõi mới', time: '1 giờ trước', dot: 'bg-emerald-500' },
                ].map((n, i) => (
                  <div key={i} className="cursor-pointer rounded-xl p-2 transition-colors hover:bg-gray-50">
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dot}`} />
                      <div>
                        <p className="text-sm text-gray-700">{n.text}</p>
                        <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
                      </div>
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
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 transition-colors hover:from-violet-200 hover:to-pink-200"
            >
              <User size={16} className="text-violet-600" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-11 z-50 w-48 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
                <button
                  onClick={() => {
                    onOpenProfile();
                    setProfileOpen(false);
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Hồ sơ cá nhân
                </button>
                {currentUserName && <p className="px-3 py-1 text-xs text-gray-400">Đăng nhập: {currentUserName}</p>}
                <button
                  onClick={() => {
                    onOpenMyWorks();
                    setProfileOpen(false);
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Tác phẩm của tôi
                </button>
                <button
                  onClick={() => {
                    onOpenFavoriteWorks();
                    setProfileOpen(false);
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Yêu thích
                </button>
                <button
                  onClick={() => {
                    onOpenSettings();
                    setProfileOpen(false);
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cài đặt
                </button>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      onLogoutClick();
                      setProfileOpen(false);
                    }}
                    className="mt-1 w-full border-t border-gray-100 px-3 pt-2 text-left text-sm text-rose-500 transition-colors hover:bg-rose-50"
                  >
                    Đăng xuất
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onLoginClick();
                      setProfileOpen(false);
                    }}
                    className="mt-1 w-full border-t border-gray-100 px-3 pt-2 text-left text-sm text-violet-600 transition-colors hover:bg-violet-50"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200 md:hidden"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="flex gap-2 border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          {['Khám phá', 'Theo dõi', 'Xếp hạng'].map((item) => (
            <a key={item} href="#" className="flex-1 rounded-xl bg-gray-50 py-2 text-center text-sm font-medium text-gray-600 transition-colors hover:bg-violet-50 hover:text-violet-600">
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
