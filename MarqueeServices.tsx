import { motion } from "framer-motion";

const services = [
  "Game Development Group",
  "•",
  "Game Buying Group",
  "•",
  "Asset Purchase Design",
  "•",
  "Portfolio Applications",
  "•",
];

export function MarqueeServices() {
  return (
    <div className="w-full bg-primary py-4 md:py-6 overflow-hidden relative z-10">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex gap-8 items-center"
          animate={{ x: "-50%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Repeat 4 times to ensure seamless loop on large screens */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-8 items-center shrink-0">
              {services.map((service, index) => (
                <span
                  key={`${i}-${index}`}
                  className={`text-lg md:text-2xl font-bold tracking-tight uppercase ${
                    service === "•" ? "text-black/40" : "text-black md:text-white mix-blend-hard-light"
                  }`}
                >
                  {service}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
