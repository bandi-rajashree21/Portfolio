/**
 * Admin Dashboard
 * Main dashboard for managing content with tabs for different sections
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AdminBlogPage from './AdminBlogPage';
import AdminProjectsPage from './AdminProjectsPage';
import AdminMessagesPage from './AdminMessagesPage';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('blog');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 text-sm mt-1">Welcome, {user?.name || user?.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="space-y-4">
            <AdminBlogPage />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <AdminProjectsPage />
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <AdminMessagesPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
