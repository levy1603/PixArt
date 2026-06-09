import { Post } from '../types';

export const POSTS_STORAGE_KEY = 'pixart-posts';

export interface PostRepository {
  loadPosts(fallbackPosts: Post[]): Promise<Post[]>;
  savePosts(posts: Post[]): Promise<void>;
}

export const localPostRepository: PostRepository = {
  async loadPosts(fallbackPosts) {
    const rawPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!rawPosts) return fallbackPosts;

    try {
      const parsedPosts = JSON.parse(rawPosts) as Post[];
      if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
        return parsedPosts.map((post) => ({
          ...post,
          category: post.category || 'illustration',
          isPublic: post.isPublic ?? true,
        }));
      }
    } catch {
      // Fall back to default data below.
    }

    return fallbackPosts;
  },

  async savePosts(posts) {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  },
};
