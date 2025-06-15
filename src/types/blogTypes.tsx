// types/blog.ts
export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  expertise?: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  slug: string;
  tags: string[];
  readTime: number;
  viewCount: number;
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  commentsCount: number;
  likesCount: number;
  author: Author;
}

export interface BlogsResponse {
  data: {
    posts: Post[];
  };
}