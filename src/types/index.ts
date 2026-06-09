export interface Artist {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  isFollowing: boolean;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Follower {
  id: string;
  name: string;
  avatar: string;
  followedAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  following: number;
}

export interface Post {
  id: string;
  title: string;
  imageUrl: string;
  imageUrls?: string[];
  category: Exclude<FilterCategory, 'all'>;
  artist: Artist;
  likes: number;
  bookmarks: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isPublic?: boolean;
  tags: Tag[];
  description: string;
  createdAt: string;
  width: number;
  height: number;
  software?: string;
  isMultiPage?: boolean;
  pageCount?: number;
}

export type FilterCategory = 'all' | 'illustration' | 'manga' | 'ugoira' | 'novel';
export type SortType = 'newest' | 'popular' | 'following';
