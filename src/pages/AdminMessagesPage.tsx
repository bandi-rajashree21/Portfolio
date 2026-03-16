import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Loader2, Mail, Eye, EyeOff, Trash2 } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages using useQuery
  const { data: messages = [], isLoading: loading } = useQuery({
    queryKey: ['admin-messages', token],
    queryFn: async () => {
      const data = await apiClient.getContactMessages(token || '');
      const messagesArray = Array.isArray(data) ? data : (data?.data?.items || data?.messages || []);
      return messagesArray;
    },
    enabled: !!token,
  });

  const toggleReadMutation = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      if (!token) throw new Error('Not authenticated');
      return apiClient.markMessageAsRead(id, read, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages', token] });
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err.message : 'Failed to update message');
    },
  });

  const handleToggleRead = (message: ContactMessage) => {
    toggleReadMutation.mutate({ id: message.id, read: !message.read });
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'unread') return !msg.read;
    if (filter === 'read') return msg.read;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({messages.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter('unread')}
        >
          Unread ({messages.filter((m) => !m.read).length})
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          onClick={() => setFilter('read')}
        >
          Read ({messages.filter((m) => m.read).length})
        </Button>
      </div>

      {/* Messages List */}
      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">
                {filter === 'unread'
                  ? 'No unread messages'
                  : filter === 'read'
                    ? 'No read messages'
                    : 'No messages yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={message.read ? 'opacity-75' : 'border-blue-200 bg-blue-50'}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{message.subject}</CardTitle>
                      {!message.read && <Badge className="bg-blue-600">New</Badge>}
                    </div>
                    <CardDescription>
                      From: {message.name} ({message.email})
                    </CardDescription>
                    <CardDescription className="text-xs mt-1">
                      {formatDate(message.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedMessage(message)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{message.subject}</DialogTitle>
                          <DialogDescription>
                            From: {message.name} ({message.email})
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Message:</p>
                            <p className="text-sm text-slate-800 whitespace-pre-wrap">
                              {message.message}
                            </p>
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatDate(message.createdAt)}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleRead(message)}
                      className="gap-2"
                    >
                      {message.read ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Mark Unread
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Mark Read
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 line-clamp-2">{message.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
