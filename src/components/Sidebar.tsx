import { TrendingUp, Compass, Star, Users, Bookmark, Hash, Flame, Heart } from 'lucide-react';
import { popularTags } from '../data/mockData';
import { Post } from '../types';
import HoverAvatar from './HoverAvatar';

interface SidebarProps {
  posts: Post[];
  selectedTag: string | null;
  onTagClick: (tag: string | null) => void;
  onTrendingClick: () => void;
  isTrendingActive: boolean;
  onFollowingClick: () => void;
  isFollowingActive: boolean;
  onOpenPost: (post: Post) => void;
}

const topArtists = [
  {
    name: 'NightInkArt',
    followers: '210k',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=NightInkArt&backgroundColor=d1f4e0',
    isFollowing: false,
  },
  {
    name: 'AkiraStudio',
    followers: '128k',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AkiraStudio&backgroundColor=b6e3f4',
    isFollowing: true,
  },
  {
    name: 'LunaCanvas',
    followers: '83k',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LunaCanvas&backgroundColor=ffdfbf',
    isFollowing: false,
  },
  {
    name: 'SolarPainter',
    followers: '67k',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=SolarPainter&backgroundColor=ffd5dc',
    isFollowing: true,
  },
];

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export default function Sidebar({
  posts,
  selectedTag,
  onTagClick,
  onTrendingClick,
  isTrendingActive,
  onFollowingClick,
  isFollowingActive,
  onOpenPost,
}: SidebarProps) {
  const trendingPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 4);

  return (
    <aside className="hidden h-full w-60 shrink-0 self-stretch overflow-y-auto pr-1 lg:block no-scrollbar">
      <div className="space-y-4 pb-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>
          {[
            { icon: Compass, label: 'Khám phá', active: !isTrendingActive && !isFollowingActive },
            { icon: TrendingUp, label: 'Thịnh hành', active: isTrendingActive, onClick: onTrendingClick },
            { icon: Users, label: 'Đang theo dõi', active: isFollowingActive, onClick: onFollowingClick },
            { icon: Star, label: 'Xếp hạng', active: false },
            { icon: Bookmark, label: 'Đã lưu', active: false },
          ].map(({ icon: Icon, label, active, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active ? 'bg-violet-50 text-violet-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon size={16} className={active ? 'text-violet-500' : 'text-gray-400'} />
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Flame size={14} className="text-rose-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Thịnh hành hôm nay
            </p>
          </div>
          <div className="space-y-2">
            {trendingPosts.map((post, index) => (
              <button
                key={post.id}
                type="button"
                onClick={() => onOpenPost(post)}
                className="flex w-full items-center gap-2.5 rounded-xl border border-gray-100 p-1.5 text-left transition-colors hover:bg-gray-50"
              >
                <span className="w-4 text-center text-xs font-bold text-gray-300">{index + 1}</span>
                <img src={post.imageUrl} alt={post.title} className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-700">{post.title}</p>
                  <p className="truncate text-[11px] text-gray-400">{post.artist.name}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] text-rose-500">
                  <Heart size={10} />
                  {formatNumber(post.likes)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Hash size={14} className="text-violet-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tags phổ biến
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(selectedTag === tag ? null : tag)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-violet-500 text-white shadow-sm'
                    : 'border border-gray-100 bg-gray-50 text-gray-500 hover:bg-violet-50 hover:text-violet-600'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Star size={14} className="text-amber-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Nghệ sĩ nổi bật
            </p>
          </div>
          <div className="space-y-2">
            {topArtists.map((artist, index) => (
              <div
                key={artist.name}
                className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-gray-50"
              >
                <span className="w-4 text-center text-xs font-bold text-gray-300">{index + 1}</span>
                <HoverAvatar
                  src={artist.avatar}
                  alt={artist.name}
                  className="h-8 w-8 rounded-xl bg-gray-100"
                  profile={{
                    name: artist.name,
                    avatar: artist.avatar,
                    role: 'Nghệ sĩ nổi bật',
                    bio: `${artist.followers} người theo dõi`,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-700">{artist.name}</p>
                  <p className="text-xs text-gray-400">{artist.followers} followers</p>
                </div>
                <button
                  className={`rounded-full px-2 py-0.5 text-xs font-medium transition-all ${
                    artist.isFollowing
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                  }`}
                >
                  {artist.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-2">
          <p className="text-center text-xs text-gray-300">© 2026 PixArt · Điều khoản · Chính sách</p>
        </div>
      </div>
    </aside>
  );
}
