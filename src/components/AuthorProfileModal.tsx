import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, Bookmark, Eye, UserPlus, UserCheck } from 'lucide-react';
import { Artist, Post } from '../types';

interface AuthorProfileModalProps {
  open: boolean;
  artist: Artist | null;
  posts: Post[];
  onClose: () => void;
  onOpenPost: (post: Post) => void;
  onFollowArtist: (artistId: string) => void;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export default function AuthorProfileModal({
  open,
  artist,
  posts,
  onClose,
  onOpenPost,
  onFollowArtist,
}: AuthorProfileModalProps) {
  const authorPosts = useMemo(() => {
    if (!artist) return [];
    return [...posts]
      .filter((post) => post.artist.id === artist.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [artist, posts]);

  const stats = useMemo(
    () =>
      authorPosts.reduce(
        (acc, post) => ({
          likes: acc.likes + post.likes,
          bookmarks: acc.bookmarks + post.bookmarks,
          views: acc.views + post.views,
        }),
        { likes: 0, bookmarks: 0, views: 0 },
      ),
    [authorPosts],
  );

  return (
    <AnimatePresence>
      {open && artist && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[170] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-900">Hồ sơ tác giả</h2>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="h-20 w-20 rounded-2xl border border-gray-200 bg-gray-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-gray-900">{artist.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatNumber(artist.followers)} người theo dõi
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Trang cá nhân của tác giả và các tác phẩm đã đăng trên PixArt.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onFollowArtist(artist.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    artist.isFollowing
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-md'
                  }`}
                >
                  {artist.isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                  {artist.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-400">Tác phẩm</p>
                  <p className="mt-0.5 text-lg font-bold text-gray-900">{formatNumber(authorPosts.length)}</p>
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
              </div>

              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold text-gray-500">Các bài viết đã đăng</p>
                {authorPosts.length > 0 ? (
                  <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                    {authorPosts.map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => onOpenPost(post)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 p-2.5 text-left transition-colors hover:bg-gray-50"
                      >
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="h-14 w-14 rounded-xl bg-gray-100 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900">{post.title}</p>
                          <p className="mt-1 text-xs text-gray-400">{post.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-gray-400">
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
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                    Tác giả này chưa có bài viết nào.
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
