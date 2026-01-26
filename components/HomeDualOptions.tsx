"use client";

import { motion } from "motion/react";
import { DualOptionSection } from "@/components/DualOptionSection";
import { Crimson_Pro } from "next/font/google";
import { Download, Cloud, Check, Sparkles } from "lucide-react";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export function HomeDualOptions() {
  return (
    <section className="relative w-full py-24 md:py-40 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-4 mb-6"
          >
            <div className="p-3 border-2 border-black rounded-lg bg-green-50 dark:bg-green-950/20 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="p-3 border-2 border-black rounded-lg bg-blue-50 dark:bg-blue-950/20 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <Cloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </motion.div>
          

          <h2
            className={`${crimsonPro.className} font-black text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent`}
          >
            Two Ways to Unearth
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-light tracking-wide">
            Choose the experience that fits your needs
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-4xl mx-auto"
          >
            <motion.div
              className="flex-1 relative group"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-200/50 to-emerald-200/50 dark:from-green-500/20 dark:to-emerald-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 border-3 border-green-600 dark:border-green-500 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 shadow-[5px_5px_0px_rgba(22,163,74,1)] group-hover:shadow-[8px_8px_0px_rgba(22,163,74,1)] transition-all duration-300">
                <motion.div
                  className="flex items-center gap-3 mb-3"
                  whileHover={{ x: 4 }}
                >
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="font-black text-xl text-green-600 dark:text-green-400">
                    Run It Locally
                  </span>
                </motion.div>
                <p className="text-base text-left text-muted-foreground font-medium">
                  Perfect for privacy-focused users who want local control
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 relative group"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-cyan-200/50 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 border-3 border-blue-600 dark:border-blue-500 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 shadow-[5px_5px_0px_rgba(37,99,235,1)] group-hover:shadow-[8px_8px_0px_rgba(37,99,235,1)] transition-all duration-300">
                <motion.div
                  className="flex items-center gap-3 mb-3"
                  whileHover={{ x: 4 }}
                >
                  <Check className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="font-black text-xl text-blue-600 dark:text-blue-400">
                    Cloud + AI Features
                  </span>
                </motion.div>
                <p className="text-base text-left text-muted-foreground font-medium">
                  Full-featured experience with AI insights and cross-device
                  sync
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <DualOptionSection />
        </motion.div>
      </div>

      <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl opacity-50" />
    </section>
  );
}
