import { useState } from 'react';
import { Heart, Bookmark, Layers, ArrowUpRight } from 'lucide-react';
import { Post } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import HoverAvatar from './HoverAvatar';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onClick: (post: Post) => void;
  onOpenArtistProfile: (artistId: string) => void;
  index?: number;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export default function PostCard({
  post,
  onLike,
  onBookmark,
  onClick,
  onOpenArtistProfile,
  index = 0,
}: PostCardProps) {
  const [hovered, setHovered] = useState(false);

  const handleOpenArtistProfile = (artistId?: string) => {
    if (!artistId) return;
    onOpenArtistProfile(artistId);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.42, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(post)}
    >
      <div className="relative overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ aspectRatio: '4/3' }}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {post.isMultiPage && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            <Layers size={10} />
            <span>{post.pageCount}</span>
          </div>
        )}

        <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {post.category}
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <HoverAvatar
                  src={post.artist.avatar}
                  alt={post.artist.name}
                  className="h-8 w-8 rounded-full border border-white/30 bg-white/10"
                  profile={{
                    id: post.artist.id,
                    name: post.artist.name,
                    avatar: post.artist.avatar,
                    role: 'Nghệ sĩ',
                    followers: post.artist.followers,
                    bio: 'Tác giả của tác phẩm này',
                  }}
                  onAvatarClick={(artistProfile) => handleOpenArtistProfile(artistProfile.id)}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{post.title}</p>
                  <p className="text-xs text-white/65">{post.artist.name}</p>
                </div>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        <HoverAvatar
          src={post.artist.avatar}
          alt={post.artist.name}
          className="h-9 w-9 rounded-xl bg-gray-100 shrink-0"
          profile={{
            id: post.artist.id,
            name: post.artist.name,
            avatar: post.artist.avatar,
            role: 'Nghệ sĩ',
            followers: post.artist.followers,
            bio: 'Đang xuất hiện trong bảng feed',
          }}
          onAvatarClick={(artistProfile) => handleOpenArtistProfile(artistProfile.id)}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{post.title}</p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
            <span className="truncate">{post.artist.name}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>{formatNumber(post.views)} views</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              post.isLiked ? 'bg-rose-50 text-rose-500' : 'bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-500'
            }`}
          >
            <Heart size={12} fill={post.isLiked ? 'currentColor' : 'none'} />
            <span>{formatNumber(post.likes)}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(post.id);
            }}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              post.isBookmarked ? 'bg-amber-50 text-amber-500' : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-500'
            }`}
          >
            <Bookmark size={12} fill={post.isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
