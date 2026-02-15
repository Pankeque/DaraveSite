import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Get API base URL for production
const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  
  // Check for Vite environment variable (set at build time)
  const viteApiUrl = (import.meta as any).env?.VITE_API_URL;
  if (viteApiUrl && viteApiUrl !== '%%API_URL%%') {
    return viteApiUrl;
  }
  
  // Check for window.ENV (for runtime injection)
  const windowEnv = (window as any).ENV?.API_URL;
  if (windowEnv && windowEnv !== '%%API_URL%%') {
    return windowEnv;
  }
  
  // Fallback: detect production and use known backend URL
  if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
    // Production frontend - use the Render backend
    return 'https://darave-studios-api.onrender.com';
  }
  
  // Development - use relative paths (Vite proxy)
  return '';
};

const API_BASE_URL = getApiBaseUrl();

export default function Form() {
  const { toast } = useToast();
  
  // Game form state
  const [gameForm, setGameForm] = useState({
    email: "",
    gameName: "",
    gameLink: "",
    dailyActiveUsers: "",
    totalVisits: "",
    revenue: "",
  });
  
  // Asset form state
  const [assetForm, setAssetForm] = useState({
    email: "",
    assetsCount: "",
    assetLinks: "",
    additionalNotes: "",
  });
  
  const [isGameSubmitting, setIsGameSubmitting] = useState(false);
  const [isAssetSubmitting, setIsAssetSubmitting] = useState(false);

  // Helper function to safely parse JSON response
  const safeParseJSON = async (res: Response): Promise<{ data: any; error: string | null }> => {
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const text = await res.text();
        if (!text || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          return { data: null, error: "Server returned HTML instead of JSON" };
        }
        try {
          return { data: JSON.parse(text), error: null };
        } catch {
          return { data: null, error: "Invalid JSON response" };
        }
      } else {
        const text = await res.text();
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          return { data: null, error: "Server returned HTML instead of JSON" };
        }
        return { data: { message: text }, error: null };
      }
    } catch (e) {
      return { data: null, error: "Failed to read response" };
    }
  };

  const handleGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGameSubmitting(true);
    
    console.log("[DEBUG] Game form submission started:", gameForm);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions/game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(gameForm),
      });
      
      console.log("[DEBUG] Game form response status:", response.status);
      
      const { data, error } = await safeParseJSON(response);
      
      if (error) {
        toast({
          title: "Error",
          description: "A server error occurred. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Game metrics submitted successfully.",
        });
        // Reset form
        setGameForm({
          email: "",
          gameName: "",
          gameLink: "",
          dailyActiveUsers: "",
          totalVisits: "",
          revenue: "",
        });
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to submit game metrics.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("[ERROR] Game submission error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGameSubmitting(false);
    }
  };

  const handleAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssetSubmitting(true);
    
    console.log("[DEBUG] Asset form submission started:", assetForm);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions/asset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(assetForm),
      });
      
      console.log("[DEBUG] Asset form response status:", response.status);
      
      const { data, error } = await safeParseJSON(response);
      
      if (error) {
        toast({
          title: "Error",
          description: "A server error occurred. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Asset information submitted successfully.",
        });
        // Reset form
        setAssetForm({
          email: "",
          assetsCount: "",
          assetLinks: "",
          additionalNotes: "",
        });
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to submit asset information.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("[ERROR] Asset submission error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssetSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="text-xl font-bold">Form</span>
          </a>
          <a
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold tracking-tighter mb-4">Submit Your Metrics</h1>
          <p className="text-zinc-400 text-lg mb-12">
            Share your game metrics and assets with us. This information helps us understand your project better.
          </p>

          {/* Game Form Section */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold tracking-tight mb-6 text-primary">Game Information</h2>
              <form onSubmit={handleGameSubmit} className="space-y-6 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={gameForm.email}
                    onChange={(e) => setGameForm({ ...gameForm, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Game Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={gameForm.gameName}
                    onChange={(e) => setGameForm({ ...gameForm, gameName: e.target.value })}
                    placeholder="Enter your game name"
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Game Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={gameForm.gameLink}
                    onChange={(e) => setGameForm({ ...gameForm, gameLink: e.target.value })}
                    placeholder="https://www.roblox.com/games/..."
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                      Daily Active Users
                    </label>
                    <input
                      type="number"
                      value={gameForm.dailyActiveUsers}
                      onChange={(e) => setGameForm({ ...gameForm, dailyActiveUsers: e.target.value })}
                      placeholder="e.g., 1000"
                      className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                      Total Visits
                    </label>
                    <input
                      type="number"
                      value={gameForm.totalVisits}
                      onChange={(e) => setGameForm({ ...gameForm, totalVisits: e.target.value })}
                      placeholder="e.g., 50000"
                      className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Revenue (Robux)
                  </label>
                  <input
                    type="number"
                    value={gameForm.revenue}
                    onChange={(e) => setGameForm({ ...gameForm, revenue: e.target.value })}
                    placeholder="e.g., 10000"
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isGameSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide uppercase hover:shadow-[0_0_20px_rgba(163,255,0,0.4)] transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGameSubmitting ? "Submitting..." : "Submit Game Metrics"}
                </motion.button>
              </form>
            </motion.div>
          </section>

          {/* Assets Form Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold tracking-tight mb-6 text-primary">Assets Information</h2>
              <form onSubmit={handleAssetSubmit} className="space-y-6 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={assetForm.email}
                    onChange={(e) => setAssetForm({ ...assetForm, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Assets Count
                  </label>
                  <input
                    type="number"
                    value={assetForm.assetsCount}
                    onChange={(e) => setAssetForm({ ...assetForm, assetsCount: e.target.value })}
                    placeholder="e.g., 25"
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Asset Links
                  </label>
                  <textarea
                    rows={4}
                    value={assetForm.assetLinks}
                    onChange={(e) => setAssetForm({ ...assetForm, assetLinks: e.target.value })}
                    placeholder="Paste your asset links here (one per line)"
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Additional Notes
                  </label>
                  <textarea
                    rows={4}
                    value={assetForm.additionalNotes}
                    onChange={(e) => setAssetForm({ ...assetForm, additionalNotes: e.target.value })}
                    placeholder="Any additional information about your assets..."
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isAssetSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide uppercase hover:shadow-[0_0_20px_rgba(163,255,0,0.4)] transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAssetSubmitting ? "Submitting..." : "Submit Assets Info"}
                </motion.button>
              </form>
            </motion.div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
