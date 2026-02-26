import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="content-width page-section">
      <div className="space-y-5 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          Hi, I'm a <span className="gradient-text">Software Developer</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Full-stack Developer with experience building scalable microservices and event-driven systems using Spring Boot, Node.js, and React. 
          Skilled in backend development, API design, database optimization, and multi-tenant SaaS platforms.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
          >
            View Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border text-foreground hover:bg-secondary transition-colors"
          >
            Read Blog
          </Link>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: "150ms" }}>
        {/* Recent Projects */}
        <section>
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            Recent Projects
          </h2>
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <Link
                key={project.title}
                to="/projects"
                className="block group p-3 rounded-lg hover:bg-secondary/60 transition-colors border border-transparent hover:border-border"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {project.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5 bg-secondary px-2 py-0.5 rounded">
                    {project.year}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Writing */}
        <section>
          <h2 className="text-xs font-semibold text-accent uppercase tracking-wider mb-4">
            Recent Writing
          </h2>
          <div className="space-y-2">
            {recentPosts.map((post) => (
              <Link
                key={post.title}
                to="/blog"
                className="block group p-3 rounded-lg hover:bg-secondary/60 transition-colors border border-transparent hover:border-border"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5 bg-secondary px-2 py-0.5 rounded">
                    {post.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const recentProjects = [
  { title: "BBSI myBBSI Portal", description: "Enterprise HRIS portal with Electronic Employee File Cabinet and Performance Management modules", year: "2024" },
  { title: "Scribe Virtual Classroom", description: "Role-based virtual classroom platform with secure authentication and granular permissions", year: "2024" },
  { title: "Multi-tenant SaaS Platform", description: "Performance Management platform for PEO companies with strict tenant data isolation", year: "2024" },
];

const recentPosts = [
  { title: "Building Microservices with Spring Boot and Kafka", date: "Feb 2025" },
  { title: "Database Optimization Strategies for Enterprise Applications", date: "Jan 2025" },
  { title: "Multi-tenant Architecture in SaaS Platforms", date: "Dec 2024" },
];

export default Index;
