import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { Loader2, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  media?: string;
  links: { [key: string]: string };
}

interface FormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string;
  featured: boolean;
  media: string;
  links: string;
}

export default function AdminProjectsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    description: '',
    category: '',
    technologies: '',
    featured: false,
    media: '',
    links: '',
  });

  // Fetch projects using useQuery
  const { data: projects = [], isLoading: loading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const data: any = await apiClient.getProjects();
      const projectsArray = Array.isArray(data) ? data : (data?.data?.items || data?.projects || []);
      return projectsArray;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (!token) throw new Error('Not authenticated');
      return apiClient.createProject(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setFormData({
        title: '',
        slug: '',
        description: '',
        category: '',
        technologies: '',
        featured: false,
        media: '',
        links: '',
      });
      setIsOpen(false);
      setError(null);
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      if (!token) throw new Error('Not authenticated');
      return apiClient.updateProject(id, payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setFormData({
        title: '',
        slug: '',
        description: '',
        category: '',
        technologies: '',
        featured: false,
        media: '',
        links: '',
      });
      setEditingId(null);
      setIsOpen(false);
      setError(null);
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Not authenticated');
      return apiClient.deleteProject(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setDeleteId(null);
      setError(null);
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      links: formData.links
        ? Object.fromEntries(
            formData.links.split('\n').map((line) => {
              const [key, value] = line.split(':').map((s) => s.trim());
              return [key, value];
            })
          )
        : {},
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Handle edit
  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      category: project.category,
      technologies: (project.technologies || []).join(', '),
      featured: project.featured,
      media: project.media || '',
      links: Object.entries(project.links || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', '),
    });
    setEditingId(project.id);
    setIsOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId);
  };

  // Handle dialog open/close
  const handleDialogOpenChange = (value: boolean) => {
    setIsOpen(value);
    if (!value) {
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        category: '',
        technologies: '',
        featured: false,
        media: '',
        links: '',
      });
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>
      )}

      {/* Add New Project Button */}
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Project
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Project' : 'Create New Project'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the project details' : 'Add a new project to your portfolio'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="project-slug"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Web, Mobile, AI"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Technologies (comma-separated)</label>
              <Input
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Media URL (optional)</label>
              <Input
                value={formData.media}
                onChange={(e) => setFormData({ ...formData, media: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Links (key: value, comma-separated)</label>
              <Input
                value={formData.links}
                onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                placeholder="github: https://github.com/..., live: https://example.com"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured
              </label>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingId ? 'Update' : 'Create'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">No projects yet. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.category}</CardDescription>
                  </div>
                  {project.featured && <Badge>Featured</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.technologies || []).map((tech, index) => (
                    <Badge key={`${project.id}-tech-${index}`} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                {Object.entries(project.links || {}).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(project.links || {}).map(([linkKey, value]: [string, string], index) => (
                      <a
                        key={`${project.id}-link-${index}`}
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        {linkKey}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(project.id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{project.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex gap-2 justify-end">
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete} 
                          className="bg-red-600"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
