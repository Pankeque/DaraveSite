import { motion } from "framer-motion";

export default function Form() {
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

          <form className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                Game Name
              </label>
              <input
                type="text"
                placeholder="Enter your game name"
                className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                Game Link
              </label>
              <input
                type="url"
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
                  placeholder="e.g., 50000"
                  className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                  Revenue (Robux)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10000"
                  className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                  Assets Count
                </label>
                <input
                  type="number"
                  placeholder="e.g., 25"
                  className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300 uppercase tracking-wider">
                Asset Links
              </label>
              <textarea
                rows={4}
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
                placeholder="Any additional information about your game or assets..."
                className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide uppercase hover:shadow-[0_0_20px_rgba(163,255,0,0.4)] transition-shadow duration-300"
            >
              Submit Metrics
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
