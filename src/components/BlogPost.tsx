

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/blogTypes';

// UI and Icon Imports (keep all of these)
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  Send,
  Mail,
  ExternalLink
} from 'lucide-react';

// The props interface now expects the fully resolved 'post' object.
interface BlogPostProps {
  post: Post;
}

// Renamed to BlogPostClient to be clear about its role.
export default function BlogPostClient({ post }: BlogPostProps) {
  // State for client-side interactions remains here.
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]); // Assuming a shape for client-side comments
  const router = useRouter();

  // All your handler functions remain unchanged as they handle client-side logic.
  const handleBack = () => {
    router.back();
  };

  const handleLike = () => {
    setLiked(!liked);
    // API call to update like count would go here.
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, {
        id: Date.now(),
        text: comment,
        author: 'Current User', // This would come from auth state
        avatar: '/default-avatar.jpg',
        createdAt: new Date().toISOString()
      }]);
      setComment('');
      // API call to submit comment would go here.
    }
  };

  // All your formatting utility functions also remain unchanged.
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-6 text-foreground/80 leading-relaxed text-lg">
        {paragraph}
      </p>
    ));
  };

  // The loading and "post not found" states are GONE because the parent server component handles them.
  // The JSX can now directly use the 'post' prop without any checks.

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        <article className="mb-12">
          <div className="relative overflow-hidden rounded-2xl mb-8 group">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary/90 text-primary-foreground border-0">
                <Mail className="w-3 h-3 mr-1" />
                Newsletter Featured
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{post.readTime} min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

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
                <p className="text-muted-foreground">{post.author.expertise || 'Content Creator'}</p>
              </div>
            </div>

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
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="hover:bg-primary/20 transition-colors">
                {tag}
              </Badge>
            ))}
          </div>

          <Card className="mb-8 bg-muted/30 border-border/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Eye className="w-4 h-4" /><span>{post.viewCount} views</span></div>
                <div className="flex items-center gap-2"><Heart className="w-4 h-4" /><span>{post.likesCount} likes</span></div>
                <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /><span>{post.commentsCount} comments</span></div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /><span>{post.readTime} min read</span></div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none">
            {formatContent(post.content)}
          </div>
        </article>

        <section className="mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Comments ({post.commentsCount + comments.length})
          </h3>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10"><AvatarImage src="/default-avatar.jpg" /><AvatarFallback><User className="w-4 h-4" /></AvatarFallback></Avatar>
                <div className="flex-1">
                  <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." className="mb-4" rows={3} />
                  <div className="flex justify-end">
                    <Button onClick={handleCommentSubmit} disabled={!comment.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {comments.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-6">
                   {/* Your client-side comment rendering logic */}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}