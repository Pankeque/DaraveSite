import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Twitter, Menu, ExternalLink, User, LogOut } from "lucide-react";
import { SiDiscord, SiRoblox, SiX } from "react-icons/si";
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
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <img 
              src="/logo-navbar.png" 
              alt="Darave Studios Logo" 
              className="h-10 w-auto"
            />
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

          {/* Menu Toggle - Now visible on all devices */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-white hover:text-primary transition-colors"
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
            className="flex justify-center mb-6"
          >
            <img 
              src="/logo-hero.png" 
              alt="Darave Studios" 
              className="max-w-full h-auto md:max-w-3xl lg:max-w-4xl"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-zinc-400 text-sm md:text-xl uppercase tracking-widest font-medium"
          >
            Currently available for networking worldwide
          </motion.p>
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
              <SocialLink href="https://discord.gg/guCqacvEc" icon={<SiDiscord className="w-5 h-5" />} label="Discord" />
              <SocialLink href="https://www.roblox.com/share/g/35946997" icon={<SiRoblox className="w-5 h-5" />} label="Roblox" />
              <SocialLink href="https://x.com/DaraveStudios" icon={<SiX className="w-5 h-5" />} label="Twitter" />
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
          <PortfolioCard
            title="Ladrões"
            description="An immersive Roblox game experience where players engage in thrilling heist scenarios with strategic gameplay and teamwork."
            link="https://www.roblox.com/pt/games/6785934357/Ladr-es"
            icon={<SiRoblox className="w-6 h-6 text-primary" />}
          />
          <PortfolioCard
            title="Animation Package Catalog"
            description="A comprehensive catalog of animation packages for Roblox, featuring high-quality character animations and movements."
            link="https://www.roblox.com/pt/games/137596460407088/Animation-Package-Catalog"
            icon={<SiRoblox className="w-6 h-6 text-primary" />}
          />
          <PortfolioCard
            title="Ticketmatics"
            description="Professional Discord ticket management bot with advanced features for support teams and community management."
            link="https://discord.com/oauth2/authorize?client_id=1408807066465865778"
            icon={<SiDiscord className="w-6 h-6 text-primary" />}
          />
          <PortfolioCard
            title="Visucord"
            description="Comprehensive Discord statistics and analytics bot providing deep insights into server activity and member engagement."
            link="https://discord.com/oauth2/authorize?client_id=1467926916119007520"
            icon={<SiDiscord className="w-6 h-6 text-primary" />}
          />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 md:py-32 px-6 md:px-12 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
            <div className="space-y-6">
              <img 
                src="/logo-navbar.png" 
                alt="Darave Studios Logo" 
                className="h-12 w-auto"
              />
              <p className="text-zinc-500 max-w-sm">
                Pushing the boundaries of game development and asset creation since 2024.
              </p>
              <div className="flex gap-4">
                <SocialLink href="https://discord.gg/guCqacvEc" icon={<SiDiscord className="w-5 h-5" />} label="Discord" />
                <SocialLink href="https://www.roblox.com/share/g/35946997" icon={<SiRoblox className="w-5 h-5" />} label="Roblox" />
                <SocialLink href="https://x.com/DaraveStudios" icon={<SiX className="w-5 h-5" />} label="Twitter" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 md:gap-24">
              <div className="space-y-6">
                <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.2em]">Navigation</p>
                <ul className="space-y-4">
                  <li><a href="#home" className="text-zinc-400 hover:text-white transition-colors">Home</a></li>
                  <li><a href="#about" className="text-zinc-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#portfolio" className="text-zinc-400 hover:text-white transition-colors">Portfolio</a></li>
                  <li><a href="/blog" className="text-zinc-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#contact" className="text-zinc-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.2em]">Legal & Dashboards</p>
                <ul className="space-y-4">
                  <li><a href="/ticketmatics" className="text-zinc-400 hover:text-white transition-colors">Ticketmatics</a></li>
                  {user && <li><a href="/ticketmatics/dashboard" className="text-zinc-400 hover:text-white transition-colors">Ticketmatics Dashboard</a></li>}
                  <li><a href="/visucord" className="text-zinc-400 hover:text-white transition-colors">Visucord</a></li>
                  {user && <li><a href="/visucord/dashboard" className="text-zinc-400 hover:text-white transition-colors">Visucord Dashboard</a></li>}
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
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-primary hover:border-primary hover:bg-zinc-900 transition-all duration-300 group"
      aria-label={label}
    >
      <span className="group-hover:scale-110 block transition-transform duration-300">
        {icon}
      </span>
    </a>
  );
}

function PortfolioCard({ title, description, link, icon }: { title: string; description: string; link: string; icon: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-900/60 hover:border-primary/50 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed mb-6">
        {description}
      </p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider group/link"
      >
        View Project <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
      </a>
    </motion.div>
  );
}
