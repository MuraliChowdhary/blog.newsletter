// components/BlogPostClient.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/blogTypes';
import DOMPurify from 'dompurify';

// UI and Icon Imports
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
  ExternalLink,
  ThumbsUp,
  Bookmark
} from 'lucide-react';

// HTML Content Renderer Component
const HTMLContentRenderer = ({ content }: { content: string }) => {
  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'code', 'pre', 'span',
      'div', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      'width', 'height', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });

  return (
    <div 
      className="prose prose-lg prose-gray dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
        prose-strong:text-gray-900 dark:prose-strong:text-gray-100
        prose-em:text-gray-800 dark:prose-em:text-gray-200
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 
        prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-gray-800 
        dark:prose-blockquote:text-gray-200 prose-blockquote:bg-gray-50 
        dark:prose-blockquote:bg-gray-800 prose-blockquote:rounded-r-lg prose-blockquote:my-6
        prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 
        prose-code:py-1 prose-code:rounded prose-code:text-sm
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg 
        prose-pre:p-4 prose-pre:overflow-x-auto
        prose-ul:list-disc prose-ol:list-decimal prose-li:mb-2
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline 
        prose-a:hover:text-blue-800 dark:prose-a:hover:text-blue-300
        prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto prose-img:my-8
        prose-table:border-collapse prose-th:border prose-th:border-gray-300 
        prose-th:bg-gray-100 dark:prose-th:bg-gray-700 prose-th:p-2
        prose-td:border prose-td:border-gray-300 prose-td:p-2
        prose-figure:my-8 prose-figcaption:text-center prose-figcaption:text-sm 
        prose-figcaption:text-gray-600 dark:prose-figcaption:text-gray-400 prose-figcaption:mt-2"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

interface BlogPostProps {
  post: Post;
}

export default function BlogPostClient({ post }: BlogPostProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleLike = () => {
    setLiked(!liked);
    // API call to update like count would go here
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // API call to bookmark post would go here
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
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        // Optionally, show a toast or message that the link was copied
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      // Optionally, show a toast or message that the link was copied
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, {
        id: Date.now(),
        text: comment,
        author: 'Current User',
        avatar: '/pnp.png',
        createdAt: new Date().toISOString()
      }]);
      setComment('');
      // API call to submit comment would go here
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Medium-style header */}
      {/* <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-8">
              <button onClick={handleBack} className="text-2xl font-bold hover:text-gray-600">
                Medium
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleLike}
                variant="ghost"
                size="sm"
                className={`${liked ? 'text-green-600' : 'text-gray-600'} hover:text-green-600`}
              >
                <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                onClick={handleBookmark}
                variant="ghost"
                size="sm"
                className={`${bookmarked ? 'text-green-600' : 'text-gray-600'} hover:text-green-600`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button onClick={handleShare} variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Article header */}
        <article>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback className="bg-gray-500 text-white">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{post.author.name}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  <span>·</span>
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.viewCount}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likesCount + (liked ? 1 : 0)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCount}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Featured image */}
          {post.imageUrl && (
            <div className="mb-12">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Article content - HTML rendered */}
          <div className="mb-12">
            <HTMLContentRenderer content={post.content} />
          </div>

          {/* Engagement section */}
          <div className="border-t border-gray-200 pt-8 mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Button
                  onClick={handleLike}
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  className={liked ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <ThumbsUp className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                  {post.likesCount + (liked ? 1 : 0)}
                </Button>
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={handleBookmark}
                  variant={bookmarked ? "default" : "outline"}
                  size="sm"
                  className={bookmarked ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${bookmarked ? 'fill-current' : ''}`} />
                  {bookmarked ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Comments section */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Comments ({post.commentsCount + comments.length})
          </h3>

          {/* Comment form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/pnp.png" />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="mb-4 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={!comment.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments list */}
          <div className="space-y-6">
            {comments.map((c) => (
              <Card key={c.id} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={c.avatar} />
                      <AvatarFallback className="bg-gray-400 text-white">
                        {c.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{c.author}</p>
                        <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 mt-1">{c.text}</p>
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