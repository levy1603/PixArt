import { ArrowRight, Palette, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Post } from '../types';
import HoverAvatar from './HoverAvatar';

interface HeroSectionProps {
  featuredPost: Post;
  onViewPost: (post: Post) => void;
  onOpenArtistProfile: (artistId: string) => void;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export default function HeroSection({
  featuredPost,
  onViewPost,
  onOpenArtistProfile,
}: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_24px_80px_rgba(139,92,246,0.12)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_34%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.08),transparent_30%)]" />
      </div>

      <div className="relative grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="p-6 sm:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700"
          >
            <Sparkles size={11} />
            Editorial pick
          </motion.div>

          <div className="mt-5 max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="font-display text-3xl font-black leading-[0.95] tracking-tight text-gray-950 sm:text-5xl"
            >
              Một Ngôi nhà cho
              <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
                tác phẩm có câu chuyện.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="mt-4 max-w-lg text-sm leading-7 text-gray-600 sm:text-base"
            >
              Khám phá những tác phẩm nổi bật, theo dõi quá trình sáng tạo và mở rộng
              portfolio theo phong cách của riêng bạn.
            </motion.p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              onClick={() => onViewPost(featuredPost)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-950/10 transition-transform hover:-translate-y-0.5"
            >
              Khám phá tác phẩm nổi bật
              <ArrowRight size={15} />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700"
            >
              <Palette size={15} className="text-violet-500" />
              Curation by mood
            </motion.div>
          </div>

          <div className="mt-7 grid max-w-lg grid-cols-3 gap-3">
            {[
              { label: 'Tác phẩm', value: '12k+' },
              { label: 'Artist', value: '1.4k' },
              { label: 'Lượt xem', value: '8.2M' },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.24 + (item.label === 'Tác phẩm' ? 0 : item.label === 'Artist' ? 0.05 : 0.1),
                }}
                className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400">{item.label}</p>
                <p className="font-display mt-1 text-xl font-black text-gray-950">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {featuredPost.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="relative border-t border-gray-100 lg:border-l lg:border-t-0">
          <button
            onClick={() => onViewPost(featuredPost)}
            className="group relative block h-full w-full overflow-hidden text-left"
          >
            <img
              src={featuredPost.imageUrl}
              alt={featuredPost.title}
              className="h-full min-h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/35 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/70">
                <TrendingUp size={12} />
                Featured on home
              </div>
              <h2 className="font-display mt-3 text-2xl font-black leading-tight">{featuredPost.title}</h2>
              <div className="mt-3 flex items-center gap-2 text-sm text-white/75">
                <HoverAvatar
                  src={featuredPost.artist.avatar}
                  alt={featuredPost.artist.name}
                  className="h-8 w-8 rounded-full border border-white/30 bg-white/10"
                  profile={{
                    id: featuredPost.artist.id,
                    name: featuredPost.artist.name,
                    avatar: featuredPost.artist.avatar,
                    role: 'Nghệ sĩ nổi bật',
                    followers: featuredPost.artist.followers,
                    bio: 'Được chọn trong khu vực featured',
                  }}
                  onAvatarClick={(artistProfile) => {
                    if (artistProfile.id) onOpenArtistProfile(artistProfile.id);
                  }}
                />
                <span>{featuredPost.artist.name}</span>
                <span className="text-white/40">•</span>
                <span>{formatNumber(featuredPost.views)} views</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="absolute right-4 top-4 flex flex-col gap-2"
            >
              {featuredPost.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md"
                >
                  #{tag.name}
                </span>
              ))}
            </motion.div>
          </button>
        </div>
      </div>
    </motion.section>
  );
}
