import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, Image as ImageIcon, Bookmark, Eye, CalendarDays } from 'lucide-react';
import { Post } from '../types';

interface FavoriteWorksModalProps {
  open: boolean;
  onClose: () => void;
  posts: Post[];
  onViewPost: (post: Post) => void;
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

export default function FavoriteWorksModal({ open, onClose, posts, onViewPost }: FavoriteWorksModalProps) {
  const favoritePosts = useMemo(
    () => [...posts].filter((post) => post.isLiked).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [posts],
  );

  const stats = useMemo(
    () =>
      favoritePosts.reduce(
        (acc, post) => ({
          likes: acc.likes + post.likes,
          bookmarks: acc.bookmarks + post.bookmarks,
          views: acc.views + post.views,
        }),
        { likes: 0, bookmarks: 0, views: 0 },
      ),
    [favoritePosts],
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
            className="relative z-10 w-full max-w-3xl bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Tác phẩm yêu thích</h2>
                <p className="text-sm text-gray-500 mt-0.5">{favoritePosts.length} tác phẩm đã yêu thích</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                aria-label="Đóng"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-400">Đã yêu thích</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">{formatNumber(favoritePosts.length)}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-400">Lượt thích</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">{formatNumber(stats.likes)}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-400">Lưu</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">{formatNumber(stats.bookmarks)}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-400">Lượt xem</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">{formatNumber(stats.views)}</p>
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-500 mb-2">Danh sách yêu thích</p>
              {favoritePosts.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {favoritePosts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => onViewPost(post)}
                      className="w-full text-left rounded-2xl border border-gray-100 p-2.5 flex items-center gap-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <img src={post.imageUrl} alt={post.title} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">{post.title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <CalendarDays size={11} />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1.5">
                          <span className="inline-flex items-center gap-1"><Heart size={11} />{formatNumber(post.likes)}</span>
                          <span className="inline-flex items-center gap-1"><Bookmark size={11} />{formatNumber(post.bookmarks)}</span>
                          <span className="inline-flex items-center gap-1"><Eye size={11} />{formatNumber(post.views)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                  <ImageIcon size={20} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-600">Bạn chưa có tác phẩm yêu thích</p>
                  <p className="text-xs text-gray-400 mt-1">Hãy nhấn tim ở các tác phẩm bạn thích để lưu tại đây.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
