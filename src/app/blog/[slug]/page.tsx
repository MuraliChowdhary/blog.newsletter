// app/blog/[slug]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Post } from "@/types/blogTypes";
import BlogPostClient from "@/components/BlogPost";

// ✅ Updated Props type - params is now a Promise
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function fetchBlogPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(
      `https://backend.muralisudireddy0.workers.dev/api/v1/blog/${slug}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

// ✅ Await params before using
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found | NextDevs",
      description:
        "The content you are looking for might have been removed or is unavailable.",
      robots: { index: false, follow: false },
    };
  }

  const ogImage = post.imageUrl || "https://blog.nextdevs.me/images/og-blog.jpg";
  const canonical = `https://blog.nextdevs.me/blog/${post.slug}`;

  return {
    title: `${post.title} | NextDevs`,
    description:
      post.excerpt ||
      "Explore trending discussions, latest news, and user stories across technology, culture, startups, and more.",
    keywords: [
      "NextDevs",
      "trending topics",
      "latest news",
      "community discussions",
      "social media platform",
      "technology",
      "AI",
      "startups",
      "innovation",
      "entertainment",
      "culture",
    ],
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt || "Join the discussion on NextDevs!",
      url: canonical,
      siteName: "NextDevs",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description:
        post.excerpt || "Discover trending stories and discussions on NextDevs!",
      images: [ogImage],
      creator: "@NextDevsOfficial",
    },
  };
}

// ✅ Await params before using
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  const canonicalUrl = `https://blog.nextdevs.me/blog/${post.slug}`;
  const ogImage = post.imageUrl || "https://blog.nextdevs.me/images/og-blog.jpg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: post.title,
    description: post.excerpt,
    image: ogImage,
    author: {
      "@type": "Person",
      name: post.author || "NextDevs User",
    },
    publisher: {
      "@type": "Organization",
      name: "NextDevs",
      logo: {
        "@type": "ImageObject",
        url: "https://blog.nextdevs.me/logo.png",
      },
    },
    datePublished: post.createdAt || new Date().toISOString(),
    dateModified: post.updatedAt || post.createdAt,
    commentCount: post.commentCount || 0,
  };

  return (
    <article className="prose mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} />
    </article>
  );
}