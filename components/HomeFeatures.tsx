"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
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
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    title: "Smart Merge",
    description:
      "Intelligently merges your Kindle and KOReader highlights for the same book into one unified view. No duplicates, manual merging required.",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Daily Reflections",
    description:
      "Get personalised daily reflections that surface your most important quotes and ideas. Available in both Online and Local.",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data stays yours. No Amazon credentials stored. Complete control over your reading data.",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: LinkIcon,
    title: "Seamless Integrations",
    description:
      "Sync to Notion, Obsidian, Capacities, and Supernotes. Choose 'Unearthed Online' for all platforms or 'Unearthed Local' for direct Obsidian sync.",
    color: "rose",
    gradient: "from-rose-500 to-red-500",
  },
  {
    icon: Search,
    title: "Powerful Search",
    description:
      "Search across all your books, highlights, and notes. Find connections you never knew existed.",
    color: "indigo",
    gradient: "from-indigo-500 to-violet-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  const Icon = feature.icon;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`
    radial-gradient(
      650px circle at ${mouseX}px ${mouseY}px,
      rgba(var(--spotlight-color), 0.15),
      transparent 80%
    )
  `;

  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      className="group relative h-full rounded-[2.5rem] border border-border/50 bg-muted/5 p-8 transition-colors hover:bg-muted/10 overflow-hidden"
      style={
        {
          "--spotlight-color": feature.color === "blue" ? "59, 130, 246" : 
                               feature.color === "purple" ? "168, 85, 247" :
                               feature.color === "amber" ? "245, 158, 11" :
                               feature.color === "emerald" ? "16, 185, 129" :
                               feature.color === "rose" ? "244, 63, 94" : "99, 102, 241"
        } as React.CSSProperties
      }
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      
      <div className="relative z-10 flex flex-col items-start">
        <div className="relative mb-8">
          <div className={`absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-br ${feature.gradient}`} />
          <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center bg-background border border-border/50 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
            <Icon className="w-7 h-7 text-foreground/70 group-hover:text-foreground transition-colors" />
          </div>
        </div>

        <h3 className={`${crimsonPro.className} font-black text-2xl mb-4 text-foreground/90 group-hover:text-foreground transition-colors`}>
          {feature.title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed text-base font-light group-hover:text-foreground/80 transition-colors">
          {feature.description}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-b-[2.5rem]">
        <div className={`h-full w-0 bg-gradient-to-r ${feature.gradient} transition-all duration-500 group-hover:w-full`} />
      </div>
    </motion.div>
  );
}
export function HomeFeatures() {
  return (
    <section className="relative w-full py-24 md:py-32 px-4 md:px-8 overflow-hidden bg-background">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          {/* <motion.span 
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-muted/50 border border-border mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Capabilities
          </motion.span> */}
          <h2 className={`${crimsonPro.className} font-black text-4xl md:text-5xl lg:text-6xl pb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70`}>
            Create Lasting Knowledge
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Transform your reading highlights into a powerful knowledge system with tools designed for deep thinkers.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}