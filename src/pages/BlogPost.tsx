import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "../services/api";

interface BlogPostContent {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: number;
  createdAt: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading: loading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      const data: any = await apiClient.getBlogPostBySlug(slug);
      const postData = Array.isArray(data) ? data[0] : (data?.data || data);
      if (!postData) throw new Error('Post not found');
      return postData;
    },
    enabled: !!slug,
  });

  if (loading) {
    return (
      <div className="content-width page-section text-center">
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="content-width page-section text-center">
        <h1>Post not found</h1>
        <p className="text-sm text-muted-foreground mt-2">{error instanceof Error ? error.message : 'The post you are looking for does not exist.'}</p>
        <Link to="/blog" className="text-sm text-muted-foreground link-underline mt-4 inline-block">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="content-width page-section">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to blog
      </Link>

      <header className="mb-10 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground flex-wrap">
          <time>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          <span>·</span>
          <span>{post.readTime} min read</span>
          {post.author && (
            <>
              <span>·</span>
              <span>{post.author.name}</span>
            </>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, index) => (
              <span key={`${post.id}-tag-${index}`} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose-content animate-fade-in max-w-3xl text-muted-foreground leading-relaxed" style={{ animationDelay: "100ms" }}>
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-medium mt-6 mb-3 text-foreground">{children}</h3>,
            h4: ({ children }) => <h4 className="text-lg font-medium mt-4 mb-2 text-foreground">{children}</h4>,
            p: ({ children }) => <p className="mb-4 text-foreground">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>,
            li: ({ children }) => <li className="text-foreground">{children}</li>,
            code: ({ node, inline, children, ...props }: any) =>
              inline ? (
                <code className="bg-secondary/50 px-2 py-1 rounded text-sm font-mono text-foreground" {...props}>{children}</code>
              ) : (
                <code className="text-foreground" {...props}>{children}</code>
              ),
            pre: ({ children }) => (
              <pre className="bg-secondary rounded-md px-4 py-3 text-sm font-mono overflow-x-auto my-4 border border-border">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4 border border-border" />
            ),
            table: ({ children }) => (
              <table className="w-full border-collapse border border-border my-4">
                {children}
              </table>
            ),
            thead: ({ children }) => <thead className="bg-secondary">{children}</thead>,
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => <tr className="border border-border">{children}</tr>,
            th: ({ children }) => <th className="border border-border px-4 py-2 text-left font-semibold">{children}</th>,
            td: ({ children }) => <td className="border border-border px-4 py-2">{children}</td>,
            hr: () => <hr className="my-6 border-border" />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default BlogPost;
