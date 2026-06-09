import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RightRail from './components/RightRail';
import FilterBar from './components/FilterBar';
import PostCard from './components/PostCard';
import PostDetailModal from './components/PostDetailModal';
import UploadModal from './components/UploadModal';
import HeroSection from './components/HeroSection';
import ProfileModal from './components/ProfileModal';
import MyWorksModal from './components/MyWorksModal';
import FavoriteWorksModal from './components/FavoriteWorksModal';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import LoadingScreen from './components/LoadingScreen';
import { mockMyFollowers, mockPosts } from './data/mockData';
import { FilterCategory, SortType } from './types';
import { useAuth } from './hooks/useAuth';
import { usePosts } from './hooks/usePosts';

const PAGE_SIZE = 12;

export default function App() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<FilterCategory>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [myWorksOpen, setMyWorksOpen] = useState(false);
  const [favoriteWorksOpen, setFavoriteWorksOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [splashElapsed, setSplashElapsed] = useState(false);

  const {
    initialized: authInitialized,
    authLoading,
    authUser,
    isAuthenticated,
    handleLogin,
    handleRegister,
    handleLogout,
    saveProfile,
  } = useAuth();

  const {
    initialized: postsInitialized,
    posts,
    selectedPost,
    selectedPostId,
    setSelectedPostId,
    handleLike,
    handleBookmark,
    handleFollowArtist,
    handleUpload,
  } = usePosts(mockPosts);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSplashElapsed(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!postsInitialized) return;
    const postId = new URLSearchParams(window.location.search).get('post');
    if (postId && posts.some((post) => post.id === postId)) {
      setSelectedPostId(postId);
    }
  }, [posts, postsInitialized, setSelectedPostId]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedPostId) {
      url.searchParams.set('post', selectedPostId);
    } else {
      url.searchParams.delete('post');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedPostId]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedTag, category, sort]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (category !== 'all') {
      result = result.filter((post) => post.category === category);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.artist.name.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.name.toLowerCase().includes(q)),
      );
    }

    if (selectedTag) {
      result = result.filter((post) => post.tags.some((tag) => tag.name === selectedTag));
    }

    if (sort === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'newest') {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sort === 'following') {
      result = result.filter((post) => post.artist.isFollowing);
    }

    return result;
  }, [category, posts, searchQuery, selectedTag, sort]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount],
  );

  const featuredPost = posts.find((post) => post.id === 'p4') || posts[0];
  const hasMorePosts = visiblePosts.length < filteredPosts.length;
  const loadingScreenOpen = !splashElapsed || !authInitialized || !postsInitialized;
  const followedCount = posts.filter((post) => post.artist.isFollowing).length;

  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4',
  }[gridCols];

  const shareUrl = useMemo(() => {
    if (!selectedPost) return window.location.href;
    const url = new URL(window.location.href);
    url.searchParams.set('post', selectedPost.id);
    return url.toString();
  }, [selectedPost]);

  const openUpload = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setUploadOpen(true);
  };

  const openProfile = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setProfileOpen(true);
  };

  const openMyWorks = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setMyWorksOpen(true);
  };

  const openFavoriteWorks = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setFavoriteWorksOpen(true);
  };

  const openSettings = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setSettingsOpen(true);
  };

  const onLogout = async () => {
    await handleLogout();
    setMyWorksOpen(false);
    setFavoriteWorksOpen(false);
    setSettingsOpen(false);
    setProfileOpen(false);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_26%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.12),transparent_22%),linear-gradient(180deg,#fbf8ff_0%,#ffffff_42%,#fff7fb_100%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute right-[-5rem] top-56 h-80 w-80 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
      </div>

      <AnimatePresence>{loadingScreenOpen && <LoadingScreen />}</AnimatePresence>

      <Navbar
        onUploadClick={openUpload}
        onOpenProfile={openProfile}
        onOpenMyWorks={openMyWorks}
        onOpenFavoriteWorks={openFavoriteWorks}
        onOpenSettings={openSettings}
        onLoginClick={() => setAuthOpen(true)}
        onLogoutClick={onLogout}
        isAuthenticated={isAuthenticated}
        currentUserName={authUser?.displayName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="relative z-10 mx-auto flex h-[calc(100vh-4rem)] w-full max-w-[90rem] items-stretch gap-6 px-4 py-8 lg:px-6">
        <Sidebar
          posts={posts}
          selectedTag={selectedTag}
          onTagClick={setSelectedTag}
          isTrendingActive={sort === 'popular'}
          isFollowingActive={sort === 'following'}
          onOpenPost={(post) => setSelectedPostId(post.id)}
          onTrendingClick={() => {
            setSort('popular');
            setSearchQuery('');
            setSelectedTag(null);
          }}
          onFollowingClick={() => {
            setSort('following');
            setSearchQuery('');
            setSelectedTag(null);
          }}
        />

        <main className="no-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto pb-10 pr-2">
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"
          >
            <div className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="max-w-3xl">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Live curation
                  </div>
                  <h2 className="font-display mt-3 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                    Home được thiết kế như một gallery cá nhân hóa.
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    Khám phá tác phẩm theo mood, category và thói quen tương tác. Mỗi khu vực
                    đều được sắp xếp để người xem đi từ cảm hứng đến hành động.
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-gray-950 p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.15)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-white/50">Focus now</p>
                  <h3 className="font-display mt-2 text-lg font-bold">Top vibes in the feed</h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                  {visiblePosts.length}/{filteredPosts.length}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {posts.slice(0, 3).map((post) => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedPostId(post.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 text-left transition-colors hover:bg-white/10"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{post.title}</p>
                      <p className="mt-0.5 text-xs text-white/55">{post.artist.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {!searchQuery && !selectedTag && featuredPost && (
            <HeroSection featuredPost={featuredPost} onViewPost={(post) => setSelectedPostId(post.id)} />
          )}

          {(searchQuery || selectedTag) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4"
            >
              <div className="flex-1">
                {searchQuery && (
                  <p className="text-sm font-semibold text-violet-800">
                    Kết quả cho: <span className="text-violet-600">"{searchQuery}"</span>
                  </p>
                )}
                {selectedTag && (
                  <p className="text-sm font-semibold text-violet-800">
                    Tag: <span className="text-violet-600">#{selectedTag}</span>
                  </p>
                )}
                <p className="mt-0.5 text-xs text-violet-500">
                  {filteredPosts.length} tác phẩm được tìm thấy
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
                className="rounded-xl bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-200"
              >
                Xóa bộ lọc
              </button>
            </motion.div>
          )}

          <FilterBar
            category={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
            gridCols={gridCols}
            onGridColsChange={setGridCols}
            totalCount={filteredPosts.length}
          />

          {visiblePosts.length > 0 ? (
            <motion.div layout className={`grid ${gridClass} gap-5`}>
              <AnimatePresence>
                {visiblePosts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onClick={(clickedPost) => setSelectedPostId(clickedPost.id)}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-4 py-24"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 text-3xl">
                🎨
              </div>
              <h3 className="font-display text-lg font-bold text-gray-700">Không tìm thấy tác phẩm</h3>
              <p className="max-w-xs text-center text-sm text-gray-400">
                Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc hiện tại
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                  setCategory('all');
                }}
                className="rounded-xl bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-600 transition-colors hover:bg-violet-200"
              >
                Xem tất cả
              </button>
            </motion.div>
          )}

          {hasMorePosts && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="rounded-2xl border-2 border-violet-200 px-6 py-3 text-sm font-semibold text-violet-600 transition-all hover:border-violet-300 hover:bg-violet-50"
              >
                Xem thêm tác phẩm
              </button>
            </div>
          )}
        </main>

        <RightRail
          posts={posts}
          onOpenPost={(post) => setSelectedPostId(post.id)}
          onPickTag={(tag) => {
            setSelectedTag(tag);
            setSearchQuery('');
          }}
        />
      </div>

      <PostDetailModal
        post={selectedPost}
        posts={posts}
        shareUrl={shareUrl}
        onClose={() => setSelectedPostId(null)}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onFollowArtist={handleFollowArtist}
        onSelectPost={(post) => setSelectedPostId(post.id)}
      />

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={(payload) =>
          handleUpload(
            payload,
            authUser
              ? {
                  id: authUser.id,
                  displayName: authUser.displayName,
                  avatar: authUser.avatar,
                }
              : null,
          )
        }
      />

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        posts={posts}
        followers={mockMyFollowers}
        currentUser={authUser}
      />

      <MyWorksModal
        open={myWorksOpen}
        onClose={() => setMyWorksOpen(false)}
        posts={posts}
        currentUser={authUser}
        onViewPost={(post) => {
          setMyWorksOpen(false);
          setSelectedPostId(post.id);
        }}
      />

      <FavoriteWorksModal
        open={favoriteWorksOpen}
        onClose={() => setFavoriteWorksOpen(false)}
        posts={posts}
        onViewPost={(post) => {
          setFavoriteWorksOpen(false);
          setSelectedPostId(post.id);
        }}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentUser={authUser}
        onSaveProfile={saveProfile}
      />

      <AuthModal
        open={authOpen}
        loading={authLoading}
        onClose={() => setAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}
