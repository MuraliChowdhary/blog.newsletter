// components/DashboardOverview.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Users, FileText, Heart, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getCookieValue } from '@/lib/getCookieValue';

// Define types for expected API responses
interface PostStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
}

interface UserStats {
  totalUsers: number;
}

interface BlogPost {
  id: string;
  title: string;
  commentsCount?: number;
  likesCount?: number;
}

interface UserData {
  id: string;
}

export function DashboardOverview() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [postStats, setPostStats] = useState<PostStats>({ totalPosts: 0, totalLikes: 0, totalComments: 0 });
  const [userStats, setUserStats] = useState<UserStats>({ totalUsers: 0 });

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    const jwtToken = getCookieValue("jwtToken");
     console.log('JWT Token:', jwtToken); // Debugging line to check token // Replace with your actual method to get the JWT token
    if (!jwtToken) {
      toast.error('Authentication required. Please sign in as an admin to view dashboard stats.');
      setLoading(false);
      setError('Authentication Required');
      return;
    }

    try {
      // --- Fetch Blog Posts Data ---
      const blogResponse = await fetch('https://backend.muralisudireddy0.workers.dev/api/v1/blog/bulk', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        // credentials: 'include',
      });
      const blogResult = await blogResponse.json();

      if (blogResponse.ok && blogResult && blogResult.data && Array.isArray(blogResult.data.posts)) {
        let totalLikes = 0;
        let totalComments = 0;
        blogResult.data.posts.forEach((post: BlogPost) => {
          totalLikes += post.likesCount || 0;
          totalComments += post.commentsCount || 0;
        });
        setPostStats({
          totalPosts: blogResult.data.pagination?.totalPosts || blogResult.data.posts.length,
          totalLikes: totalLikes,
          totalComments: totalComments,
        });
      } else {
        const errorMessage = (blogResult && blogResult.error) ? blogResult.error : 'Failed to fetch blog stats.';
        toast.error(errorMessage);
        setError(prev => prev ? `${prev}\n${errorMessage}` : errorMessage); // Accumulate errors
      }

      // --- Fetch Users Data ---
      const userResponse = await fetch('https://backend.muralisudireddy0.workers.dev/api/v1/user/admin/users', { // Fetch just 1 user to get totalPages/totalUsers
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        // credentials: 'include', 
      });
      const userResult = await userResponse.json();

      if (userResponse.ok && userResult && userResult.data && userResult.data.pagination) {
        setUserStats({
          totalUsers: userResult.data.pagination.totalUsers,
        });
      } else {
        const errorMessage = (userResult && userResult.error) ? userResult.error : 'Failed to fetch user stats.';
        toast.error(errorMessage);
        setError(prev => prev ? `${prev}\n${errorMessage}` : errorMessage); // Accumulate errors
      }

    } catch (err: any) {
      console.error('Dashboard stats fetch error:', err);
      const errorMessage = `An unexpected error occurred: ${err.message || 'Unknown error'}`;
      setError(prev => prev ? `${prev}\n${errorMessage}` : errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-card rounded-lg p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">Loading dashboard overview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-card rounded-lg p-6 text-destructive">
        <p className="text-center mb-4">Error loading dashboard stats:</p>
        <pre className="text-sm bg-destructive/10 p-3 rounded-md overflow-auto max-w-full">{error}</pre>
        <Button onClick={fetchDashboardStats} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users on your platform.
            </p>
          </CardContent>
        </Card>

        {/* Total Posts Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postStats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Published and draft articles.
            </p>
          </CardContent>
        </Card>

        {/* Total Likes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postStats.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              Aggregate likes across all posts.
            </p>
          </CardContent>
        </Card>

        {/* Total Comments Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postStats.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              Total comments on all posts.
            </p>
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground mt-8 text-center">
        Statistics updated automatically.
      </p>
    </div>
  );
}
