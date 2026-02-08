import { motion } from "framer-motion";

export function RippleBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-zinc-800/30"
          initial={{ width: "20vw", height: "20vw", opacity: 0 }}
          animate={{
            width: ["20vw", "60vw", "90vw"],
            height: ["20vw", "60vw", "90vw"],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 2.5,
            ease: "easeInOut",
          }}
          style={{
            borderWidth: "1px",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}
