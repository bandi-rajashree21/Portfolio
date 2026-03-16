import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ExternalLink, Star, GitFork, ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  language: string | null;
}

const GitHubUsername = "bandi-rajashree21";

const GitHubRepos = () => {
  const [page, setPage] = useState(1);
  const [allRepos, setAllRepos] = useState<Repository[]>([]);

  // Fetch repositories from GitHub API
  const { data, isLoading, error } = useQuery({
    queryKey: ['github-repos', GitHubUsername, page],
    queryFn: async () => {
      const response = await fetch(
        `https://api.github.com/users/${GitHubUsername}/repos?sort=stars&per_page=50&page=${page}`
      );
      if (!response.ok) throw new Error('Failed to fetch repositories');
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Append new repos to state when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      if (page === 1) {
        setAllRepos(data);
      } else {
        setAllRepos((prev) => [...prev, ...data]);
      }
    }
  }, [data, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="content-width page-section space-y-6">
      <Link
        to="/contact"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Contact
      </Link>

      <div className="animate-fade-in">
        <h1>GitHub Repositories</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl leading-relaxed">
          My recent repositories 
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          Failed to load repositories. Please try again later.
        </div>
      )}

      {!isLoading && !error && allRepos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No repositories found</p>
        </div>
      )}

      {!isLoading && !error && allRepos.length > 0 && (
        <>
          <div className="grid gap-4 animate-fade-in">
            {allRepos.map((repo: Repository) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-lg border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                      {repo.name}
                    </h3>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {repo.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                </div>

                <div className="flex flex-wrap gap-3 items-center mb-4">
                  {repo.language && (
                    <Badge variant="outline" className="text-sm">
                      {repo.language}
                    </Badge>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4" />
                      {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <GitFork className="w-4 h-4" />
                      {repo.forks_count}
                    </span>
                  )}
                </div>

                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {repo.topics.map((topic: string) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              variant="outline"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Repositories"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default GitHubRepos;
