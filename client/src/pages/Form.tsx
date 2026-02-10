import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Form() {
  const { toast } = useToast();
  
  // Game form state
  const [gameForm, setGameForm] = useState({
    gameName: "",
    gameLink: "",
    dailyActiveUsers: "",
    totalVisits: "",
    revenue: "",
    notes: "",
  });
  
  // Asset form state
  const [assetForm, setAssetForm] = useState({
    assetName: "",
    assetLinks: "",
    assetCount: "",
    assetType: "",
    notes: "",
  });
  
  // Loading states
  const [isGameSubmitting, setIsGameSubmitting] = useState(false);
  const [isAssetSubmitting, setIsAssetSubmitting] = useState(false);

  // Handle game form input changes
  const handleGameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGameForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle asset form input changes
  const handleAssetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssetForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit game form
  const submitGameForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGameSubmitting(true);

    try {
      const response = await fetch("/api/submissions/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: gameForm.gameName,
          gameLink: gameForm.gameLink,
          dailyActiveUsers: gameForm.dailyActiveUsers ? parseInt(gameForm.dailyActiveUsers) : null,
          totalVisits: gameForm.totalVisits ? parseInt(gameForm.totalVisits) : null,
          revenue: gameForm.revenue ? parseInt(gameForm.revenue) : null,
          notes: gameForm.notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit game metrics");
      }

      toast({
        title: "Success!",
        description: "Game metrics submitted successfully.",
      });

      // Reset form
      setGameForm({
        gameName: "",
        gameLink: "",
        dailyActiveUsers: "",
        totalVisits: "",
        revenue: "",
        notes: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit game metrics",
        variant: "destructive",
      });
    } finally {
      setIsGameSubmitting(false);
    }
  };

  // Submit asset form
  const submitAssetForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssetSubmitting(true);

    try {
      const response = await fetch("/api/submissions/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetName: assetForm.assetName,
          assetLinks: assetForm.assetLinks,
          assetCount: assetForm.assetCount ? parseInt(assetForm.assetCount) : null,
          assetType: assetForm.assetType || null,
          notes: assetForm.notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit assets");
      }

      toast({
        title: "Success!",
        description: "Assets submitted successfully.",
      });

      // Reset form
      setAssetForm({
        assetName: "",
        assetLinks: "",
        assetCount: "",
        assetType: "",
        notes: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit assets",
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
            <img 
              src="/logo-navbar.png" 
              alt="Darave Studios Logo" 
              className="h-8 w-auto"
            />
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
      <div className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold tracking-tighter mb-4">Submit Your Metrics</h1>
          <p className="text-zinc-400 text-lg mb-12">
            Share your game metrics and assets with us. This information helps us understand your project better.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Game Metrics Form */}
            <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">Game Metrics</h2>
              <form onSubmit={submitGameForm} className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Game Name *
                  </label>
                  <input
                    type="text"
                    name="gameName"
                    value={gameForm.gameName}
                    onChange={handleGameChange}
                    required
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
                    name="gameLink"
                    value={gameForm.gameLink}
                    onChange={handleGameChange}
                    required
                    placeholder="https://www.roblox.com/games/..."
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                      Daily Active Users
                    </label>
                    <input
                      type="number"
                      name="dailyActiveUsers"
                      value={gameForm.dailyActiveUsers}
                      onChange={handleGameChange}
                      placeholder="e.g., 1000"
                      min="0"
                      className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                      Total Visits
                    </label>
                    <input
                      type="number"
                      name="totalVisits"
                      value={gameForm.totalVisits}
                      onChange={handleGameChange}
                      placeholder="e.g., 50000"
                      min="0"
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
                    name="revenue"
                    value={gameForm.revenue}
                    onChange={handleGameChange}
                    placeholder="e.g., 10000"
                    min="0"
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={gameForm.notes}
                    onChange={handleGameChange}
                    rows={3}
                    placeholder="Any additional information about your game..."
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    type="submit"
                    disabled={isGameSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-primary text-black px-6 py-4 rounded-full font-bold text-sm tracking-wide uppercase hover:shadow-[0_0_20px_rgba(163,255,0,0.4)] transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGameSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Game Metrics"
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setGameForm({
                      gameName: "",
                      gameLink: "",
                      dailyActiveUsers: "",
                      totalVisits: "",
                      revenue: "",
                      notes: "",
                    })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-zinc-800 text-white px-6 py-4 rounded-full font-bold text-sm tracking-wide uppercase hover:bg-zinc-700 transition-colors duration-300"
                  >
                    Clear Form
                  </motion.button>
                </div>
              </form>
            </section>

            {/* Assets Form */}
            <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">Assets</h2>
              <form onSubmit={submitAssetForm} className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    name="assetName"
                    value={assetForm.assetName}
                    onChange={handleAssetChange}
                    required
                    placeholder="Enter asset name"
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Asset Links *
                  </label>
                  <textarea
                    name="assetLinks"
                    value={assetForm.assetLinks}
                    onChange={handleAssetChange}
                    required
                    rows={4}
                    placeholder="Paste your asset links here (one per line)"
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                      Asset Count
                    </label>
                    <input
                      type="number"
                      name="assetCount"
                      value={assetForm.assetCount}
                      onChange={handleAssetChange}
                      placeholder="e.g., 25"
                      min="0"
                      className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                      Asset Type
                    </label>
                    <select
                      name="assetType"
                      value={assetForm.assetType}
                      onChange={handleAssetChange}
                      className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    >
                      <option value="">Select type...</option>
                      <option value="Animation">Animation</option>
                      <option value="Model">Model</option>
                      <option value="Plugin">Plugin</option>
                      <option value="Audio">Audio</option>
                      <option value="Image">Image</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={assetForm.notes}
                    onChange={handleAssetChange}
                    rows={3}
                    placeholder="Any additional information about your assets..."
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    type="submit"
                    disabled={isAssetSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-primary text-black px-6 py-4 rounded-full font-bold text-sm tracking-wide uppercase hover:shadow-[0_0_20px_rgba(163,255,0,0.4)] transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAssetSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Assets"
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setAssetForm({
                      assetName: "",
                      assetLinks: "",
                      assetCount: "",
                      assetType: "",
                      notes: "",
                    })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-zinc-800 text-white px-6 py-4 rounded-full font-bold text-sm tracking-wide uppercase hover:bg-zinc-700 transition-colors duration-300"
                  >
                    Clear Form
                  </motion.button>
                </div>
              </form>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
