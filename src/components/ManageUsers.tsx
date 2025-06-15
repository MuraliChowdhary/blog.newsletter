// components/ManageUsers.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit, User, Mail, CalendarDays, ThumbsUp, MessageSquare, BookOpenText } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import  {EditUserRoleForm}  from './EditUserForm'; // Import the new edit user role form

// Define a type for your user object from the backend
interface UserData {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  createdAt: string;
  postsCount?: number;
  receivedLikesCount?: number;
}

export function ManageUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10; // Fixed page size

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        toast.error('Authentication required. Please sign in as an admin.');
        setLoading(false);
        setError('Authentication Required');
        setUsers([]);
        return;
      }

      const response = await fetch(`https://backend.muralisudireddy0.workers.dev/api/v1/user/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        if (result && typeof result.data === 'object' && Array.isArray(result.data.users)) {
          setUsers(result.data.users);
          setTotalPages(result.data.pagination.totalPages);
        } else {
          console.warn("API response format unexpected, 'data.users' array not found or data not an object:", result);
          setUsers([]);
          toast.error('Received unexpected data format from server.');
        }
      } else {
        const errorMessage = (result && typeof result === 'object' && result.error) ? result.error : 'Failed to fetch users.';
        setError(errorMessage);
        toast.error(errorMessage);
        setUsers([]);
      }
    } catch (err: any) {
      console.error('Fetch users error:', err);
      setError(`An unexpected error occurred while fetching users: ${err.message || 'Unknown error'}`);
      toast.error(`An unexpected error occurred while fetching users: ${err.message || 'Unknown error'}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]); // Re-fetch when currentPage changes

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUserRoleUpdated = () => {
    setIsEditModalOpen(false); // Close modal
    setEditingUser(null);      // Clear editing user state
    fetchUsers();              // Re-fetch users to show updated data
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive">
        <p>Error: {error}</p>
        <Button onClick={fetchUsers} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <Card className="w-full mx-auto p-6 rounded-lg shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold">Manage Users</CardTitle>
        <CardDescription className="text-muted-foreground">
          View and update user roles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {users.length === 0 ? (
          <p className="text-center text-muted-foreground">No users found.</p>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <img
                    src={user.avatar || 'https://www.gravatar.com/avatar/?d=mp'} // Default avatar
                    alt={user.name || 'User'}
                    className="h-12 w-12 rounded-full object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{user.name || 'N/A'}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className={user.role === 'ADMIN' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground justify-end sm:justify-start mt-3 sm:mt-0">
                    <span className="flex items-center gap-1">
                        <BookOpenText className="h-4 w-4" /> {user.postsCount || 0} Posts
                    </span>
                    <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" /> {user.receivedLikesCount || 0} Likes
                    </span>
                    <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" /> Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div className="w-full sm:w-auto mt-3 sm:mt-0">
                  <Button variant="outline" onClick={() => handleEditClick(user)} className="w-full sm:w-auto flex items-center gap-2">
                    <Edit className="h-4 w-4" /> Edit Role
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>

      {/* Edit User Role Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Update the role for {editingUser?.name || editingUser?.email}.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <EditUserRoleForm
              initialData={editingUser}
              onSuccess={handleUserRoleUpdated}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
