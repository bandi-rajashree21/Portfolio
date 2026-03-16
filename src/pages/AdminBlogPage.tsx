/**
 * Admin Blog Page
 * Manage blog posts - Create, Read, Update, Delete
 */

import { useState, useEffect } from 'react';
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
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: number;
  published: boolean;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  published: boolean;
}

export default function AdminBlogPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    published: false,
  });

  // Fetch blog posts using useQuery
  const { data: posts = [], isLoading: loading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const data: any = await apiClient.getBlogPosts();
      const postsArray = Array.isArray(data) ? data : (data?.data?.items || data?.posts || []);
      return postsArray;
    },
  });

  // Fetch full post data when editing (to get content field)
  const editingPost = posts.find((p: BlogPost) => p.id === editingId);
  const { data: fullPostData } = useQuery({
    queryKey: ['admin-blog-post', editingPost?.slug],
    queryFn: async () => {
      if (!editingPost?.slug) throw new Error('No slug provided');
      const data: any = await apiClient.getBlogPostBySlug(editingPost.slug);
      const postData = Array.isArray(data) ? data[0] : (data?.data || data);
      return postData;
    },
    enabled: !!editingId && !!editingPost?.slug,
  });

  // Sync form data when full post data is loaded
  useEffect(() => {
    if (editingId && fullPostData) {
      setFormData({
        title: fullPostData.title,
        slug: fullPostData.slug,
        excerpt: fullPostData.excerpt,
        content: fullPostData.content || '',
        tags: (fullPostData.tags || []).join(', '),
        published: fullPostData.published || false,
      });
    }
  }, [editingId, fullPostData]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (!token) throw new Error('Not authenticated');
      return apiClient.createBlogPost(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setFormData({ title: '', slug: '', excerpt: '', content: '', tags: '', published: false });
      setIsOpen(false);
      setError(null);
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      if (!token) throw new Error('Not authenticated');
      return apiClient.updateBlogPost(id, payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setFormData({ title: '', slug: '', excerpt: '', content: '', tags: '', published: false });
      setEditingId(null);
      setIsOpen(false);
      setError(null);
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err.message : 'Failed to update post');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Not authenticated');
      return apiClient.deleteBlogPost(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setDeleteId(null);
      setError(null);
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Handle edit
  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
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
      setFormData({ title: '', slug: '', excerpt: '', content: '', tags: '', published: false });
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

      {/* Add New Post Button */}
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Post
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the post details' : 'Add a new blog post to your portfolio'}
            </DialogDescription>
          </DialogHeader>

          {editingId && !fullPostData && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          )}

          {(!editingId || fullPostData) && (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Post title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="post-slug"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Short summary of the post"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full post content"
                rows={8}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="javascript, react, typescript"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              <label htmlFor="published" className="text-sm font-medium">
                Published
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
          )}
        </DialogContent>
      </Dialog>

      {/* Blog Posts List */}
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">No blog posts yet. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.slug}</CardDescription>
                  </div>
                  <Badge variant={post.published ? 'default' : 'outline'}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(post.tags || []).map((tag, index) => (
                    <Badge key={`${post.id}-tag-${index}`} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(post)}
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
                        onClick={() => setDeleteId(post.id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{post.title}"? This action cannot be undone.
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
