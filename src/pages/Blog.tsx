import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No posts found.
          </p>
        )}
        {filtered.map((post) => (
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
                <span className="text-xs text-muted-foreground">{post.date}</span>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{post.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const posts = [
  {
    slug: "building-design-system",
    title: "Building a Design System from Scratch",
    excerpt: "How I approached creating a cohesive design system for a growing product, from tokens to components.",
    date: "Feb 2025",
    readTime: "8 min",
    tags: ["Design", "Frontend"],
  },
  {
    slug: "switched-to-vite",
    title: "Why I Switched to Vite for All My Projects",
    excerpt: "After years of webpack, I made the switch to Vite. Here's what changed and why I'm not going back.",
    date: "Jan 2025",
    readTime: "5 min",
    tags: ["Tools", "Frontend"],
  },
  {
    slug: "clean-architecture-frontend",
    title: "Clean Architecture in Frontend Applications",
    excerpt: "Applying clean architecture principles to React applications for better testability and maintainability.",
    date: "Dec 2024",
    readTime: "12 min",
    tags: ["Architecture", "React"],
  },
  {
    slug: "typescript-patterns",
    title: "TypeScript Patterns I Use Every Day",
    excerpt: "Practical TypeScript patterns that improve code quality and developer experience in real-world projects.",
    date: "Nov 2024",
    readTime: "7 min",
    tags: ["TypeScript", "Frontend"],
  },
  {
    slug: "postgres-for-everything",
    title: "Why PostgreSQL is My Default Database",
    excerpt: "From JSON support to full-text search, PostgreSQL handles almost everything I throw at it.",
    date: "Oct 2024",
    readTime: "6 min",
    tags: ["Backend", "Database"],
  },
];

export default Blog;
