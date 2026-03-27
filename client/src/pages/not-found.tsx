import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <AlertCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">404</h1>
        <p className="text-xl md:text-2xl font-semibold text-white mb-2">Page Not Found</p>
        <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block bg-primary text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide uppercase hover:shadow-[0_0_20px_rgba(163,255,0,0.4)] transition-shadow duration-300"
        >
          Back to Home
        </a>
      </motion.div>
    </div>
  );
}
