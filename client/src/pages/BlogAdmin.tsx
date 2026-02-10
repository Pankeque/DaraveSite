import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Trash2, Edit, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  readTime: string;
  featuredImage: string | null;
  published: boolean;
  createdAt: string;
}

export default function BlogAdmin() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [featuredImage, setFeaturedImage] = useState("");
  const [published, setPublished] = useState(true);

  // Fetch existing posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  // Create post mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create post");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      toast({
        title: "Post created!",
        description: "Your blog post has been published.",
        className: "bg-primary text-primary-foreground border-none",
      });
      resetForm();
      setIsCreating(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update post mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update post");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      toast({
        title: "Post updated!",
        description: "Your blog post has been updated.",
        className: "bg-primary text-primary-foreground border-none",
      });
      resetForm();
      setEditingPost(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete post");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      toast({
        title: "Post deleted",
        description: "The blog post has been removed.",
        className: "bg-primary text-primary-foreground border-none",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setExcerpt("");
    setCategory("");
    setReadTime("5 min read");
    setFeaturedImage("");
    setPublished(true);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Auto-generate slug from title
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      title,
      slug,
      content,
      excerpt,
      author: user?.name || "Darave Studios",
      category,
      readTime,
      featuredImage: featuredImage || null,
      published,
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: postData });
    } else {
      createMutation.mutate(postData);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setExcerpt(post.excerpt);
    setCategory(post.category);
    setReadTime(post.readTime);
    setFeaturedImage(post.featuredImage || "");
    setPublished(post.published);
    setIsCreating(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="bg-zinc-900/40 border-zinc-800 p-8 text-center">
          <CardTitle className="mb-4">Authentication Required</CardTitle>
          <CardDescription className="mb-6">
            Please log in to access the Blog Admin
          </CardDescription>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-black px-6 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Blog Admin</h1>
            <p className="text-xs text-zinc-500">Create and manage blog posts</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/blog"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              View Blog
            </a>
            <a
              href="/"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post List */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900/40 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your Posts</CardTitle>
                  <Button
                    onClick={() => {
                      resetForm();
                      setEditingPost(null);
                      setIsCreating(true);
                    }}
                    size="sm"
                    className="bg-primary text-black hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-3">
                    {posts.map((post: BlogPost) => (
                      <div
                        key={post.id}
                        className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{post.title}</h3>
                            <p className="text-xs text-zinc-500 mt-1">{post.category}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              onClick={() => handleEdit(post)}
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-zinc-400 hover:text-white"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteMutation.mutate(post.id)}
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-zinc-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            post.published 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500">
                    <p>No posts yet</p>
                    <p className="text-sm mt-1">Create your first blog post!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {isCreating || editingPost ? (
              <Card className="bg-zinc-900/40 border-zinc-800">
                <CardHeader>
                  <CardTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
                  <CardDescription>
                    {editingPost ? 'Update your blog post' : 'Write a new blog post for your audience'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="Post title"
                          required
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="post-url-slug"
                          required
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="Development"
                          required
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="readTime">Read Time</Label>
                        <Input
                          id="readTime"
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          placeholder="5 min read"
                          required
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="published">Status</Label>
                        <select
                          id="published"
                          value={published ? 'published' : 'draft'}
                          onChange={(e) => setPublished(e.target.value === 'published')}
                          className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="featuredImage">Featured Image URL</Label>
                      <Input
                        id="featuredImage"
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief description of the post..."
                        required
                        rows={2}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content (Markdown)</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your blog post content here..."
                        required
                        rows={12}
                        className="bg-zinc-800 border-zinc-700 font-mono text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        type="submit"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className="bg-primary text-black hover:bg-primary/90"
                      >
                        {createMutation.isPending || updateMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {editingPost ? 'Update Post' : 'Publish Post'}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCreating(false);
                          setEditingPost(null);
                          resetForm();
                        }}
                        className="border-zinc-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-zinc-900/40 border-zinc-800 h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <Edit className="w-8 h-8 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Post Selected</h3>
                  <p className="text-zinc-500 mb-4">Select a post to edit or create a new one</p>
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-black hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Post
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
