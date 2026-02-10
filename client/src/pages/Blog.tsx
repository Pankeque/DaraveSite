import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Loader2, Search, Tag, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Blog() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch blog posts from API
  const { data: blogPosts, isLoading, error, refetch } = useQuery({
    queryKey: ["blogPosts", selectedCategory],
    queryFn: async () => {
      let url = api.blog.list.path;
      if (selectedCategory) {
        url = `/api/blog/category/${encodeURIComponent(selectedCategory)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    },
  });

  // Fetch tags
  const { data: tags } = useQuery({
    queryKey: ["blogTags"],
    queryFn: async () => {
      const res = await fetch(api.blog.tags.list.path);
      if (!res.ok) throw new Error("Failed to fetch tags");
      return res.json();
    },
  });

  // Search posts
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/blog/search/${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Search failed");
      const results = await res.json();
      // Update the displayed posts with search results
      return results;
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not perform search",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Fallback data if API fails
  const fallbackPosts = [
    {
      id: 1,
      title: "Building Scalable Discord Bots: Best Practices",
      excerpt: "Learn how to build Discord bots that can handle millions of users without breaking a sweat.",
      author: "Darave Studios",
      createdAt: "2026-02-01",
      readTime: "5 min read",
      category: "Development",
      slug: "building-scalable-discord-bots",
      featuredImage: null,
    },
    {
      id: 2,
      title: "The Future of Game Development on Roblox",
      excerpt: "Exploring the latest trends and technologies shaping the future of Roblox game development.",
      author: "Darave Studios",
      createdAt: "2026-01-28",
      readTime: "8 min read",
      category: "Gaming",
      slug: "future-of-roblox-development",
      featuredImage: null,
    },
    {
      id: 3,
      title: "Optimizing Performance in Large-Scale Applications",
      excerpt: "Tips and tricks for keeping your applications fast and responsive as they grow.",
      author: "Darave Studios",
      createdAt: "2026-01-25",
      readTime: "6 min read",
      category: "Development",
      slug: "optimizing-performance",
      featuredImage: null,
    },
    {
      id: 4,
      title: "Community Management: Lessons Learned",
      excerpt: "Our experience managing large gaming communities and what we've learned along the way.",
      author: "Darave Studios",
      createdAt: "2026-01-20",
      readTime: "7 min read",
      category: "Community",
      slug: "community-management-lessons",
      featuredImage: null,
    },
    {
      id: 5,
      title: "Introduction to Discord Bot Analytics",
      excerpt: "Understanding your bot's usage patterns and making data-driven decisions.",
      author: "Darave Studios",
      createdAt: "2026-01-15",
      readTime: "5 min read",
      category: "Analytics",
      slug: "discord-bot-analytics",
      featuredImage: null,
    },
    {
      id: 6,
      title: "Creating Engaging User Experiences",
      excerpt: "Design principles for creating applications that users love to interact with.",
      author: "Darave Studios",
      createdAt: "2026-01-10",
      readTime: "6 min read",
      category: "Design",
      slug: "engaging-user-experiences",
      featuredImage: null,
    },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    try {
      const res = await fetch(api.newsletter.subscribe.path, {
        method: api.newsletter.subscribe.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Subscription failed");
      }

      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our latest updates and insights.",
        className: "bg-primary text-black border-none",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  // Get unique categories from posts
  const categories = [...new Set((blogPosts || fallbackPosts).map((post: any) => post.category))];

  const postsToDisplay = blogPosts || fallbackPosts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Blog</h1>
          <div className="flex items-center gap-4">
            {user && (
              <a
                href="/blog/admin"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Manage Blog
              </a>
            )}
            <a
              href="/"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Insights & Updates
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
              Thoughts on game development, Discord bots, and building digital communities.
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search articles..."
                  className="pl-10 bg-zinc-900 border-zinc-800 focus:border-primary"
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching} className="bg-primary text-black hover:bg-primary/90">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-6 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-zinc-500 mr-2">Filter by:</span>
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className={`cursor-pointer ${selectedCategory === null ? 'bg-primary text-black' : 'border-zinc-700 text-zinc-400 hover:text-white'}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {categories.map((category: string) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === category ? 'bg-primary text-black' : 'border-zinc-700 text-zinc-400 hover:text-white'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">Failed to load blog posts</p>
              <p className="text-zinc-400">Showing fallback content</p>
            </div>
          ) : null}
          
          {postsToDisplay.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg">No posts found</p>
              <p className="text-zinc-500 text-sm mt-2">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postsToDisplay.map((post: any, index: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a href={`/blog/${post.slug}`}>
                    <Card className="bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/60 hover:border-primary/50 transition-all duration-300 h-full group cursor-pointer overflow-hidden">
                      {/* Featured Image */}
                      {post.featuredImage ? (
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video w-full bg-zinc-800/50 flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-zinc-600" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt || post.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-zinc-400 mt-2 line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-zinc-500">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </div>
                          <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                            Read more
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tags Section */}
      {tags && tags.length > 0 && (
        <section className="py-12 px-6 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:text-primary hover:border-primary cursor-pointer transition-colors"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Stay Updated</h3>
          <p className="text-xl text-zinc-400 mb-8">
            Subscribe to our newsletter for the latest updates and insights.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              required
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="bg-primary text-black px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubscribing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
