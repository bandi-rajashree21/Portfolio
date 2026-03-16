import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Github } from "lucide-react";
import { apiClient } from "../services/api";

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  media?: string;
  links?: Record<string, string>;
}

const Projects = () => {
  const [filter, setFilter] = useState<string | null>(null);

  const { data: projects = [], isLoading: loading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const data: any = await apiClient.getProjects();
      const projectsArray = Array.isArray(data) ? data : (data?.data?.items || data?.projects || []);
      return projectsArray;
    },
  });

  // Get all unique technologies for filtering
  const allTags = Array.from(new Set(projects.flatMap((p) => p.technologies || [])));
  
  const filtered = filter
    ? projects.filter((p) => (p.technologies || []).includes(filter))
    : projects;

  return (
    <div className="content-width page-section space-y-6">
      <div className="animate-fade-in">
        <h1>Projects</h1>
        <p className="text-muted-foreground mt-1">
          A selection of things I've built and worked on.
        </p>
      </div>


      <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
        {loading && (
          <p className="text-sm text-muted-foreground py-8 text-center">Loading projects...</p>
        )}
        {error && (
          <p className="text-sm text-red-500 py-8 text-center">{error}</p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">No projects found.</p>
        )}
        {!loading && filtered.map((project) => (
          <div
            key={project.id}
            className="p-6 rounded-xl border bg-card hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{project.category}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {project.links && Object.entries(project.links).map(([linkKey, url]) => {
                    if (linkKey === 'github') {
                      return (
                        <a
                          key={linkKey}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          aria-label="View source on GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      );
                    } else {
                      return (
                        <a
                          key={linkKey}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                          aria-label={`View ${linkKey}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      );
                    }
                  })}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(project.technologies || []).map((tech, index) => (
                  <span
                    key={`${project.id}-tech-${index}`}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  >
                    {tech}
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

export default Projects;
