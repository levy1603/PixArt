import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Heart, Bookmark, Eye, Users } from 'lucide-react';
import { AuthUser, Follower, Post } from '../types';
import HoverAvatar from './HoverAvatar';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  posts: Post[];
  followers: Follower[];
  currentUser: AuthUser | null;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
}

export default function ProfileModal({
  open,
  onClose,
  posts,
  followers,
  currentUser,
}: ProfileModalProps) {
  const [showFollowers, setShowFollowers] = useState(false);

  const myPosts = useMemo(() => {
    if (!currentUser) return [];
    return posts.filter((post) => post.artist.id === currentUser.id);
  }, [currentUser, posts]);

  const stats = useMemo(
    () =>
      myPosts.reduce(
        (acc, post) => ({
          likes: acc.likes + post.likes,
          bookmarks: acc.bookmarks + post.bookmarks,
          views: acc.views + post.views,
        }),
        { likes: 0, bookmarks: 0, views: 0 },
      ),
    [myPosts],
  );

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
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-900">Hồ sơ cá nhân</h2>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <HoverAvatar
                  src={
                    currentUser?.avatar ||
                    'https://api.dicebear.com/7.x/adventurer/svg?seed=Me&backgroundColor=ffdfbf'
                  }
                  alt={currentUser?.displayName || 'Bạn'}
                  className="h-20 w-20 rounded-2xl border border-gray-200 bg-gray-100"
                  profile={{
                    name: currentUser?.displayName || 'Bạn',
                    avatar:
                      currentUser?.avatar ||
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Me&backgroundColor=ffdfbf',
                    role: 'Tài khoản của bạn',
                    bio: 'Digital artist profile',
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-gray-900">{currentUser?.displayName || 'Bạn'}</p>
                  <p className="text-sm text-gray-400">@{currentUser?.username || 'me'}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Digital artist. Chia sẻ minh họa, concept art và các study hằng ngày.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-400">Tác phẩm</p>
                  <p className="mt-0.5 text-lg font-bold text-gray-900">{formatNumber(myPosts.length)}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-400">Lượt thích</p>
                  <p className="mt-0.5 text-lg font-bold text-gray-900">{formatNumber(stats.likes)}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-400">Bookmark</p>
                  <p className="mt-0.5 text-lg font-bold text-gray-900">{formatNumber(stats.bookmarks)}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-400">Lượt xem</p>
                  <p className="mt-0.5 text-lg font-bold text-gray-900">{formatNumber(stats.views)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFollowers((prev) => !prev)}
                  className="rounded-2xl border border-violet-100 bg-violet-50 px-3 py-3 text-left transition-colors hover:bg-violet-100"
                >
                  <p className="text-xs text-violet-500">Người theo dõi</p>
                  <p className="mt-0.5 text-lg font-bold text-violet-700">{formatNumber(followers.length)}</p>
                  <p className="mt-1 text-[11px] text-violet-500">
                    {showFollowers ? 'Ẩn danh sách' : 'Bấm để xem danh sách'}
                  </p>
                </button>
              </div>

              <div className={`mt-6 grid grid-cols-1 gap-4 ${showFollowers ? 'lg:grid-cols-2' : ''}`}>
                <div className={showFollowers ? '' : 'lg:max-w-xl'}>
                  <p className="mb-2 text-xs font-semibold text-gray-500">Tác phẩm của tôi</p>
                  {myPosts.length > 0 ? (
                    <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                      {myPosts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center gap-2.5 rounded-2xl border border-gray-100 p-2.5 transition-colors hover:bg-gray-50"
                        >
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="h-14 w-14 rounded-xl bg-gray-100 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-800">{post.title}</p>
                            <div className="mt-1 flex items-center gap-2.5 text-xs text-gray-400">
                              <span className="inline-flex items-center gap-1">
                                <Heart size={11} />
                                {formatNumber(post.likes)}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Bookmark size={11} />
                                {formatNumber(post.bookmarks)}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Eye size={11} />
                                {formatNumber(post.views)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                      <ImageIcon size={20} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm font-semibold text-gray-600">Bạn chưa có tác phẩm nào</p>
                      <p className="mt-1 text-xs text-gray-400">
                        Hãy bấm nút "Đăng tải" để chia sẻ tác phẩm đầu tiên.
                      </p>
                    </div>
                  )}
                </div>

                {showFollowers && (
                  <div>
                    <p className="mb-2 text-xs font-semibold text-gray-500">Danh sách người theo dõi</p>
                    {followers.length > 0 ? (
                      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                        {followers.map((follower) => (
                          <div
                            key={follower.id}
                            className="flex items-center gap-2.5 rounded-2xl border border-gray-100 p-2.5 transition-colors hover:bg-gray-50"
                          >
                            <HoverAvatar
                              src={follower.avatar}
                              alt={follower.name}
                              className="h-10 w-10 rounded-xl border border-gray-200 bg-gray-100 object-cover"
                              profile={{
                                name: follower.name,
                                avatar: follower.avatar,
                                role: 'Người theo dõi',
                                bio: `Theo dõi từ ${formatDate(follower.followedAt)}`,
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-800">{follower.name}</p>
                              <p className="text-xs text-gray-400">Theo dõi từ {formatDate(follower.followedAt)}</p>
                            </div>
                            <Users size={14} className="text-violet-500" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                        <Users size={20} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-semibold text-gray-600">Bạn chưa có người theo dõi</p>
                        <p className="mt-1 text-xs text-gray-400">
                          Khi có người theo dõi, danh sách sẽ hiển thị tại đây.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
