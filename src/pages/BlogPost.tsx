import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const blogContent: Record<string, { title: string; date: string; readTime: string; content: string }> = {
  "building-design-system": {
    title: "Building a Design System from Scratch",
    date: "February 15, 2025",
    readTime: "8 min read",
    content: `
A design system is more than a component library. It's the shared language between design and engineering — a set of constraints that paradoxically gives you more freedom.

## Why Build One?

When your product grows beyond a handful of pages, inconsistencies start to creep in. Buttons look slightly different across pages. Spacing feels arbitrary. Colors multiply without reason.

A design system solves this by establishing:

- **Design tokens** — the primitive values (colors, spacing, typography)
- **Components** — reusable UI elements built from those tokens
- **Patterns** — common compositions of components
- **Guidelines** — when and how to use everything

## Starting with Tokens

I always start with tokens. They're the foundation everything else builds on.

\`\`\`css
:root {
  --color-primary: 222.2 47.4% 11.2%;
  --color-muted: 215.4 16.3% 46.9%;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
}
\`\`\`

## Components Follow Tokens

Every component should reference tokens, never hardcoded values. This makes theming and dark mode trivial.

## The Result

After implementing a proper design system, our team shipped features faster with fewer design reviews. The constraints made decisions easier, not harder.
    `,
  },
  "switched-to-vite": {
    title: "Why I Switched to Vite for All My Projects",
    date: "January 20, 2025",
    readTime: "5 min read",
    content: `
After years of configuring webpack, I switched to Vite and haven't looked back.

## The Pain of Webpack

Don't get me wrong — webpack is powerful. But that power comes at a cost: complexity. Configuration files that span hundreds of lines, plugins for everything, slow cold starts.

## What Vite Gets Right

Vite takes a fundamentally different approach:

- **Native ES modules** in development — no bundling required
- **Lightning-fast HMR** — changes reflect in milliseconds
- **Sensible defaults** — works out of the box for most projects
- **Rollup under the hood** — battle-tested bundling for production

## Real Impact

My development server now starts in under 300ms. HMR is near-instant. The configuration file is 20 lines instead of 200.

Sometimes the best tool is the simplest one.
    `,
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogContent[slug] : null;

  if (!post) {
    return (
      <div className="content-width page-section text-center">
        <h1>Post not found</h1>
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
        <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
          <time>{post.date}</time>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </header>

      <div className="prose-content animate-fade-in" style={{ animationDelay: "100ms" }}>
        {post.content.split("\n").map((line, i) => {
          if (line.startsWith("## ")) {
            return <h2 key={i} className="text-xl font-semibold mt-10 mb-4">{line.replace("## ", "")}</h2>;
          }
          if (line.startsWith("- **")) {
            const match = line.match(/- \*\*(.+?)\*\*(.+)/);
            if (match) {
              return (
                <li key={i} className="text-muted-foreground ml-4 mb-2 list-disc">
                  <strong className="text-foreground">{match[1]}</strong>
                  {match[2]}
                </li>
              );
            }
          }
          if (line.startsWith("- ")) {
            return (
              <li key={i} className="text-muted-foreground ml-4 mb-2 list-disc">
                {line.replace("- ", "")}
              </li>
            );
          }
          if (line.startsWith("```")) {
            return null;
          }
          if (line.startsWith("  ")) {
            return (
              <pre key={i} className="bg-secondary rounded-md px-4 py-0.5 text-sm font-mono overflow-x-auto">
                <code>{line}</code>
              </pre>
            );
          }
          if (line.trim() === "") return <div key={i} className="h-4" />;
          return (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4">
              {line}
            </p>
          );
        })}
      </div>
    </article>
  );
};

export default BlogPost;
