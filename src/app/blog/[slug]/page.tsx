
import BlogPost from '@/components/BlogPost';

interface Props {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: Props) {
  return <BlogPost slug={params.slug} />;
}
