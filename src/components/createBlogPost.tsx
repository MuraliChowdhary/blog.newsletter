// components/CreateBlogPostForm.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch'; // For published/featured toggles
import { Badge } from '@/components/ui/badge'; // For displaying tags
import { Loader2, X } from 'lucide-react'; // For loading spinner and tag removal icon
import { toast } from 'sonner'; // Import toast from sonner
import { getCookieValue } from '@/lib/getCookieValue';

export function CreateBlogPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [excerpt, setExcerpt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]); // Array to store tags, explicitly typed as string[]
  const [currentTagInput, setCurrentTagInput] = useState<string>(''); // For the tag input field, explicitly typed as string
  const [readTime, setReadTime] = useState<string>(''); // Stored as string, convert to number for API
  const [published, setPublished] = useState<boolean>(false);
  const [featured, setFeatured] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // Removed the 'message' state as sonner handles message display

  // Function to add a tag on key down (Enter or comma)
  const handleKeyDownAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); // Prevent form submission
      const newTag = currentTagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setCurrentTagInput('');
      }
    }
  };

  // Function to add a tag on blur (when input loses focus)
  const handleBlurAddTag = () => {
    const newTag = currentTagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setCurrentTagInput('');
    }
  };

  // Function to remove a tag
  const handleRemoveTag = (tagToRemove: string) => { // Explicitly type the tagToRemove parameter
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => { // Explicitly type the event
    e.preventDefault();
    // No need to clear message state as toast handles ephemeral messages

    // Client-side validation
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required for a blog post.'); // Use toast.error
      return;
    }

    setLoading(true);
    try {
      const jwtToken = getCookieValue('jwtToken'); // Retrieve JWT token

      if (!jwtToken) {
        toast.error('Authentication required. Please sign in as an admin.'); // Use toast.error
        setLoading(false);
        return;
      }

      // Construct the post data
      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined, // Send only if not empty
        published: published,
        featured: featured,
        imageUrl: imageUrl.trim() || undefined, // Send only if not empty
        slug: slug.trim() || undefined, // Let backend generate if empty
        tags: tags.length > 0 ? tags : undefined, // Send only if not empty
        readTime: readTime ? parseInt(readTime, 10) : undefined, // Convert to number
      };

      const response = await fetch('https://backend.muralisudireddy0.workers.dev/api/v1/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`, // Attach JWT token
        },
        body: JSON.stringify(postData),
        credentials: 'include', // Ensure cookies are sent with the request
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Blog post created successfully!'); // Use toast.success
        // Clear form fields after successful creation
        setTitle('');
        setContent('');
        setExcerpt('');
        setImageUrl('');
        setSlug('');
        setTags([]);
        setCurrentTagInput('');
        setReadTime('');
        setPublished(false);
        setFeatured(false);
        // Optionally redirect to the new post or blog list
        // router.push(`/blog/${data.slug}`);
      } else {
        toast.error(data.error || 'Failed to create blog post. Please try again.'); // Use toast.error
      }
    } catch (error) {
      console.error('Create post error:', error);
      toast.error('An unexpected error occurred. Please try again later.'); // Use toast.error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl mx-auto p-6 rounded-lg shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Create New Blog Post</CardTitle>
          <CardDescription className="text-muted-foreground">
            Fill in the details to publish a new article.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Your captivating blog post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your amazing blog post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
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
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/blog-hero-image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Custom Slug (Optional)</Label>
              <Input
                id="slug"
                type="text"
                placeholder="your-blog-post-slug (e.g., 'my-awesome-post')"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '').replace(/-+/g, '-'))}
              // Basic slugification on client-side for immediate feedback
              />
              <p className="text-xs text-muted-foreground">Will be auto-generated from title if left blank.</p>
            </div>

            {/* Tags Input */}
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
              <Label htmlFor="readTime">Estimated Read Time (minutes - Optional)</Label>
              <Input
                id="readTime"
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
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="published">Publish Now</Label>
              <span className="text-sm text-muted-foreground">
                {published ? 'Post will be visible immediately.' : 'Post will remain in draft mode.'}
              </span>
            </div>

            {/* Featured Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
              <Label htmlFor="featured">Mark as Featured</Label>
              <span className="text-sm text-muted-foreground">
                {featured ? 'Post will be highlighted.' : 'Post will be a standard article.'}
              </span>
            </div>

            {/* Removed the manual message display */}
            {/* {message.text && (
              <p className={`text-sm ${message.type === 'error' ? 'text-destructive' : 'text-green-500'}`}>
                {message.text}
              </p>
            )} */}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
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
          Note: Only administrators can create new blog posts.
        </CardFooter>
      </Card>
    </div>
  );
}
