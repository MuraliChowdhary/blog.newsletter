// components/EditBlogPostForm.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { getCookieValue } from '@/lib/getCookieValue';

// Define a type for the initial data prop
interface EditBlogPostFormProps {
  initialData: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    published: boolean;
    featured: boolean;
    imageUrl?: string;
    slug: string;
    tags?: string[];
    readTime?: number;
  };
  onSuccess: () => void; // Callback after successful update
  onCancel: () => void; // Callback to close the form/modal
}

export function EditBlogPostForm({ initialData, onSuccess, onCancel }: EditBlogPostFormProps) {
  const [title, setTitle] = useState<string>(initialData.title || '');
  const [content, setContent] = useState<string>(initialData.content || '');
  const [excerpt, setExcerpt] = useState<string>(initialData.excerpt || '');
  const [imageUrl, setImageUrl] = useState<string>(initialData.imageUrl || '');
  const [slug, setSlug] = useState<string>(initialData.slug || '');
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [currentTagInput, setCurrentTagInput] = useState<string>('');
  const [readTime, setReadTime] = useState<string>(initialData.readTime?.toString() || '');
  const [published, setPublished] = useState<boolean>(initialData.published);
  const [featured, setFeatured] = useState<boolean>(initialData.featured);
  const [loading, setLoading] = useState<boolean>(false);

  // Effect to update form fields if initialData changes (e.g., if a different post is selected for editing)
  useEffect(() => {
    setTitle(initialData.title || '');
    setContent(initialData.content || '');
    setExcerpt(initialData.excerpt || '');
    setImageUrl(initialData.imageUrl || '');
    setSlug(initialData.slug || '');
    setTags(initialData.tags || []);
    setReadTime(initialData.readTime?.toString() || '');
    setPublished(initialData.published);
    setFeatured(initialData.featured);
    setCurrentTagInput(''); // Clear tag input when new post is loaded
  }, [initialData]);

  const handleKeyDownAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = currentTagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setCurrentTagInput('');
      }
    }
  };

  const handleBlurAddTag = () => {
    const newTag = currentTagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setCurrentTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required for a blog post.');
      return;
    }

    setLoading(true);
    try {
      const jwtToken = getCookieValue('jwtToken');
      if (!jwtToken) {
        toast.error('Authentication required. Please sign in as an admin.');
        setLoading(false);
        return;
      }

      const updatedData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        published: published,
        featured: featured,
        imageUrl: imageUrl.trim() || undefined,
        slug: slug.trim() || undefined,
        tags: tags.length > 0 ? tags : [], // Send empty array if no tags, or undefined if backend prefers
        readTime: readTime ? parseInt(readTime, 10) : undefined,
      };

      const response = await fetch(`https://backend.muralisudireddy0.workers.dev/api/v1/blog/${initialData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedData),
        // credentials: 'include', 
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Blog post updated successfully!');
        onSuccess(); // Call the callback to close modal and refresh list
      } else {
        toast.error(data.error || 'Failed to update blog post.');
      }
    } catch (error) {
      console.error('Update post error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePost} className="space-y-4 py-4"> {/* Added py-4 for padding inside dialog */}
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="edit-title">Title</Label>
        <Input
          id="edit-title"
          type="text"
          placeholder="Your captivating blog post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="edit-content">Content</Label>
        <Textarea
          id="edit-content"
          placeholder="Write your amazing blog post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="edit-excerpt">Excerpt (Optional)</Label>
        <Textarea
          id="edit-excerpt"
          placeholder="A short summary for your blog post (max 150 characters)"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          maxLength={150}
          rows={3}
        />
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="edit-imageUrl">Image URL (Optional)</Label>
        <Input
          id="edit-imageUrl"
          type="url"
          placeholder="https://example.com/blog-hero-image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="edit-slug">Custom Slug (Optional)</Label>
        <Input
          id="edit-slug"
          type="text"
          placeholder="your-blog-post-slug (e.g., 'my-awesome-post')"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '').replace(/-+/g, '-'))}
        />
        <p className="text-xs text-muted-foreground">Will be auto-generated from title if left blank.</p>
      </div>

      {/* Tags Input */}
      <div className="space-y-2">
        <Label htmlFor="edit-tags">Tags (Optional)</Label>
        <Input
          id="edit-tags"
          type="text"
          placeholder="Type tag and press Enter or comma"
          value={currentTagInput}
          onChange={(e) => setCurrentTagInput(e.target.value)}
          onKeyDown={handleKeyDownAddTag}
          onBlur={handleBlurAddTag}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Read Time */}
      <div className="space-y-2">
        <Label htmlFor="edit-readTime">Estimated Read Time (minutes - Optional)</Label>
        <Input
          id="edit-readTime"
          type="number"
          placeholder="e.g., 5"
          value={readTime}
          onChange={(e) => setReadTime(e.target.value)}
          min="1"
        />
      </div>

      {/* Published Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="edit-published"
          checked={published}
          onCheckedChange={setPublished}
        />
        <Label htmlFor="edit-published">Publish Now</Label>
        <span className="text-sm text-muted-foreground">
          {published ? 'Post will be visible immediately.' : 'Post will remain in draft mode.'}
        </span>
      </div>

      {/* Featured Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="edit-featured"
          checked={featured}
          onCheckedChange={setFeatured}
        />
        <Label htmlFor="edit-featured">Mark as Featured</Label>
        <span className="text-sm text-muted-foreground">
          {featured ? 'Post will be highlighted.' : 'Post will be a standard article.'}
        </span>
      </div>

      <div className="flex gap-2 pt-4"> {/* Added pt-4 for spacing above buttons */}
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
