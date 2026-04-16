"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Crimson_Pro } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export function HomeHero() {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "5%"] : ["0%", "15%"]
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[95vh] flex flex-col items-center justify-center px-4 md:px-8 py-20 md:py-32 overflow-hidden"
    >
      <motion.div
        style={{ y, opacity, willChange: "transform, opacity" }}
        className="container mx-auto max-w-7xl text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 mb-6"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase">
              Transform Your Reading Insights
            </span>
          </motion.div>
        </motion.div>

        <motion.h1
          className={`${crimsonPro.className} font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-8 leading-[0.95] tracking-tight`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block bg-gradient-to-br from-primary via-primary to-primary/80 bg-clip-text text-transparent drop-shadow-2xl relative">
              PAST INSIGHTS
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-xl -z-10"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.div>
          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block bg-gradient-to-br from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent drop-shadow-2xl relative">
              NEW REVELATIONS
              <motion.span
                className="absolute -inset-1 bg-gradient-to-l from-red-500/20 via-rose-500/10 to-transparent blur-xl -z-10"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              />
            </span>
          </motion.div>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-foreground max-w4xl mx-auto mb-12 leading-relaxed font-light tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Unlock hidden wisdom from your Kindle and KOReader highlights.
          <br className="hidden md:block" />
          Discover forgotten insights, detect blind spots, and build connected
          knowledge.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-3 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Primary + Secondary CTAs — side by side, same size */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Link href="/online" className="block w-full sm:w-auto">
                <Button
                  variant="brutalprimary"
                  className="w-full sm:w-[200px] h-12 text-sm font-bold tracking-wide"
                >
                  Unearthed Online
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Link href="/local" className="block w-full sm:w-auto">
                <Button
                  variant="brutal"
                  className="w-full sm:w-[200px] h-12 text-sm font-bold tracking-wide"
                >
                  Unearthed Local
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Tertiary ghost link — sits naturally below */}
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/local-docs"
              className="mt-4 group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary/70 group-hover:text-primary transition-colors duration-200" />
              <span className="font-medium">Local Docs</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          {[
            { value: "100%", label: "Open Source (Online)" },
            { value: "0", label: "Amazon Credentials" },
            { value: "∞", label: "Knowledge" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex flex-col items-center p-4">
                <motion.span
                  className="font-black text-2xl md:text-4xl font-mono bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-sm md:text-base text-muted-foreground font-medium tracking-wide">
                  {stat.label}
                </span>
              </div>
              <motion.div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-[10%] left-[15%] w-96 h-96 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] bg-gradient-to-tl from-red-500/30 via-rose-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-[50%] right-[30%] w-72 h-72 bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_100%)]" />
      </div>
    </section>
  );
}
