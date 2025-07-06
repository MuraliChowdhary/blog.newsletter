// components/BlogPostClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/blogTypes';
import DOMPurify from 'dompurify';

// UI and Icon Imports (ShadCN UI)
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft, // Added for the back button
  Eye,
  Heart,
  MessageCircle,
  Share2,
  User,
  Send,
  ThumbsUp,
  Bookmark
} from 'lucide-react';

// HTML Content Renderer Component
const HTMLContentRenderer = ({ content }: { content: string }) => {
  // State to hold the sanitized content
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  
  // Effect to run the sanitization and formatting only on the client-side
  useEffect(() => {
    let processedContent = content || '';

    // Check if the content is plain text without proper HTML structure
    const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(processedContent);
    
    if (processedContent && !hasHtmlTags) {
        // It's plain text, so we convert it to HTML with proper paragraph structure
        processedContent = processedContent
            .split('\n') // Split the string into an array of lines
            .filter(line => line.trim() !== '') // Remove any empty lines
            .map(line => `<p>${line.trim()}</p>`) // Wrap each line in a <p> tag
            .join(''); // Join the array back into a single string
    }

    // DOMPurify requires the 'window' object, so it can only run in the browser.
    const sanitized = DOMPurify.sanitize(processedContent, {
        // Define allowed tags and attributes for security
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'code', 'pre', 'span',
            'div', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'style'],
    });
    setSanitizedContent(sanitized);
  }, [content]);

  return (
    <div 
      className="prose prose-lg prose-gray dark:prose-invert max-w-none
        prose-headings:font-extrabold prose-headings:tracking-tight
        prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-4
        prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
        prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:leading-relaxed prose-p:mb-6 prose-p:text-muted-foreground
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6
        prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-foreground
        prose-blockquote:bg-muted prose-blockquote:rounded-r-lg prose-blockquote:my-6
        prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
        prose-pre:bg-[#1e1e1e] prose-pre:text-foreground prose-pre:rounded-lg
        prose-pre:p-4 prose-pre:overflow-x-auto
        prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 prose-li:text-muted-foreground
        prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2 prose-li:text-muted-foreground
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto prose-img:my-8
        prose-table:w-full prose-table:my-8 prose-table:border-collapse
        prose-thead:border-b prose-thead:border-border
        prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold
        prose-tbody:divide-y prose-tbody:divide-border
        prose-td:p-3 prose-td:align-middle prose-td:text-muted-foreground"
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

  const handleLike = () => setLiked(!liked);
  const handleBookmark = () => setBookmarked(!bookmarked);

  const handleShare = async () => {
    const shareData = {
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            throw new Error('Web Share API not supported');
        }
    } catch (error) {
        console.error('Share failed:', error);
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!'); // Replace with a toast notification for better UX
        });
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
        setComments(prevComments => [...prevComments, {
            id: Date.now(),
            text: comment,
            author: 'Jane Doe',
            avatar: 'https://i.pravatar.cc/150?u=jane-doe',
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

  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            
            {/* Back Button */}
            <div className="mb-8">
                <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            <article>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">
                    {post.title}
                </h1>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-8 border-b border-border">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <Avatar className="w-14 h-14">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback className="bg-muted text-foreground">
                                {post.author.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-foreground text-lg">{post.author.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                                <span>·</span>
                                <span>{post.readTime} min read</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1.5 p-2 rounded-md hover:bg-muted">
                            <Eye className="w-4 h-4" />
                            <span>{post.viewCount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 p-2 rounded-md hover:bg-muted">
                            <Heart className="w-4 h-4" />
                            <span>{(post.likesCount + (liked ? 1 : 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 p-2 rounded-md hover:bg-muted">
                            <MessageCircle className="w-4 h-4" />
                            <span>{(post.commentsCount + comments.length).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {post.imageUrl && (
                    <div className="mb-12 flex justify-center">
                        <div className="relative max-w-2xl w-full">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                loading="lazy"
                                className="w-full h-auto max-h-96 object-cover rounded-xl shadow-lg border border-border"
                            />
                        </div>
                    </div>
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                                # {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="mb-12">
                    <HTMLContentRenderer content={post.content} />
                </div>

                <div className="border-t border-border pt-8 mb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={handleLike}
                                variant="outline"
                                size="sm"
                                className={`transition-colors ${liked ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary' : ''}`}
                            >
                                <ThumbsUp className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                                Like
                            </Button>
                            <Button onClick={handleShare} variant="outline" size="sm">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            <Button
                                onClick={handleBookmark}
                                variant="outline"
                                size="sm"
                                className={`transition-colors ${bookmarked ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary' : ''}`}
                            >
                                <Bookmark className={`w-4 h-4 mr-2 ${bookmarked ? 'fill-current' : ''}`} />
                                {bookmarked ? 'Saved' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="border-t border-border pt-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6">
                        Comments ({(post.commentsCount + comments.length).toLocaleString()})
                    </h3>
                    
                    {/* Comment Input */}
                    <div className="mb-8">
                        <div className="flex items-start space-x-4">
                            <Avatar className="w-10 h-10 flex-shrink-0">
                                <AvatarImage src="/pnp.png" />
                                <AvatarFallback className="bg-muted text-foreground">
                                    <User className="w-5 h-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Textarea
                                    placeholder="Write a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="mb-3 resize-none"
                                    rows={3}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleCommentSubmit}
                                        size="sm"
                                        disabled={!comment.trim()}
                                        className="ml-auto"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Post Comment
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.map((commentItem) => (
                            <Card key={commentItem.id} className="border-0 shadow-none bg-muted/50">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="w-10 h-10 flex-shrink-0">
                                            <AvatarImage src={commentItem.avatar} />
                                            <AvatarFallback className="bg-muted text-foreground">
                                                {commentItem.author.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="font-semibold text-foreground text-sm">
                                                    {commentItem.author}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(commentItem.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {commentItem.text}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    </div>
  );
}
