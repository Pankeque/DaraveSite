import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useRoute } from "wouter";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug provided");
      const url = buildUrl(api.blog.get.path, { slug });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch blog post");
      return res.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <a
              href="/blog"
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </a>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-zinc-400">The blog post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <a
            href="/blog"
            className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </a>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-zinc-500 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-12 pb-12 border-b border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {post.author.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-zinc-500">Author</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-xl text-zinc-300 mb-8 leading-relaxed">
              {post.excerpt}
            </div>
            <div className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-12 border-t border-zinc-800">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all posts
            </a>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
