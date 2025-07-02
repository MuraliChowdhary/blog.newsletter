// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Post } from '@/types/blogTypes';
import BlogPostClient from '@/components/BlogPost';

type Props = {
  params: Promise<{ slug: string }>;
};

async function fetchBlogPost(slug: string): Promise<Post | null> {
  try {
    // We use { cache: 'no-store' } to ensure we get the latest post data on every request.
    // For better performance, you could use revalidation: { next: { revalidate: 3600 } }
    const response = await fetch(
      `https://backend.muralisudireddy0.workers.dev/api/v1/blog/${slug}`,
      { cache: 'no-store' }
    );

    // If the response is not OK (e.g., 404 Not Found), we return null.
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
  // Await the params since it's now a Promise
  const { slug } = await params;
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
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Fetch the data for the specific slug.
  const post = await fetchBlogPost(slug);

  // If no post is found, trigger the not-found.tsx UI boundary.
  if (!post) {
    notFound();
  }

  // If the post is found, render the client component and pass the data as a prop.
  return <BlogPostClient post={post} />;
}