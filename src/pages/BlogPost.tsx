import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const blogContent: Record<string, { title: string; date: string; readTime: string; content: string }> = {
  "what-happens-when-you-type-google-com": {
    title: "What Actually Happens When You Type `www.google.com` in Your Browser?",
    date: "March 13, 2026",
    readTime: "7 min read",
    content: `
Most of us type a URL and press Enter without thinking about the complex distributed systems working behind the scenes. But that single action triggers a fascinating chain of networking, DNS resolution, and large-scale infrastructure processes.

Let’s walk through what happens internally.

## 1. DNS Resolution (Domain Name → IP Address)

Humans prefer domain names like www.google.com, but computers communicate using IP addresses.

When you type a URL, the browser first checks whether the IP address is cached locally:

- Browser cache
- Operating system cache
- Router cache

If it isn’t found, the request is sent to a DNS resolver, typically provided by your ISP (Internet Service Provider).

The DNS system then resolves the domain name by querying:

- Root DNS servers
- Top-level domain (TLD) servers such as .com
- Authoritative DNS servers

Finally, the resolver returns the IP address of Google’s server to your browser.

## 2. Establishing a Network Connection

Once the IP address is obtained, the browser establishes a connection using TCP (Transmission Control Protocol).

For secure websites like Google, a TLS handshake occurs to create an encrypted connection over HTTPS.

This process ensures:

- Authentication
- Encryption
- Data integrity

## 3. Sending the HTTP Request

After the secure connection is established, the browser sends an HTTP/HTTPS request to the server.

Example request:

GET / HTTP/1.1
Host: www.google.com

This request travels across multiple network hops through routers across the internet.

## 4. Request Hits the Load Balancer

In modern large-scale systems, requests do not directly reach application servers.

Instead, they first go through a load balancer.

The load balancer acts as an intelligent traffic manager that distributes incoming requests across multiple backend servers.

This prevents:

- Server overload
- Single points of failure
- Performance bottlenecks

## 5. Horizontal vs Vertical Scaling

Large systems like Google scale their infrastructure using two approaches.

Vertical scaling means increasing the capacity of a single server (more CPU, RAM, storage).

Horizontal scaling means adding more servers and distributing traffic across them.

Companies like Google primarily rely on horizontal scaling because it provides better fault tolerance and scalability.

## 6. Global Data Centers and Edge Infrastructure

Google operates globally distributed data centers connected through high-speed private networks.

Using technologies such as:

- GeoDNS routing
- Anycast IP routing
- Content delivery networks (CDNs)

Your request is routed to the closest available data center, minimizing latency and improving response time.

## 7. Server Processing

Once the request reaches the appropriate server:

- The application server processes the request.
- It may query databases, caches (like Redis), or microservices.
- The server generates an HTTP response.

## 8. Response Returned to the Browser

The server sends back a response containing:

- HTML
- CSS
- JavaScript
- Images

The browser then renders the page using its rendering engine.

DNS resolution → TCP/TLS handshake → Load balancing → Distributed data centers → Server processing → Response rendering.

All of this typically happens in milliseconds.

The next time you type www.google.com, remember that you just interacted with one of the most complex distributed systems ever built.

Understanding these fundamentals helps engineers design scalable, resilient, and high-performance systems.
    `,
  },
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
