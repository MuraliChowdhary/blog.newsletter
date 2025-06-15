// components/ManageBlogPosts.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit, Trash2, CalendarDays, BookOpenText, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { EditBlogPostForm } from './EditBlogPage';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BlogPost {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  slug: string;
  tags?: string[];
  readTime?: number;
  createdAt: string;
  updatedAt?: string;
  authorId: string;
  viewCount?: number;
  commentsCount?: number;
  likesCount?: number;
  publishedAt?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export function ManageBlogPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [postToDeleteId, setPostToDeleteId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]); // New state for search recommendations

  // Debounce effect for main search term filtering
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Effect to generate recommendations as searchTerm changes (no debounce here for quick feedback)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setRecommendations([]);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const uniqueRecommendations: Set<string> = new Set();

    posts.forEach(post => {
      // Prioritize exact title matches
      if (post.title.toLowerCase().includes(lowerCaseSearchTerm)) {
        uniqueRecommendations.add(post.title);
      }
      // Add tags that match
      post.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(lowerCaseSearchTerm)) {
          uniqueRecommendations.add(tag);
        }
      });
      // Add author names that match
      if (post.author?.name.toLowerCase().includes(lowerCaseSearchTerm)) {
        uniqueRecommendations.add(post.author.name);
      }
      // Consider excerpt/content if short and relevant (optional, can be noisy)
      // if (post.excerpt && post.excerpt.toLowerCase().includes(lowerCaseSearchTerm)) {
      //   uniqueRecommendations.add(post.excerpt.substring(0, 50) + '...');
      // }
    });

    // Convert Set to Array and limit recommendations
    setRecommendations(Array.from(uniqueRecommendations).slice(0, 5)); // Limit to 5 recommendations
  }, [searchTerm, posts]);


  const fetchBlogPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        toast.error('Authentication required. Please sign in as an admin to view posts.');
        setLoading(false);
        setError('Authentication Required');
        setPosts([]);
        return;
      }

      const response = await fetch('https://backend.muralisudireddy0.workers.dev/api/v1/blog/bulk', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        if (result && typeof result.data === 'object' && Array.isArray(result.data.posts)) {
          setPosts(result.data.posts);
        } else if (result && result.message) {
            setPosts([]);
            toast.info(result.message);
        } else {
          console.warn("API response format unexpected, 'data.posts' array not found or data not an object:", result);
          setPosts([]);
          toast.error('Received unexpected data format from server.');
        }
      } else {
        const errorMessage = (result && typeof result === 'object' && result.error) ? result.error : 'Failed to fetch blog posts.';
        setError(errorMessage);
        toast.error(errorMessage);
        setPosts([]);
      }
    } catch (err: any) {
      console.error('Fetch blog posts error:', err);
      setError(`An unexpected error occurred while fetching posts: ${err.message || 'Unknown error'}`);
      toast.error(`An unexpected error occurred while fetching posts: ${err.message || 'Unknown error'}`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDeleteId(postId);
    setIsDeleteConfirmOpen(true);
  };

  const handlePostUpdated = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
    fetchBlogPosts();
  };

  const confirmDeletePost = async () => {
    if (!postToDeleteId) return;

    setLoading(true);
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        toast.error('Authentication required to delete posts.');
        setLoading(false);
        return;
      }

      const response = await fetch(`https://backend.muralisudireddy0.workers.dev/api/v1/blog/${postToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Blog post deleted successfully!');
        fetchBlogPosts();
      } else {
        toast.error(data.error || 'Failed to delete blog post.');
      }
    } catch (err) {
      console.error('Delete post error:', err);
      toast.error('An unexpected error occurred during deletion.');
    } finally {
      setLoading(false);
      setIsDeleteConfirmOpen(false);
      setPostToDeleteId(null);
    }
  };

  // Filtered posts based on the debounced search term
  const filteredPosts = posts.filter(post => {
    const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
    if (!lowerCaseSearchTerm) return true; // Show all if search term is empty

    return (
      post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      (post.content && post.content.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))) ||
      (post.author?.name && post.author.name.toLowerCase().includes(lowerCaseSearchTerm))
    );
  });


  if (loading && (!posts || posts.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading blog posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-destructive">
        <p>Error: {error}</p>
        <Button onClick={fetchBlogPosts} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 pt-16">
      <Card className="w-full max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Manage Blog Posts</CardTitle>
          <CardDescription className="text-muted-foreground">
            View, edit, or delete existing blog posts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input with Recommendations */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts by title, content, tags, or author..."
              className="w-full pl-9 pr-3 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.trim() !== '' && recommendations.length > 0 && (
              <ul className="absolute z-10 w-full bg-popover border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                {recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
                    onClick={() => {
                      setSearchTerm(rec); // Set the search term to the recommendation
                      setDebouncedSearchTerm(rec); // Immediately apply to filter
                      setRecommendations([]); // Hide recommendations
                    }}
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {filteredPosts.length === 0 && !loading && (
            <p className="text-center text-muted-foreground">
              {searchTerm ? `No posts found matching "${searchTerm}".` : 'No blog posts found. Create one to get started!'}
            </p>
          )}

          {filteredPosts.length > 0 && (
            <div className="grid gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt || post.content?.substring(0, 100) + '...' || 'No excerpt available.'}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.readTime && (
                          <>
                            <span>•</span>
                            <BookOpenText className="h-3 w-3" />
                            <span>{post.readTime} min read</span>
                          </>
                        )}
                         {post.author && (
                            <>
                                <span>•</span>
                                <img src={post.author.avatar || 'https://www.gravatar.com/avatar/?d=mp'} alt={post.author.name} className="h-4 w-4 rounded-full" />
                                <span>{post.author.name}</span>
                            </>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags && post.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                        ))}
                        {post.published ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Published</Badge>
                        ) : (
                            <Badge variant="destructive">Draft</Badge>
                        )}
                        {post.featured && (
                            <Badge variant="outline" className="border-primary text-primary">Featured</Badge>
                        )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => handleEditClick(post)} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteClick(post.id)} className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Post Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[800px] p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Make changes to your blog post here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <EditBlogPostForm
              initialData={{
                ...editingPost,
                content: editingPost?.content ?? '',
              }}
              onSuccess={handlePostUpdated}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePost} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Continue'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
