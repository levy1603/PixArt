import { motion } from 'framer-motion';
import { Flame, Trophy, Sparkles, TimerReset, ArrowUpRight } from 'lucide-react';
import { Post } from '../types';

interface RightRailProps {
  posts: Post[];
  onOpenPost: (post: Post) => void;
  onPickTag: (tag: string) => void;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

const challenges = [
  {
    title: '7-day color study',
    description: 'Chia sẻ 1 tác phẩm mỗi ngày với cùng mood palette.',
    badge: 'Weekly challenge',
    color: 'from-violet-600 to-fuchsia-500',
  },
  {
    title: 'Tiny world prompt',
    description: 'Tạo một thế giới siêu nhỏ chỉ trong một khung hình.',
    badge: 'Community prompt',
    color: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Light & shadow',
    description: 'Một tuần thử nghiệm ánh sáng tương phản mạnh.',
    badge: 'Trending prompt',
    color: 'from-cyan-600 to-sky-500',
  },
];

export default function RightRail({ posts, onOpenPost, onPickTag }: RightRailProps) {
  const trendingPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const hotTags = [...new Set(posts.flatMap((post) => post.tags.map((tag) => tag.name)))].slice(0, 6);

  return (
    <aside className="hidden h-full w-[18rem] shrink-0 self-stretch overflow-y-auto pl-1 2xl:block no-scrollbar">
      <div className="space-y-4 pb-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                <Flame size={12} className="text-rose-500" />
                Trending
              </p>
              <h3 className="font-display mt-2 text-lg font-black text-gray-950">Hot right now</h3>
            </div>
            <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500">
              Live
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {trendingPosts.map((post, index) => (
              <button
                key={post.id}
                type="button"
                onClick={() => onOpenPost(post)}
                className="group flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-xs font-black text-white">
                  {index + 1}
                </span>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{post.title}</p>
                  <p className="truncate text-xs text-gray-500">{post.artist.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-rose-500">
                    {formatNumber(post.likes)}
                  </p>
                  <ArrowUpRight
                    size={12}
                    className="ml-auto text-gray-300 transition-transform group-hover:-translate-y-0.5 group-hover:text-violet-500"
                  />
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                <Sparkles size={12} className="text-violet-500" />
                Challenges
              </p>
              <h3 className="font-display mt-2 text-lg font-black text-gray-950">Creative prompts</h3>
            </div>
            <TimerReset size={16} className="text-gray-300" />
          </div>

          <div className="mt-4 space-y-2">
            {challenges.map((challenge) => (
              <button
                key={challenge.title}
                type="button"
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-3 text-left transition-colors hover:border-violet-200 hover:bg-violet-50/70"
              >
                <span
                  className={`inline-flex rounded-full bg-gradient-to-r ${challenge.color} px-2.5 py-1 text-[11px] font-semibold text-white`}
                >
                  {challenge.badge}
                </span>
                <p className="mt-2 text-sm font-bold text-gray-950">{challenge.title}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">{challenge.description}</p>
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        >
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-amber-500" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                Quick tags
              </p>
              <h3 className="font-display mt-1 text-lg font-black text-gray-950">Pick a vibe</h3>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {hotTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onPickTag(tag)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                #{tag}
              </button>
            ))}
          </div>
        </motion.section>
      </div>
    </aside>
  );
}
