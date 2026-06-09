import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Post } from '../types';
import { PostRepository, localPostRepository } from '../repositories/postRepository';

interface UploadPayload {
  title: string;
  description: string;
  tags: string[];
  files: File[];
  category: Post['category'];
  isPublic: boolean;
}

export function usePosts(
  fallbackPosts: Post[],
  repository: PostRepository = localPostRepository,
) {
  const [posts, setPosts] = useState<Post[]>(fallbackPosts);
  const [initialized, setInitialized] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const storedPosts = await repository.loadPosts(fallbackPosts);
      if (!active) return;
      setPosts(storedPosts);
      setInitialized(true);
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, [fallbackPosts, repository]);

  useEffect(() => {
    if (!initialized) return;
    repository.savePosts(posts);
  }, [initialized, posts, repository]);

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];
    };
  }, []);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) || null,
    [posts, selectedPostId],
  );

  const handleLike = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  }, []);

  const handleBookmark = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              isBookmarked: !post.isBookmarked,
              bookmarks: post.isBookmarked ? post.bookmarks - 1 : post.bookmarks + 1,
            }
          : post,
      ),
    );
  }, []);

  const handleFollowArtist = useCallback((artistId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.artist.id === artistId
          ? {
              ...post,
              artist: {
                ...post.artist,
                isFollowing: !post.artist.isFollowing,
                followers: post.artist.isFollowing
                  ? post.artist.followers - 1
                  : post.artist.followers + 1,
              },
            }
          : post,
      ),
    );
  }, []);

  const handleUpload = useCallback(
    (payload: UploadPayload, currentUser: { id: string; displayName: string; avatar: string } | null) => {
      if (payload.files.length === 0) return;

      const imageUrls = payload.files.map((file) => URL.createObjectURL(file));
      blobUrlsRef.current.push(...imageUrls);

      const coverUrl = imageUrls[0];
      const newPost: Post = {
        id: `p_${Date.now()}`,
        title: payload.title,
        imageUrl: coverUrl,
        imageUrls,
        category: payload.category,
        artist: {
          id: currentUser?.id || 'me',
          name: currentUser?.displayName || 'Bạn',
          avatar:
            currentUser?.avatar ||
            'https://api.dicebear.com/7.x/adventurer/svg?seed=Me&backgroundColor=ffdfbf',
          followers: 0,
          isFollowing: false,
        },
        likes: 0,
        bookmarks: 0,
        views: 0,
        isLiked: false,
        isBookmarked: false,
        isPublic: payload.isPublic,
        tags: payload.tags.map((tag, index) => ({ id: `nt_${Date.now()}_${index}`, name: tag })),
        description: payload.description || 'Tác phẩm mới được đăng tải.',
        createdAt: new Date().toISOString().split('T')[0],
        width: 0,
        height: 0,
        isMultiPage: imageUrls.length > 1,
        pageCount: imageUrls.length > 1 ? imageUrls.length : undefined,
      };

      setPosts((prev) => [newPost, ...prev]);
    },
    [],
  );

  return {
    initialized,
    posts,
    selectedPost,
    selectedPostId,
    setSelectedPostId,
    handleLike,
    handleBookmark,
    handleFollowArtist,
    handleUpload,
  };
}
