import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { apiClient } from "../services/api";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: number;
  createdAt: string;
}

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: posts = [], isLoading: loading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const data: any = await apiClient.getBlogPosts();
      const postsArray = Array.isArray(data) ? data : (data?.data?.items || data?.posts || []);
      return postsArray;
    },
  });

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  const filtered = posts.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="content-width page-section space-y-6">
      <div className="animate-fade-in">
        <h1>Blog</h1>
        <p className="text-muted-foreground mt-1">
          Thoughts on development, design, and building for the web.
        </p>
      </div>

      <div className="space-y-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              selectedTag === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent/20 hover:text-accent"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent/20 hover:text-accent"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
        {loading && (
          <p className="text-sm text-muted-foreground py-8 text-center">Loading posts...</p>
        )}
        {error && (
          <p className="text-sm text-red-500 py-8 text-center">{error}</p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No posts found.
          </p>
        )}
        {!loading && filtered.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block group p-3 rounded-lg hover:bg-secondary/60 border border-transparent hover:border-border transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
              <div className="space-y-0.5 min-w-0">
                <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{post.readTime} min</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
