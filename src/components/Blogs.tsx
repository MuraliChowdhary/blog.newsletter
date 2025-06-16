'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Eye, MessageCircle, Heart } from 'lucide-react';
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

export default function Blogs() {
  const [blogs, setBlogs] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
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
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Featured Article Skeleton */}
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto mb-12" />
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-96 w-full rounded-2xl mb-6" />
              <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Latest Articles Skeleton */}
          <div className="mb-12">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-card border-border">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">No blogs found</h2>
          <p className="text-muted-foreground">Check back later for new content.</p>
        </div>
      </div>
    );
  }

  const featuredPost = blogs.find(blog => blog.featured) || blogs[0];
  const regularPosts = blogs.filter(blog => blog.id !== featuredPost.id).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Featured Article */}
        <section className="mb-20">
          {/* <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Article</h2>
            <p className="text-muted-foreground">Dive into our latest insights and discoveries</p>
          </div> */}

          <Card
            className="max-w-4xl mx-auto bg-card border-border overflow-hidden cursor-pointer group hover:bg-accent/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
            onClick={() => handleReadMore(featuredPost.slug)}
          >
            <div className="relative overflow-hidden">
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span>{formatDate(featuredPost.publishedAt)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>

            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                {featuredPost.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pb-6">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                    <AvatarImage src={featuredPost.author.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {featuredPost.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{featuredPost.author.name}</p>
                    <p className="text-sm text-muted-foreground">{featuredPost.author.expertise || 'Tech Content Writer'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{featuredPost.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{featuredPost.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{featuredPost.commentsCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Latest Articles */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Latest Articles</h2>
              <p className="text-muted-foreground">Discover insights, tutorials, and thoughts on development</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {regularPosts.map((blog) => (
              <Card
                key={blog.id}
                className="bg-card border-border overflow-hidden cursor-pointer group hover:bg-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10"
                onClick={() => handleReadMore(blog.slug)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {blog.readTime} min
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="text-sm text-muted-foreground mb-2">
                    {formatDate(blog.publishedAt)}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-4">
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {blog.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground text-xs">
                        +{blog.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={blog.author.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {blog.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{blog.author.name}</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80 hover:bg-primary/10 group-hover:translate-x-1 transition-transform"
                  >
                    Read more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}