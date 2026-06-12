import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export interface HoverProfile {
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
  delayMs?: number;
  isFollowing?: boolean;
  onFollowClick?: (profile: HoverProfile) => void;
  onAvatarClick?: (profile: HoverProfile) => void;
}

const DEFAULT_HOVER_DELAY_MS = 300;
const HOVER_CARD_CLOSE_DELAY_MS = 120;

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export default function HoverAvatar({
  profile,
  src,
  alt,
  className,
  delayMs = DEFAULT_HOVER_DELAY_MS,
  isFollowing = false,
  onFollowClick,
  onAvatarClick,
}: HoverAvatarProps) {
  const [hoverCard, setHoverCard] = useState<HoverCardState | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
      }
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const clearOpenTimer = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleAvatarMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
    clearCloseTimer();
    clearOpenTimer();
    const target = e.currentTarget;

    openTimerRef.current = window.setTimeout(() => {
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
    }, delayMs);
  };

  const scheduleHideHoverCard = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setHoverCard(null);
    }, HOVER_CARD_CLOSE_DELAY_MS);
  };

  const handleAvatarMouseLeave = () => {
    clearOpenTimer();
    scheduleHideHoverCard();
  };

  const handleFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFollowClick?.(profile);
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
                className="pointer-events-auto fixed z-[180] w-64"
                style={{
                  left: hoverCard.x,
                  top: hoverCard.y,
                  transform: hoverCard.placeLeft ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
                }}
                onMouseEnter={clearCloseTimer}
                onMouseLeave={scheduleHideHoverCard}
              >
                <div className="rounded-2xl border border-white/70 bg-white/95 p-3 shadow-[0_20px_40px_rgba(15,23,42,0.22)] backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={hoverCard.profile.avatar}
                      alt={hoverCard.profile.name}
                      className="h-11 w-11 rounded-2xl border border-gray-200 bg-gray-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">{hoverCard.profile.name}</p>
                      <p className="text-xs text-violet-500">{hoverCard.profile.role}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleFollowClick}
                      className="rounded-full border border-violet-200 px-3 py-1 text-xs font-medium text-violet-600 transition hover:border-violet-300 hover:bg-violet-50"
                    >
                      {isFollowing ? 'Da theo doi' : 'Theo doi'}
                    </button>
                  </div>
                  {typeof hoverCard.profile.followers === 'number' && (
                    <p className="mt-2 text-xs text-gray-500">
                      {formatNumber(hoverCard.profile.followers)} nguoi theo doi
                    </p>
                  )}
                  {hoverCard.profile.bio && (
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{hoverCard.profile.bio}</p>
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
