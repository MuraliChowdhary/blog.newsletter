
// components/CreateBlogPostForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getCookieValue } from '@/lib/getCookieValue';
import ImageUploader  from '@/components/ImageUploader';

export function CreateBlogPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [excerpt, setExcerpt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePublicId, setImagePublicId] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTagInput, setCurrentTagInput] = useState<string>('');
  const [readTime, setReadTime] = useState<string>('');
  const [published, setPublished] = useState<boolean>(false);
  const [featured, setFeatured] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Image upload handlers
  const handleUploadSuccess = (url: string, publicId: string) => {
    setImageUrl(url);
    setImagePublicId(publicId);
    toast.success('Image uploaded successfully!');
  };

  const handleUploadError = (error: string) => {
    toast.error(error);
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImagePublicId('');
    toast.info('Image removed');
  };

  // Tag management functions
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

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side validation
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

      // Construct the post data
      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        published: published,
        featured: featured,
        imageUrl: imageUrl.trim() || undefined,
        imagePublicId: imagePublicId.trim() || undefined,
        slug: slug.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        readTime: readTime ? parseInt(readTime, 10) : undefined,
      };

      const response = await fetch('https://backend.muralisudireddy0.workers.dev/api/v1/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Blog post created successfully!');
        // Clear form fields after successful creation
        setTitle('');
        setContent('');
        setExcerpt('');
        setImageUrl('');
        setImagePublicId('');
        setSlug('');
        setTags([]);
        setCurrentTagInput('');
        setReadTime('');
        setPublished(false);
        setFeatured(false);
      } else {
        toast.error(data.error || 'Failed to create blog post. Please try again.');
      }
    } catch (error) {
      console.error('Create post error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Create New Blog Post</CardTitle>
          <CardDescription className="text-muted-foreground">
            Fill in the details to publish a new article with media support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Your captivating blog post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="A short summary for your blog post (max 150 characters)"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    maxLength={150}
                    rows={3}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Brief summary for preview</span>
                    <span>{excerpt.length}/150</span>
                  </div>
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">Custom Slug (Optional)</Label>
                  <Input
                    id="slug"
                    type="text"
                    placeholder="your-blog-post-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '').replace(/-+/g, '-'))}
                  />
                  <p className="text-xs text-muted-foreground">Auto-generated from title if left blank</p>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (Optional)</Label>
                  <Input
                    id="tags"
                    type="text"
                    placeholder="Type tag and press Enter or comma"
                    value={currentTagInput}
                    onChange={(e) => setCurrentTagInput(e.target.value)}
                    onKeyDown={handleKeyDownAddTag}
                    onBlur={handleBlurAddTag}
                  />
                  <div className="flex flex-wrap gap-2">
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
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    placeholder="e.g., 5"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Featured Image/Video
                  </Label>
                  <ImageUploader
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                    currentImageUrl={imageUrl}
                    onRemoveImage={handleRemoveImage}
                  />
                </div>

                {/* Settings */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium">Post Settings</h3>
                  
                  {/* Published Switch */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="published">Publish Now</Label>
                      <p className="text-xs text-muted-foreground">
                        {published ? 'Visible to everyone' : 'Saved as draft'}
                      </p>
                    </div>
                    <Switch
                      id="published"
                      checked={published}
                      onCheckedChange={setPublished}
                    />
                  </div>

                  {/* Featured Switch */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="featured">Featured Post</Label>
                      <p className="text-xs text-muted-foreground">
                        {featured ? 'Highlighted post' : 'Standard post'}
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={featured}
                      onCheckedChange={setFeatured}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your amazing blog post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                required
                className="min-h-[300px]"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Post...
                </>
              ) : (
                'Create Post'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>Only administrators can create new blog posts.</p>
        </CardFooter>
      </Card>
    </div>
  );
}