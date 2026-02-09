import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Items that appear in navbar on desktop
const navbarItems = ["Home", "About", "Portfolio", "Blog", "Contact"];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  // Build menu items based on authentication status
  const allMenuItems = [
    { title: "Home", href: "#home", requiresAuth: false },
    { title: "About", href: "#about", requiresAuth: false },
    { title: "Portfolio", href: "#portfolio", requiresAuth: false },
    { title: "Blog", href: "/blog", requiresAuth: false },
    { title: "Contact", href: "#contact", requiresAuth: false },
    { title: "Ticketmatics", href: "/ticketmatics", requiresAuth: false },
    { title: "Ticketmatics Dashboard", href: "/ticketmatics/dashboard", requiresAuth: true },
    { title: "Visucord", href: "/visucord", requiresAuth: false },
    { title: "Visucord Dashboard", href: "/visucord/dashboard", requiresAuth: true },
    { title: "Privacy Policy", href: "/privacy", requiresAuth: false },
    { title: "Terms of Service", href: "/terms", requiresAuth: false },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Filter menu items based on screen size and authentication
  const menuItems = (isMobile
    ? allMenuItems
    : allMenuItems.filter(item => !navbarItems.includes(item.title))
  ).filter(item => !item.requiresAuth || user);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 border-l border-zinc-800 z-[101] p-8 flex flex-col shadow-2xl"
          >
            <div className="flex justify-end mb-12">
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 items-center">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.title}
                  href={item.href}
                  onClick={onClose}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="text-2xl font-bold tracking-tight text-zinc-300 hover:text-primary transition-colors"
                >
                  {item.title}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto pt-12 border-t border-zinc-900 text-center">
              <p className="text-sm text-zinc-500 font-medium tracking-wider uppercase">Darave Studios™</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
