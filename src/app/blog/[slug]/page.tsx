// app/blog/[slug]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Post } from '@/types/blogTypes';
import BlogPostClient from '@/components/BlogPost';

// Corrected Props type
type Props = {
  params: { slug: string };
};

async function fetchBlogPost(slug: string): Promise<Post | null> {
  try {
    // --- PERFORMANCE FIX ---
    // Instead of 'no-store', we use revalidation.
    // This tells Next.js to cache the page and serve it statically.
    // The page will be re-generated in the background every 3600 seconds (1 hour)
    // if a new request comes in after that time.
    // This makes page loads almost instantaneous after the first visit.
    const response = await fetch(
      `https://backend.muralisudireddy0.workers.dev/api/v1/blog/${slug}`,
      { next: { revalidate: 1000 } }  
    );

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params; // No await needed
  const post = await fetchBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.imageUrl ? [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
        },
      ] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = params; // No await needed

  const post = await fetchBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
