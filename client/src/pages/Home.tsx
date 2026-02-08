import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Twitter, Gamepad2, Disc, Menu, ExternalLink, User, LogOut } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { RippleBackground } from "@/components/RippleBackground";
import { MarqueeServices } from "@/components/MarqueeServices";
import { MobileMenu } from "@/components/MobileMenu";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.9]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white font-bold text-xl tracking-tighter"
          >
            DS™
          </motion.div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <motion.a
              href="#home"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors"
            >
              Home
            </motion.a>
            <motion.a
              href="#about"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors"
            >
              About
            </motion.a>
            <motion.a
              href="#portfolio"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-zinc-400 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors"
            >
              Portfolio
            </motion.a>
            <motion.a
              href="/blog"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-400 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors"
            >
              Blog
            </motion.a>
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-zinc-400 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors"
            >
              Contact
            </motion.a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-black px-6 py-2.5 rounded-full font-bold text-sm tracking-wide uppercase hover:shadow-[0_0_20px_rgba(163,255,0,0.4)] transition-shadow duration-300 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {user.name}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-950 border-zinc-800 text-white">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer hover:bg-zinc-900 focus:bg-zinc-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-black px-6 py-2.5 rounded-full font-bold text-sm tracking-wide uppercase hover:shadow-[0_0_20px_rgba(163,255,0,0.4)] transition-shadow duration-300"
            >
              Register
            </motion.button>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-white hover:text-primary transition-colors"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <RippleBackground />
        
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white mb-6">
              Darave <span className="text-zinc-600">Studios</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-zinc-400 text-sm md:text-xl uppercase tracking-widest font-medium mb-12"
          >
            Currently available for networking worldwide
          </motion.p>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
          >
            <button 
              className="group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-primary hover:border-primary transition-all duration-300"
              aria-label="Play Reel"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-current group-hover:text-black transition-colors duration-300 ml-1" />
              <div className="absolute inset-0 rounded-full border border-white/10 scale-125 opacity-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Marquee Section */}
      <MarqueeServices />

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              We craft immersive digital experiences and high-fidelity assets for the gaming community.
            </h2>
            <p className="text-zinc-400 leading-relaxed max-w-md">
              Darave Studios™ is a premier game development group that has created viral applications such as Robbers. We specialize in pushing the boundaries of what's possible on modern gaming platforms.
            </p>
          </div>
          
          <div className="flex flex-col gap-6 md:items-end">
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Disc className="w-5 h-5" />} label="Discord" />
              <SocialLink href="#" icon={<Gamepad2 className="w-5 h-5" />} label="Roblox" />
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} label="Twitter" />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Portfolio</h2>
          <p className="text-zinc-500 uppercase tracking-widest text-sm">Featured Applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((id) => (
            <motion.div
              key={id}
              whileHover={{ y: -10 }}
              className="group bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-900/60 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Application {id}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider group/link">
                View Project <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 md:py-32 px-6 md:px-12 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
            <div className="space-y-6">
              <div className="text-white font-bold text-3xl tracking-tighter">DS™</div>
              <p className="text-zinc-500 max-w-sm">
                Pushing the boundaries of game development and asset creation since 2024.
              </p>
              <div className="flex gap-4">
                <SocialLink href="#" icon={<Disc className="w-5 h-5" />} label="Discord" />
                <SocialLink href="#" icon={<Gamepad2 className="w-5 h-5" />} label="Roblox" />
                <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} label="Twitter" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 md:gap-24">
              <div className="space-y-6">
                <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.2em]">Navigation</p>
                <ul className="space-y-4">
                  {["Home", "About", "Portfolio", "Blog", "Contact"].map(item => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-zinc-400 hover:text-white transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.2em]">Legal & Dashboards</p>
                <ul className="space-y-4">
                  <li><a href="/ticketmatics" className="text-zinc-400 hover:text-white transition-colors">Ticketmatics</a></li>
                  <li><a href="/visucord" className="text-zinc-400 hover:text-white transition-colors">Visucord</a></li>
                  <li><a href="/privacy" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-zinc-900">
            <p className="text-xs text-zinc-600 uppercase tracking-wider">
              © {new Date().getFullYear()} Darave Studios. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="/terms" className="text-[10px] text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors">Terms</a>
              <a href="/privacy" className="text-[10px] text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href}
      className="p-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-primary hover:border-primary hover:bg-zinc-900 transition-all duration-300 group"
      aria-label={label}
    >
      <span className="group-hover:scale-110 block transition-transform duration-300">
        {icon}
      </span>
    </a>
  );
}
