import { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Heart,
  Bookmark,
  Eye,
  Share2,
  Download,
  UserPlus,
  UserCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
  Monitor,
  Calendar,
  Sparkles,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { Post } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PostDetailModalProps {
  post: Post | null;
  posts: Post[];
  shareUrl: string;
  onClose: () => void;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onFollowArtist: (artistId: string) => void;
  onSelectPost: (post: Post) => void;
  onOpenArtistProfile: (artistId: string) => void;
}

interface CommentReply {
  id: number;
  user: string;
  avatar: string;
  mentionUser?: string;
  text: string;
  time: string;
  likes: number;
}

interface CommentItem {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  replies: CommentReply[];
}

interface ReplyTarget {
  commentId: number;
  mentionUser: string;
}

interface HoverProfile {
  id?: string;
  name: string;
  avatar: string;
  role: string;
  followers?: number;
  bio?: string;
}

interface HoverCardState {
  profile: HoverProfile;
  x: number;
  y: number;
  placeLeft: boolean;
}

interface HoverAvatarProps {
  profile: HoverProfile;
  src: string;
  alt: string;
  className: string;
  onAvatarClick?: (profile: HoverProfile) => void;
}

const AVATAR_HOVER_DELAY_MS = 300;

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

function HoverAvatar({ profile, src, alt, className, onAvatarClick }: HoverAvatarProps) {
  const [hoverCard, setHoverCard] = useState<HoverCardState | null>(null);
  const hoverTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const clearAvatarHoverTimer = () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handleAvatarMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
    clearAvatarHoverTimer();
    const target = e.currentTarget;
    hoverTimerRef.current = window.setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const popupWidth = 272;
      const gap = 12;
      const canPlaceRight = rect.right + gap + popupWidth < window.innerWidth - 12;
      setHoverCard({
        profile,
        x: canPlaceRight ? rect.right + gap : rect.left - gap,
        y: rect.top + rect.height / 2,
        placeLeft: !canPlaceRight,
      });
    }, AVATAR_HOVER_DELAY_MS);
  };

  const handleAvatarMouseLeave = () => {
    clearAvatarHoverTimer();
    setHoverCard(null);
  };

  const handleAvatarClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!onAvatarClick) return;
    e.stopPropagation();
    onAvatarClick(profile);
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className}${onAvatarClick ? ' cursor-pointer' : ''}`}
        onMouseEnter={handleAvatarMouseEnter}
        onMouseLeave={handleAvatarMouseLeave}
        onClick={handleAvatarClick}
      />
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {hoverCard && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="pointer-events-none fixed z-[180] w-64"
                style={{
                  left: hoverCard.x,
                  top: hoverCard.y,
                  transform: hoverCard.placeLeft
                    ? 'translate(-100%, -50%)'
                    : 'translate(0, -50%)',
                }}
              >
                <div className="rounded-2xl border border-white/70 bg-white/95 p-3 shadow-[0_20px_40px_rgba(15,23,42,0.22)] backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={hoverCard.profile.avatar}
                      alt={hoverCard.profile.name}
                      className="h-11 w-11 rounded-2xl border border-gray-200 bg-gray-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {hoverCard.profile.name}
                      </p>
                      <p className="text-xs text-violet-500">{hoverCard.profile.role}</p>
                    </div>
                  </div>
                  {typeof hoverCard.profile.followers === 'number' && (
                    <p className="mt-2 text-xs text-gray-500">
                      {formatNumber(hoverCard.profile.followers)} người theo dõi
                    </p>
                  )}
                  {hoverCard.profile.bio && (
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      {hoverCard.profile.bio}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

const COMMENTS: CommentItem[] = [
  {
    id: 1,
    user: 'MidnightBrush',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MidnightBrush&backgroundColor=b6e3f4',
    text: 'Tuyệt vời! Màu sắc rực rỡ quá!',
    time: '2 giờ trước',
    likes: 24,
    replies: [],
  },
  {
    id: 2,
    user: 'StarryPen',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=StarryPen&backgroundColor=ffd5dc',
    text: 'Kỹ thuật pha màu rất điêu luyện, mình học được nhiều lắm!',
    time: '5 giờ trước',
    likes: 18,
    replies: [],
  },
  {
    id: 3,
    user: 'CrystalArt',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=CrystalArt&backgroundColor=c0aede',
    text: 'Phong cách này thật độc đáo, tiếp tục cố gắng nhé!',
    time: '1 ngày trước',
    likes: 31,
    replies: [],
  },
  {
    id: 4,
    user: 'VelvetDraw',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=VelvetDraw&backgroundColor=d1f4e0',
    text: 'Detail cực kỳ ấn tượng, nhìn rất có chiều sâu!',
    time: '2 ngày trước',
    likes: 9,
    replies: [],
  },
];

export default function PostDetailModal({
  post,
  posts,
  shareUrl,
  onClose,
  onLike,
  onBookmark,
  onFollowArtist,
  onSelectPost,
  onOpenArtistProfile,
}: PostDetailModalProps) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(COMMENTS);
  const [activeReplyTarget, setActiveReplyTarget] = useState<ReplyTarget | null>(null);
  const [replyTextByComment, setReplyTextByComment] = useState<Record<number, string>>({});
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (post) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [post]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (imagePreviewOpen) {
          setImagePreviewOpen(false);
          return;
        }
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, imagePreviewOpen]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [post?.id]);

  const handleComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        user: 'Bạn',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Me&backgroundColor=ffdfbf',
        text: commentText,
        time: 'Vừa xong',
        likes: 0,
        replies: [],
      },
      ...prev,
    ]);
    setCommentText('');
  };

  const startReply = (commentId: number, mentionUser: string) => {
    setActiveReplyTarget({ commentId, mentionUser });
    setReplyTextByComment((prev) => ({
      ...prev,
      [commentId]: `@${mentionUser} `,
    }));
  };

  const handleReplySubmit = (commentId: number) => {
    const rawReplyText = (replyTextByComment[commentId] || '').trim();
    if (!rawReplyText) return;

    const mentionUser =
      activeReplyTarget?.commentId === commentId
        ? activeReplyTarget.mentionUser
        : undefined;

    let normalizedReplyText = rawReplyText;
    if (mentionUser) {
      const mentionPrefix = `@${mentionUser}`;
      if (normalizedReplyText.startsWith(mentionPrefix)) {
        normalizedReplyText = normalizedReplyText.slice(mentionPrefix.length).trim();
      }
    }

    if (!normalizedReplyText) return;

    const newReply: CommentReply = {
      id: Date.now(),
      user: 'Bạn',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Me&backgroundColor=ffdfbf',
      mentionUser,
      text: normalizedReplyText,
      time: 'Vừa xong',
      likes: 0,
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment,
      ),
    );

    setReplyTextByComment((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyTarget(null);
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        window.prompt('Sao chép liên kết bên dưới', shareUrl);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Sao chép liên kết bên dưới', shareUrl);
    }
  };

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    const tagSet = new Set(post.tags.map((t) => t.name.toLowerCase()));
    return posts
      .filter((item) => item.id !== post.id)
      .map((item) => {
        const sameTagCount = item.tags.filter((t) =>
          tagSet.has(t.name.toLowerCase()),
        ).length;
        return { item, score: sameTagCount };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || b.item.likes - a.item.likes)
      .slice(0, 4)
      .map((x) => x.item);
  }, [post, posts]);

  const suggestedArtists = useMemo(() => {
    if (!post) return [];
    const currentTagSet = new Set(post.tags.map((t) => t.name.toLowerCase()));
    const artistMap = new Map<
      string,
      {
        id: string;
        name: string;
        avatar: string;
        followers: number;
        matches: number;
        samplePost: Post;
      }
    >();

    posts.forEach((item) => {
      if (item.artist.id === post.artist.id) return;
      const matches = item.tags.filter((t) =>
        currentTagSet.has(t.name.toLowerCase()),
      ).length;
      if (matches === 0) return;

      const existed = artistMap.get(item.artist.id);
      if (!existed) {
        artistMap.set(item.artist.id, {
          id: item.artist.id,
          name: item.artist.name,
          avatar: item.artist.avatar,
          followers: item.artist.followers,
          matches,
          samplePost: item,
        });
      } else if (matches > existed.matches) {
        artistMap.set(item.artist.id, { ...existed, matches, samplePost: item });
      }
    });

    return [...artistMap.values()]
      .sort((a, b) => b.matches - a.matches || b.followers - a.followers)
      .slice(0, 3);
  }, [post, posts]);

  const postImages = useMemo(() => {
    if (!post) return [];
    if (post.imageUrls && post.imageUrls.length > 0) {
      return post.imageUrls;
    }
    return [post.imageUrl];
  }, [post]);

  const currentImage = postImages[currentImageIndex] || post?.imageUrl || '';
  const hasMultipleImages = postImages.length > 1;

  const goToPrevImage = () => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => (prev - 1 + postImages.length) % postImages.length);
  };

  const goToNextImage = () => {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => (prev + 1) % postImages.length);
  };

  const totalCommentItems = useMemo(
    () => comments.reduce((count, comment) => count + 1 + comment.replies.length, 0),
    [comments],
  );

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.10),transparent_24%),linear-gradient(180deg,rgba(249,250,251,0.98),rgba(255,255,255,0.98))]"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-white/45 backdrop-blur-[2px]" />

          <div
            className="relative z-10 mx-auto flex h-full w-full max-w-[94rem] flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header bar ── */}
            <div className="mb-4 flex flex-none items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <ArrowLeft size={15} />
                Trở lại
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleShare}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                >
                  <Share2 size={15} />
                  {copied && (
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-2 py-1 text-[11px] text-white">
                      Đã sao chép
                    </span>
                  )}
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200">
                  <Download size={15} />
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* ── Main grid ── */}
            <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              {/* Left column */}
              <section className="min-h-0 space-y-6 overflow-y-auto pr-1 no-scrollbar">
                {/* Image card */}
                <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <div
                    className="relative flex min-h-[420px] cursor-zoom-in items-center justify-center bg-gray-950/95 p-4 sm:min-h-[540px] lg:min-h-[640px]"
                    onClick={() => setImagePreviewOpen(true)}
                  >
                    <img
                      src={currentImage}
                      alt={post.title}
                      className="max-h-[78vh] w-full object-contain transition-transform duration-500"
                    />

                    {post.isMultiPage && (
                      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                        <Layers size={12} />
                        <span>{post.pageCount} trang</span>
                      </div>
                    )}

                    {hasMultipleImages && (
                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-black/55 px-2 py-2 backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToPrevImage();
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="rounded-xl px-2 text-xs text-white">
                          {currentImageIndex + 1} / {postImages.length}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToNextImage();
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Related + Suggested */}
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Related posts */}
                  <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                      Tác phẩm liên quan
                    </p>
                    {relatedPosts.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {relatedPosts.map((related) => (
                          <button
                            key={related.id}
                            type="button"
                            onClick={() => onSelectPost(related)}
                            className="overflow-hidden rounded-2xl border border-gray-100 bg-white text-left transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                          >
                            <img
                              src={related.imageUrl}
                              alt={related.title}
                              className="h-28 w-full object-cover bg-gray-100"
                            />
                            <div className="p-3">
                              <p className="truncate text-sm font-semibold text-gray-800">
                                {related.title}
                              </p>
                              <p className="truncate text-xs text-gray-400">
                                {related.artist.name}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Chưa có tác phẩm liên quan theo tag.
                      </p>
                    )}
                  </div>

                  {/* Suggested artists */}
                  <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                      Gợi ý tác giả
                    </p>
                    {suggestedArtists.length > 0 ? (
                      <div className="space-y-3">
                        {suggestedArtists.map((artist) => (
                          <div
                            key={artist.id}
                            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3"
                          >
                            <HoverAvatar
                              src={artist.avatar}
                              alt={artist.name}
                              className="h-11 w-11 rounded-2xl bg-gray-100 border border-gray-200"
                              profile={{
                                id: artist.id,
                                name: artist.name,
                                avatar: artist.avatar,
                                role: 'Nghệ sĩ gợi ý',
                                followers: artist.followers,
                                bio: `${artist.matches} tag tương đồng với tác phẩm đang xem`,
                              }}
                              onAvatarClick={(artistProfile) => {
                                if (artistProfile.id) onOpenArtistProfile(artistProfile.id);
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-900">
                                {artist.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatNumber(artist.followers)} người theo dõi •{' '}
                                {artist.matches} tag tương đồng
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onSelectPost(artist.samplePost)}
                              className="inline-flex items-center gap-1 rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-100"
                            >
                              <Sparkles size={11} />
                              Xem
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Chưa có gợi ý tác giả phù hợp.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Right column */}
              <aside className="min-h-0 min-w-0 space-y-6 overflow-y-auto pr-1 no-scrollbar">
                {/* Artwork detail card */}
                <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-500">
                        Artwork detail
                      </p>
                      <h2 className="font-display mt-2 text-3xl font-black leading-tight text-gray-950">
                        {post.title}
                      </h2>
                    </div>
                  </div>

                  {/* Artist row */}
                  <div className="flex items-center gap-3">
                    <HoverAvatar
                      src={post.artist.avatar}
                      alt={post.artist.name}
                      className="h-12 w-12 rounded-2xl bg-gray-100 border border-gray-200"
                      profile={{
                        id: post.artist.id,
                        name: post.artist.name,
                        avatar: post.artist.avatar,
                        role: 'Nghệ sĩ',
                        followers: post.artist.followers,
                        bio: 'Tác giả của tác phẩm này',
                      }}
                      onAvatarClick={(artistProfile) => {
                        if (artistProfile.id) onOpenArtistProfile(artistProfile.id);
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{post.artist.name}</p>
                      <p className="text-xs text-gray-400">
                        {formatNumber(post.artist.followers)} người theo dõi
                      </p>
                    </div>
                    <button
                      onClick={() => onFollowArtist(post.artist.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        post.artist.isFollowing
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-md'
                      }`}
                    >
                      {post.artist.isFollowing ? (
                        <UserCheck size={13} />
                      ) : (
                        <UserPlus size={13} />
                      )}
                      {post.artist.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onLike(post.id)}
                      className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-semibold transition-all ${
                        post.isLiked
                          ? 'border border-rose-200 bg-rose-50 text-rose-500'
                          : 'border border-gray-100 bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                      }`}
                    >
                      <Heart size={15} fill={post.isLiked ? 'currentColor' : 'none'} />
                      <span>{formatNumber(post.likes)}</span>
                    </button>

                    <button
                      onClick={() => onBookmark(post.id)}
                      className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-semibold transition-all ${
                        post.isBookmarked
                          ? 'border border-amber-200 bg-amber-50 text-amber-500'
                          : 'border border-gray-100 bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-amber-500'
                      }`}
                    >
                      <Bookmark size={15} fill={post.isBookmarked ? 'currentColor' : 'none'} />
                      <span>{formatNumber(post.bookmarks)}</span>
                    </button>

                    <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
                      <Eye size={14} />
                      <span>{formatNumber(post.views)}</span>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="mt-5 grid gap-3 border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Monitor size={14} className="text-gray-400" />
                      <span>{post.software || 'Unknown software'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{post.createdAt}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {post.width} × {post.height}px
                    </div>
                  </div>
                </div>

                {/* Description + tags */}
                <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                    Mô tả
                  </p>
                  <p className="text-sm leading-7 text-gray-600">{post.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                      Comments
                    </p>
                    <span className="text-xs text-gray-400">{totalCommentItems} bình luận</span>
                  </div>

                  {/* Comment input */}
                  <div className="mb-4 flex gap-2">
                    <HoverAvatar
                      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Me&backgroundColor=ffdfbf"
                      alt="me"
                      className="h-8 w-8 rounded-full bg-gray-100 shrink-0"
                      profile={{
                        name: 'Bạn',
                        avatar:
                          'https://api.dicebear.com/7.x/adventurer/svg?seed=Me&backgroundColor=ffdfbf',
                        role: 'Người dùng',
                        bio: 'Đăng nhập với vai trò người xem',
                      }}
                    />
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                        placeholder="Viết bình luận..."
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pr-16 text-sm outline-none transition-all placeholder-gray-400 focus:border-violet-300 focus:bg-white"
                      />
                      <button
                        onClick={handleComment}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-violet-500 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-violet-600"
                      >
                        Gửi
                      </button>
                    </div>
                  </div>

                  {/* Comment list */}
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-2xl border border-gray-100 bg-gray-50 p-3"
                      >
                        <div className="flex gap-2.5">
                          <HoverAvatar
                            src={c.avatar}
                            alt={c.user}
                            className="h-8 w-8 rounded-full bg-gray-100 shrink-0"
                            profile={{
                              name: c.user,
                              avatar: c.avatar,
                              role: 'Thành viên cộng đồng',
                              bio: 'Đã tham gia bình luận trong tác phẩm này',
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-700">
                                {c.user}
                              </span>
                              <span className="text-xs text-gray-400">{c.time}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-gray-600">{c.text}</p>
                            <div className="mt-2 flex items-center gap-3">
                              <button className="inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-rose-400">
                                <Heart size={10} />
                                <span>{c.likes}</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    activeReplyTarget?.commentId === c.id &&
                                    activeReplyTarget?.mentionUser === c.user
                                  ) {
                                    setActiveReplyTarget(null);
                                    setReplyTextByComment((prev) => ({
                                      ...prev,
                                      [c.id]: '',
                                    }));
                                  } else {
                                    startReply(c.id, c.user);
                                  }
                                }}
                                className="inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-violet-500"
                              >
                                <MessageCircle size={10} />
                                <span>Trả lời</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Reply input */}
                        {activeReplyTarget?.commentId === c.id && (
                          <div className="mt-3 ml-10 flex gap-2">
                            <HoverAvatar
                              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Me&backgroundColor=ffdfbf"
                              alt="me"
                              className="h-7 w-7 rounded-full bg-gray-100 shrink-0"
                              profile={{
                                name: 'Bạn',
                                avatar:
                                  'https://api.dicebear.com/7.x/adventurer/svg?seed=Me&backgroundColor=ffdfbf',
                                role: 'Người dùng',
                                bio: 'Đang phản hồi bình luận',
                              }}
                            />
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={replyTextByComment[c.id] || ''}
                                onChange={(e) =>
                                  setReplyTextByComment((prev) => ({
                                    ...prev,
                                    [c.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) =>
                                  e.key === 'Enter' && handleReplySubmit(c.id)
                                }
                                placeholder={`Trả lời @${activeReplyTarget.mentionUser}...`}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 pr-16 text-xs outline-none transition-all placeholder-gray-400 focus:border-violet-300"
                              />
                              <button
                                onClick={() => handleReplySubmit(c.id)}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-violet-500 px-2 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-violet-600"
                              >
                                Gửi
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replies list */}
                        {c.replies.length > 0 && (
                          <div className="mt-3 ml-10 border-l border-gray-200 pl-3 space-y-2">
                            {c.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2"
                              >
                                <HoverAvatar
                                  src={reply.avatar}
                                  alt={reply.user}
                                  className="h-6 w-6 rounded-full bg-gray-100 shrink-0"
                                  profile={{
                                    name: reply.user,
                                    avatar: reply.avatar,
                                    role: 'Thành viên cộng đồng',
                                    bio: reply.mentionUser
                                      ? `Đang phản hồi @${reply.mentionUser}`
                                      : 'Đã tham gia thảo luận',
                                  }}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="mb-0.5 flex items-center gap-2">
                                    <span className="text-[11px] font-semibold text-gray-700">
                                      {reply.user}
                                    </span>
                                    <span className="text-[11px] text-gray-400">
                                      {reply.time}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    {reply.mentionUser && (
                                      <span className="font-semibold text-violet-600 mr-1">
                                        @{reply.mentionUser}
                                      </span>
                                    )}
                                    {reply.text}
                                  </p>
                                  <button
                                    onClick={() => startReply(c.id, reply.user)}
                                    className="mt-1 inline-flex items-center gap-1 text-[11px] text-gray-400 transition-colors hover:text-violet-500"
                                  >
                                    <MessageCircle size={10} />
                                    <span>Trả lời</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            {/* ── Fullscreen image preview ── */}
            <AnimatePresence>
              {imagePreviewOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreviewOpen(false);
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="relative flex h-full w-full items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setImagePreviewOpen(false)}
                      className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/55 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-black/70"
                      aria-label="Đóng xem ảnh"
                    >
                      <X size={14} />
                    </button>

                    <img
                      src={currentImage}
                      alt={post.title}
                      className="max-h-[86vh] max-w-full object-contain"
                    />

                    {hasMultipleImages && (
                      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl border border-white/20 bg-black/55 px-2.5 py-1.5 backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={goToPrevImage}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
                          aria-label="Ảnh trước"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-xs text-white">
                          {currentImageIndex + 1} / {postImages.length}
                        </span>
                        <button
                          type="button"
                          onClick={goToNextImage}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
                          aria-label="Ảnh tiếp theo"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/20 bg-black/55 p-2 backdrop-blur-sm">
                      <button
                        onClick={() => onLike(post.id)}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                          post.isLiked
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/15 text-white hover:bg-rose-500'
                        }`}
                      >
                        <Heart size={15} fill={post.isLiked ? 'currentColor' : 'none'} />
                        <span>Yêu thích</span>
                      </button>
                      <button
                        onClick={() => onBookmark(post.id)}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                          post.isBookmarked
                            ? 'bg-amber-500 text-white'
                            : 'bg-white/15 text-white hover:bg-amber-500'
                        }`}
                      >
                        <Bookmark size={15} fill={post.isBookmarked ? 'currentColor' : 'none'} />
                        <span>Lưu</span>
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
