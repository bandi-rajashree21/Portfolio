import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const [filter, setFilter] = useState<string | null>(null);

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));
  const filtered = filter
    ? projects.filter((p) => p.tags.includes(filter))
    : projects;

  return (
    <div className="content-width page-section space-y-6">
      <div className="animate-fade-in">
        <h1>Projects</h1>
        <p className="text-muted-foreground mt-1">
          A selection of things I've built and worked on.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <button
          onClick={() => setFilter(null)}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            filter === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent/20 hover:text-accent"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag === filter ? null : tag)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filter === tag
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent/20 hover:text-accent"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
        {filtered.map((project) => (
          <div
            key={project.title}
            className="p-6 rounded-xl border bg-card hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium group-hover:text-primary transition-colors">{project.title}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      aria-label="View source on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      aria-label="View live site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const projects = [
  {
    title: "BBSI myBBSI Portal",
    description: "Led backend development for the Electronic Employee File Cabinet (EEFC) module in the myBBSI HRIS portal, building secure Spring Boot microservices integrated with Box for centralized employee document management. ",
    tags: ["Spring Boot", "Java", "React", "Apache Kafka", "Box API", "Microservices"],
    github: null,
    live: null,
  },
 
  {
    title: "Multi-tenant Performance Management",
    description: "Implemented a multi-tenant SaaS platform for Performance Management with strict tenant data isolation and role-based access control (RBAC) for enterprise-grade reliability. Achieved 99.5% uptime through fault-tolerant design.",
    tags: ["React","Spring Boot", "Multi-tenancy", "RBAC", "Enterprise", "SaaS",],
    github: null,
    live: null,
  },

   {
    title: "Scribe Virtual Classroom Platform",
    description: "Designed and implemented a role-based virtual classroom platform with secure authentication and granular permissions for Admins, Principals, Faculty, and Students. Built modular features including classroom management, file uploads, threaded discussions, attendance tracking, and real-time notifications.",
    tags: ["Node.js", "React", "PostgreSQL", "Prisma", "Real-time"],
    github: null,
    live: null,
  },
 
];

export default Projects;
