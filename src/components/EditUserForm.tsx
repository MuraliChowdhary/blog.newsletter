// components/EditUserRoleForm.jsx
'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getCookieValue } from '@/lib/getCookieValue';

// Define a type for the initial data prop
interface EditUserRoleFormProps {
  initialData: {
    id: string;
    email: string;
    name?: string;
    role: 'USER' | 'ADMIN';
  };
  onSuccess: () => void; // Callback after successful update
  onCancel: () => void; // Callback to close the form/modal
}

export function EditUserRoleForm({ initialData, onSuccess, onCancel }: EditUserRoleFormProps) {
  const [selectedRole, setSelectedRole] = useState<"USER" | "ADMIN">(initialData.role);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jwtToken = getCookieValue('jwtToken');
      if (!jwtToken) {
        toast.error('Authentication required. Please sign in as an admin.');
        setLoading(false);
        return;
      }

      const response = await fetch(`https://backend.muralisudireddy0.workers.dev/api/v1/user/admin/users/${initialData.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ role: selectedRole }),
        credentials: 'include', 
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'User role updated successfully!');
        onSuccess(); // Trigger refresh in ManageUsers and close modal
      } else {
        toast.error(data.error || 'Failed to update user role.');
      }
    } catch (error) {
      console.error('Update user role error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdateRole} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="userName" className="text-right">
          Name
        </Label>
        <div className="col-span-3 text-sm text-foreground">
          {initialData.name || 'N/A'}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="userEmail" className="text-right">
          Email
        </Label>
        <div className="col-span-3 text-sm text-foreground">
          {initialData.email}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">
          Role
        </Label>
        <div className="col-span-3">
          <Select value={selectedRole} onValueChange={(value: "USER" | "ADMIN") => setSelectedRole(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {/* Changed display text to uppercase */}
              <SelectItem value="USER">USER</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
