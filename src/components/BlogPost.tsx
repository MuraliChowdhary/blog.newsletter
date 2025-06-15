'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  BookOpen,
  Calendar,
  User,
  ThumbsUp,
  Send,
  Mail,
  ExternalLink
} from 'lucide-react';
import { Post } from '@/types/blogTypes';

interface BlogPostProps {
  slug: string;
}

async function fetchBlogPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(
      `https://backend.muralisudireddy0.workers.dev/api/v1/blog/${slug}`
    );
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export default function BlogPost({ slug }: BlogPostProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchBlogPost(slug).then((res) => {
      setPost(res);
      setLoading(false);
    });
  }, [slug]);

  const handleBack = () => {
    router.back();
  };

  const handleLike = () => {
    setLiked(!liked);
    // Here you would typically make an API call to update the like count
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      // Here you would typically make an API call to submit the comment
      setComments([...comments, {
        id: Date.now(),
        text: comment,
        author: 'Current User',
        avatar: '/default-avatar.jpg',
        createdAt: new Date().toISOString()
      }]);
      setComment('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatContent = (content: string) => {
    // Simple content formatting - you might want to use a markdown parser here
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-6 text-foreground/80 leading-relaxed text-lg">
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-24 mb-8 bg-muted" />
          <Skeleton className="h-96 w-full mb-8 rounded-2xl bg-muted" />
          <Skeleton className="h-8 w-16 mb-4 bg-muted" />
          <Skeleton className="h-12 w-3/4 mb-6 bg-muted" />
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-12 w-12 rounded-full bg-muted" />
            <div>
              <Skeleton className="h-4 w-32 mb-2 bg-muted" />
              <Skeleton className="h-3 w-24 bg-muted" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-3/4 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Post not found</h2>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          onClick={handleBack}
          variant="ghost" 
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        {/* Article Header */}
        <article className="mb-12">
          {/* Hero Image */}
          <div className="relative overflow-hidden rounded-2xl mb-8 group">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            
            {/* Newsletter Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary/90 text-primary-foreground border-0">
                <Mail className="w-3 h-3 mr-1" />
                Newsletter Featured
              </Badge>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{post.readTime} min read</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground text-lg">{post.author.name}</p>
                <p className="text-muted-foreground">{post.author.expertise || 'Newsletter Content Creator'}</p>
                <p className="text-sm text-muted-foreground">{post.author.bio || 'Passionate about sharing insights through newsletters'}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleLike}
                variant="outline"
                size="sm"
                className={liked ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400' : ''}
              >
                <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                {post.likesCount + (liked ? 1 : 0)}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="hover:bg-primary/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <Card className="mb-8 bg-muted/30 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.viewCount} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{post.likesCount} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCount} comments</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none">
            {formatContent(post.content)}
          </div>

          {/* Newsletter CTA */}
          {/* <Card className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Want more content like this?
              </h3>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter for weekly insights and cross-promotions with other creators.
              </p>
              <Button size="lg" className="mr-4">
                Subscribe Now
              </Button>
              <Button variant="outline" size="lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Archive
              </Button>
            </CardContent>
          </Card> */}
        </article>

        {/* Comments Section */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Comments ({post.commentsCount + comments.length})
          </h3>

          {/* Add Comment */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/default-avatar.jpg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="mb-4"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleCommentSubmit}
                      disabled={!comment.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {comment.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-foreground">{comment.author}</p>
                        <span className="text-muted-foreground text-sm">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-foreground/80 mb-3">{comment.text}</p>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Like
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}