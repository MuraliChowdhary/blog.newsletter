'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MessageCircle, MoreHorizontal, Bookmark, BookmarkCheck } from 'lucide-react';
import { Post, BlogsResponse } from '@/types/blogTypes';

async function fetchBlogs(): Promise<Post[]> {
  try {
    const response = await fetch(
      'https://backend.muralisudireddy0.workers.dev/api/v1/blog/bulk'
    );
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`);
    const json: BlogsResponse = await response.json();
    return json.data.posts;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default function MediumBlogUI() {
  const [blogs, setBlogs] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    fetchBlogs().then((res) => {
      setBlogs(res);
      setLoading(false);
    });
  }, []);

  const handleReadMore = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleBookmark = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setBookmarked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main feed */}
            <div className="lg:col-span-2 space-y-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <article key={i} className="group">
                  <div className="flex items-start space-x-3 mb-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <Skeleton className="h-6 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-20 rounded flex-shrink-0" />
                  </div>
                </article>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Staff Picks</h3>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No blogs found</h2>
          <p className="text-gray-600 text-lg">It looks like there are no blog posts yet. Check back later for new content!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {/* <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold">Medium</div>
              <nav className="hidden md:flex space-x-6">
                <button className="text-gray-600 hover:text-gray-900">Write</button>
                <button className="text-gray-600 hover:text-gray-900">Sign In</button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-green-600 text-white px-4 py-1 rounded-full text-sm hover:bg-green-700">
                Get started
              </button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Navigation tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            <button className="flex items-center space-x-2 py-4 border-b-2 border-gray-900 text-gray-900 whitespace-nowrap">
              <span>For you</span>
            </button>
            {/* <button className="flex items-center space-x-2 py-4 text-gray-600 hover:text-gray-900 whitespace-nowrap">
              <span>Following</span>
            </button>
            <button className="flex items-center space-x-2 py-4 text-gray-600 hover:text-gray-900 whitespace-nowrap">
              <span>Featured</span>
              <Badge className="bg-green-600 text-white text-xs">New</Badge>
            </button>
            <button className="py-4 text-gray-600 hover:text-gray-900 whitespace-nowrap">Goldman Sachs</button>
            <button className="py-4 text-gray-600 hover:text-gray-900 whitespace-nowrap">Typescript</button>
            <button className="py-4 text-gray-600 hover:text-gray-900 whitespace-nowrap">Web3</button>
            <button className="py-4 text-gray-600 hover:text-gray-900 whitespace-nowrap">→</button> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main feed */}
          <div className="lg:col-span-2 space-y-8">
            {blogs.map((blog) => (
              <article 
                key={blog.id} 
                className="group cursor-pointer hover:bg-gray-50 p-4 -mx-4 rounded-lg transition-colors"
                onClick={() => handleReadMore(blog.slug)}
              >
                {/* Author info */}
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={blog.author.avatar} />
                    <AvatarFallback className="bg-gray-500 text-white text-xs">
                      {blog.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-900 font-medium">{blog.author.name}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-800">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 text-base mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    
                    {/* Engagement row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{blog.likesCount}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{blog.commentsCount}</span>
                        </span>
                        <span>{blog.readTime} min read</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={(e) => toggleBookmark(e, blog.id)}
                          className="text-gray-500 hover:text-gray-900"
                        >
                          {bookmarked.has(blog.id) ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <button className="text-gray-500 hover:text-gray-900">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Staff Picks */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Staff Picks</h3>
              <div className="space-y-4">
                {blogs.slice(0, 3).map((blog) => (
                  <div key={blog.id} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={blog.author.avatar} />
                      <AvatarFallback className="bg-gray-500 text-white text-xs">
                        {blog.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {blog.title}
                      </p>
                      <p className="text-xs text-gray-500">{blog.author.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-green-600 text-sm mt-4 hover:text-green-700">
                See the full list
              </button>
            </div>

            {/* Writing on Medium */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Writing on Medium</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">New writer FAQ</a></li>
                <li><a href="#" className="hover:text-gray-900">Expert writing advice</a></li>
                <li><a href="#" className="hover:text-gray-900">Grow your readership</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}