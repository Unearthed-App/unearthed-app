"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  Brain,
  Zap,
  Shield,
  Link as LinkIcon,
  Search,
} from "lucide-react";
import { Crimson_Pro } from "next/font/google";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

const features = [
  {
    icon: BookOpen,
    title: "Auto Sync Highlights",
    description:
      "Automatically sync from Kindle and KOReader. Works seamlessly with both cloud and local solutions.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient:
      "from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20",
  },
  {
    icon: Brain,
    title: "Smart Merge",
    description:
      "Intelligently merges your Kindle and KOReader highlights for the same book into one unified view. No duplicates, manual merging required.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient:
      "from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20",
  },
  {
    icon: Zap,
    title: "Daily Reflections",
    description:
      "Get personalised daily reflections that surface your most important quotes and ideas. Available in both Online and Local.",
    gradient: "from-amber-500 to-orange-500",
    bgGradient:
      "from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data stays yours. No Amazon credentials stored. Complete control over your reading data.",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient:
      "from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20",
  },
  {
    icon: LinkIcon,
    title: "Seamless Integrations",
    description:
      "Sync to Notion, Obsidian, Capacities, and Supernotes. Choose 'Unearthed Online' for all platforms or 'Unearthed Local' for direct Obsidian sync.",
    gradient: "from-rose-500 to-red-500",
    bgGradient:
      "from-rose-50/50 to-red-50/50 dark:from-rose-950/20 dark:to-red-950/20",
  },
  {
    icon: Search,
    title: "Powerful Search",
    description:
      "Search across all your books, highlights, and notes. Find connections you never knew existed.",
    gradient: "from-indigo-500 to-violet-500",
    bgGradient:
      "from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function HomeFeatures() {
  return (
    <section className="relative w-full py-24 md:py-40 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full border-2 border-black bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-[3px_3px_0px_rgba(0,0,0,1)] text-sm font-bold uppercase tracking-wider">
              Some Features
            </span>
          </motion.div>

          <h2
            className={`${crimsonPro.className} font-black text-4xl md:text-5xl lg:text-6xl mb-6 `}
          >
            Create Lasting Knowledge
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            Transform your reading highlights into a powerful knowledge system.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <motion.div
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  }}
                  className="h-full relative"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <div className="relative h-full p-8 border-3 border-black rounded-xl bg-card shadow-[6px_6px_0px_rgba(0,0,0,1)] group-hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all duration-300 overflow-hidden">
                    <motion.div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <div
                        className={`mb-6 inline-flex items-center justify-center w-16 h-16 border-3 border-black rounded-xl bg-gradient-to-br ${feature.gradient} shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-300`}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 5,
                            ease: "easeInOut",
                          }}
                        >
                          <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                        </motion.div>
                      </div>
                    </motion.div>

                    <h3
                      className={`font-black text-2xl mb-3 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {feature.description}
                    </p>

                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl opacity-50" />
    </section>
  );
}
