/**
 * Copyright (C) 2025 Unearthed App
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Crimson_Pro } from "next/font/google";

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

const faqSections = [
  {
    title: "General Questions",
    questions: [
      {
        title: "What is Unearthed?",
        content: (
          <>
            <p className="">
              A place to collect, manage, analyse, tag, and send your
              Kindle/KOReader highlights and notes. Syncing can happen in the
              background automatically. Unearthed now comes in two versions:
              Unearthed Online (web-based with AI features) and Unearthed Local
              (desktop app for complete control).
            </p>
          </>
        ),
      },
      {
        title: "Is Unearthed free to use?",
        content: (
          <>
            <p className="">
              There is no longer a free tier. However the Unearthed Online
              codebase is completely Open Source. This includes the web app,
              browser extension, Obsidian plugin, and KOReader plugin. So feel
              free to host and run it yourself if you need to.
            </p>
          </>
        ),
      },
      {
        title: "Does Unearthed support KOReader?",
        content: (
          <>
            <p className="">
              Yes! Unearthed (Online and Local) work with both Kindle and
              KOReader and will merge your books automatically, allowing you to
              get all your notes and highlights from both sources in one place.
              This makes it perfect for users who read on multiple devices or
              prefer open-source reading software.
            </p>
          </>
        ),
      },
      {
        title:
          "What's the difference between Unearthed Local and Unearthed Online?",
        content: (
          <>
            <p className="mb-3">
              <strong>Unearthed Online</strong> is the web-based version with
              cloud sync, AI features, and integrations with multiple platforms:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
              <li>AI-powered chat, analysis, and recommendations</li>
              <li>Cloud storage and sync across devices</li>
              <li>Integration with Obsidian, Notion, Capacities, Supernotes</li>
              <li>Browser extension for easy syncing</li>
            </ul>
            <p className="mb-3">
              <strong>Unearthed Local</strong> is a desktop app focused on
              privacy and local control:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>All data stays on your computer - no cloud storage</li>
              <li>Direct sync to Obsidian (no plugin required)</li>
              <li>One-time purchase, no subscriptions</li>
              <li>Works with both Kindle and KOReader</li>
              <li>Cross-platform (Windows, macOS, Linux)</li>
              <li>Daily reflections added to Obsidian daily notes</li>
            </ul>
          </>
        ),
      },
      {
        title: "Why did you create two different versions?",
        content: (
          <>
            <p className="">
              The main reason was sustainability. While many people were using
              Unearthed, the vast majority were using the free tier, which meant
              hosting costs kept growing without corresponding revenue. The
              solution was to create Unearthed Local - an app that runs on your
              computer with no hosting costs, meaning no monthly fees for users
              either. This approach also aligns with the philosophy of data
              ownership - your reading data stays completely under your control
              on your own device.
            </p>
          </>
        ),
      },
      {
        title: "Can I use both Unearthed Local and Online?",
        content: (
          <>
            <p className="">
              Yes, you can use both versions if you want. However, they operate
              independently - Unearthed Local stores data locally while
              Unearthed Online uses online secure storage. Choose the one that
              best fits your workflow, or use both for different purposes.
            </p>
          </>
        ),
      },
      {
        title: "What are Daily Reflections?",
        content: (
          <>
            <p className="">
              Unearthed will select a quote to serve to you for the day, and are
              designed to help you rediscover past insights. They appear in the
              web interface, browser extension and can be synced to Obsidian
              daily notes, Capacities, and Supernotes.
            </p>
          </>
        ),
      },
      {
        title: "Is Unearthed open source?",
        content: (
          <>
            <p className="">
              Yes, Unearthed Online, including the web app, browser extension,
              Obsidian plugin, and KOReader plugin, are open source. This allows
              for code inspection, self-hosting, and community contributions.
            </p>
          </>
        ),
      },
      {
        title: "How does Unearthed access my Kindle data?",
        content: (
          <>
            <p className="mb-3">
              <strong>Unearthed Online:</strong> Uses a browser extension
              (Chrome/Firefox) to access your Kindle data from read.amazon.com
              when you&apos;re logged into your Amazon account. It doesn&apos;t
              require or store your Amazon credentials. You could also upload
              the Kindle Clippings file to import manually.
            </p>
            <p className="">
              <strong>Unearthed Local:</strong> Connects directly to your Kindle
              account in a similar way. No Amazon credentials are stored or
              viewed by the application, and no device needs to be plugged into
              your computer.
            </p>
          </>
        ),
      },
      {
        title: "Is my data private and secure with Unearthed?",
        content: (
          <>
            <p className="">
              Yes, Unearthed prioritises user privacy and security. It
              doesn&apos;t store Amazon credentials, and all data is completely
              removed if you delete your account. Code inspection is encouraged.
            </p>
          </>
        ),
      },
      {
        title: "How do I sync my Kindle highlights to Obsidian?",
        content: (
          <>
            <p className="mb-3">
              <strong>Option 1 - Unearthed Online:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4 mb-3">
              <li>Install the Unearthed web extension</li>
              <li>Generate an API key in your Unearthed account settings</li>
              <li>Enter the API key in the Unearthed settings</li>
              <li>Enable auto-sync or perform manual syncs</li>
            </ol>
            <p className="mb-3">
              <strong>Option 2 - Unearthed Local:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Point the desktop app to your Obsidian vault location</li>
              <li>Enable auto-sync in the app</li>
              <li>No plugin required - syncs directly to your vault</li>
            </ol>
          </>
        ),
      },
      {
        title: "Can I export my data from Unearthed?",
        content: (
          <>
            <p className="mb-3">
              <strong>Unearthed Online:</strong> Allows you to download your
              Kindle highlights and notes as a CSV file via the browser
              extension. You can also fully export to Obsidian.
            </p>
            <p className="">
              <strong>Unearthed Local:</strong> Since all data is stored locally
              on your computer, you already own and control all your data. The
              app syncs directly to your Obsidian vault, so your data is always
              accessible in standard markdown format.
            </p>
          </>
        ),
      },
      {
        title: "Which version should I choose?",
        content: (
          <>
            <p className="mb-3">
              Choose based on your priorities and workflow:
            </p>
            <p className="mb-3">
              <strong>Choose Unearthed Local if you:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
              <li>Prioritise complete local control</li>
              <li>Prefer one-time purchases over subscriptions</li>
              <li>Primarily use Obsidian for note-taking</li>
              <li>Don&apos;t need AI features or cloud sync</li>
              <li>Want a simple, focused tool that runs in the background</li>
              <li>You don&apos;t mind relying on a computer for auto sync</li>
            </ul>
            <p className="mb-3">
              <strong>Choose Unearthed Online if you:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Want AI-powered insights and analysis of your reading</li>
              <li>Need to sync across multiple devices</li>
              <li>
                Use multiple note-taking apps (Notion, Capacities, Supernotes)
              </li>
              <li>
                Enjoy features like blind spot detection and book
                recommendations
              </li>
              <li>Want the interactive map and advanced search capabilities</li>
            </ul>
          </>
        ),
      },
      {
        title: "What if I have more questions or want to suggest new features?",
        content: (
          <>
            <p className="">
              You can reach out directly with questions or suggestions. For
              feature requests or improvements, you can create a GitHub issue
              since Unearthed is open source.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: "Unearthed Online",
    questions: [
      {
        title: "What are the AI features in Unearthed Online?",
        content: (
          <>
            <p className="mb-3">
              My intention for including AI features was to aid in your
              learning, and not to replace your brain. I wanted to include
              features that could guide you in resurfacing knowledge, revealing
              blind spots in your library, and to help you to expand your
              collection of books in a meaningful way.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-3 ml-4">
              <li>
                <strong>AI Chat with Books</strong> - Ask questions about
                individual books, get insights from your highlights and notes
              </li>
              <li>
                <strong>Blind Spot Detection</strong> - Analyzes your entire
                reading history to identify knowledge gaps and suggest areas for
                improvement
              </li>
              <li>
                <strong>Reflection Questions</strong> - Generates
                thought-provoking questions about your highlights, rates your
                responses and provides alternative perspectives
              </li>
              <li>
                <strong>Book Analysis</strong> - Creates comprehensive analysis
                including summaries, major themes, key takeaways, and
                reader&apos;s perspective
              </li>
              <li>
                <strong>Book Recommendations</strong> - Suggests both similar
                books and ones that challenge your current viewpoints based on
                your reading patterns
              </li>
              <li>
                <strong>Auto Extract Key Ideas</strong> - Automatically
                identifies and extracts the most important concepts from your
                highlights
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              These features use Google Gemini by default but can be configured
              to use other OpenAI-compatible providers. All AI features are
              opt-in and can be disabled if preferred.
            </p>
          </>
        ),
      },
      {
        title: "Can I add books and highlights manually in Unearthed Online?",
        content: (
          <>
            <p className="mb-3">
              Yes, Unearthed Online provides multiple ways to add content:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Manual entry of books, authors, quotes, and notes through the
                web interface
              </li>
              <li>Import from CSV files with your existing data</li>
              <li>Import from Kindle Clippings files (My Clippings.txt)</li>
              <li>Automatic sync via browser extension from read.amazon.com</li>
              <li>KOReader highlights and notes import</li>
            </ul>
            <p className="mt-3">
              This flexibility allows you to combine data from multiple sources
              and maintain a comprehensive reading library.
            </p>
          </>
        ),
      },
      {
        title: "What integrations does Unearthed Online support?",
        content: (
          <>
            <p className="mb-3">
              Unearthed Online integrates with multiple platforms to fit into
              your existing workflow:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Obsidian</strong> - Full sync including books,
                highlights, notes, tags, and daily reflections
              </li>
              <li>
                <strong>Notion</strong> - Sync your reading data to Notion
                databases
              </li>
              <li>
                <strong>Capacities</strong> - Integration with daily reflections
                and reading data
              </li>
              <li>
                <strong>Supernotes</strong> - Daily reflections and reading
                insights
              </li>
              <li>
                <strong>Email</strong> - Daily reflection quotes sent to your
                inbox
              </li>
            </ul>
            <p className="mt-3">
              All integrations are optional and can be configured based on your
              preferences.
            </p>
          </>
        ),
      },
      {
        title: "How does the Interactive Map work in Unearthed Online?",
        content: (
          <>
            <p className="">
              The Interactive Map is a visual tool that shows connections
              between your books, quotes, notes, and tags. It helps you discover
              relationships in your reading that you might not have noticed,
              revealing patterns in your thinking and areas where different
              books complement or contrast with each other. This feature is
              exclusive to Unearthed Online and provides a unique way to explore
              your personal knowledge graph.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: "Unearthed Local",
    questions: [
      {
        title: "How does Unearthed Local work?",
        content: (
          <>
            <p className="mb-3">
              Unearthed Local is a desktop application that syncs your Kindle
              and KOReader highlights directly to your computer:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Connect your Kindle account (no credentials stored)</li>
              <li>Point the app to your Obsidian vault location</li>
              <li>Enable auto-sync to keep your library updated</li>
              <li>The app runs in the background and syncs automatically</li>
            </ol>
            <p className="mt-3">
              No device plugging required, no special Obsidian plugins needed,
              and all your data stays completely local.
            </p>
          </>
        ),
      },
      {
        title: "How do payments work?",
        content: (
          <>
            <p className="mb-3">
              Unearthed Local is a one-time purchase with no subscriptions or
              recurring fees:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
              <li>Buy once, keep forever - no monthly or yearly fees</li>
              <li>
                Free updates for your major version (e.g., buy v1.0.6, get all
                updates up to v1.9.9 free)
              </li>
              <li>
                Cross-platform license - works on Windows, macOS, and Linux
              </li>
              <li>No cloud hosting costs means no ongoing fees for users</li>
            </ul>
            <p className="">
              This pricing model ensures you own the software permanently while
              supporting sustainable development.
            </p>
          </>
        ),
      },
      {
        title: "What happens to my data with Unearthed Local?",
        content: (
          <>
            <p className="">
              All your data stays completely on your computer. Nothing is sent
              to the cloud, stored on external servers, or shared with third
              parties. You have complete control and ownership of your reading
              data, and it remains accessible even if you&apos;re offline.
            </p>
          </>
        ),
      },
      {
        title: "Can I run Unearthed Local in the background?",
        content: (
          <>
            <p className="mb-3">
              Yes, Unearthed Local is designed to run seamlessly in the
              background:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
              <li>
                Automatic background sync keeps your Obsidian vault updated
              </li>
              <li>No need to manually open the app after initial setup</li>
              <li>
                Daily reflections are automatically added to your Obsidian daily
                notes if you choose
              </li>
            </ul>
            <p className="">
              While the app can run completely in the background, you might
              enjoy opening it occasionally to read the daily reflection, though
              this is also available directly in your Obsidian daily notes if
              you choose.
            </p>
          </>
        ),
      },
      {
        title: "What platforms does Unearthed Local support?",
        content: (
          <>
            <p className="mb-3">
              Unearthed Local is available across multiple platforms:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
              <li>
                <strong>Windows</strong> - Full support, ready to download
              </li>
              <li>
                <strong>macOS</strong> - Full support, ready to download
              </li>
              <li>
                <strong>Linux</strong>
              </li>
            </ul>
            <p className="">
              A single purchase gives you access to the app on all supported
              platforms, so you can use it on multiple computers with different
              operating systems.
            </p>
          </>
        ),
      },
      {
        title: "Does Unearthed Local have AI features?",
        content: (
          <>
            <p className="">No</p>
          </>
        ),
      },
    ],
  },
];

const FAQ = () => {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleSectionOpenChange = (section: string | string[]) => {
    if (Array.isArray(section)) {
      setOpenSections(section);
    } else {
      if (openSections.includes(section)) {
        setOpenSections(openSections.filter((s) => s !== section));
      } else {
        setOpenSections([...openSections, section]);
      }
    }
  };

  const handleItemOpenChange = (item: string | string[]) => {
    if (Array.isArray(item)) {
      setOpenItems(item);
    } else {
      if (openItems.includes(item)) {
        setOpenItems(openItems.filter((i) => i !== item));
      } else {
        setOpenItems([...openItems, item]);
      }
    }
  };

  return (
    <div className="w-full bg-background px-2 md:px-8 pt-8 pb-24 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <h2
          className={`${crimsonPro.className} block w-full pb-4 text-center text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent`}
        >
          Frequently Asked Questions
        </h2>
      </motion.div>

      <div className="w-full max-w-5xl mx-auto space-y-6 relative z-10">
        {faqSections.map((section, sectionIndex) => (
          <motion.div
            key={`section-${sectionIndex}`}
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: sectionIndex * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Accordion
              type="multiple"
              className="w-full"
              value={openSections}
              onValueChange={handleSectionOpenChange}
            >
              <AccordionItem
                value={`section-${sectionIndex}`}
                className={cn(
                  "border-3 border-black",
                  "bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-md rounded-xl",
                  "transition-all duration-300",
                  "shadow-[6px_6px_0px_rgba(0,0,0,1)]",
                  "hover:shadow-[10px_10px_0px_rgba(0,0,0,1)]",
                  "hover:-translate-y-1"
                )}
              >
                <AccordionTrigger
                  className={cn(
                    "font-black text-primary py-5 text-lg md:text-2xl",
                    "hover:text-red-500 transition-colors duration-200",
                    "data-[state=open]:text-red-500",
                    "px-6 md:px-8",
                    "w-full flex justify-between items-center",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl"
                  )}
                >
                  <motion.div
                    className=""
                    animate={{
                      rotate: openSections.includes(`section-${sectionIndex}`)
                        ? 180
                        : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {openSections.includes(`section-${sectionIndex}`) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-up text-red-500"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-down text-primary"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </motion.div>
                  <span className="flex-1 text-start ml-3">
                    {section.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 md:px-8 pb-6">
                  <Accordion
                    type="multiple"
                    className="w-full space-y-4 pt-4"
                    value={openItems}
                    onValueChange={handleItemOpenChange}
                  >
                    {section.questions.map((item, itemIndex) => (
                      <motion.div
                        key={`${sectionIndex}-${itemIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: itemIndex * 0.05,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <AccordionItem
                          value={`${sectionIndex}-${itemIndex}`}
                          className={cn(
                            "border-2 border-black",
                            "bg-background/80 backdrop-blur-sm rounded-lg",
                            "transition-all duration-300",
                            "shadow-[3px_3px_0px_rgba(0,0,0,1)]",
                            "hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]",
                            "hover:-translate-y-0.5",
                            "focus-within:ring-2 focus-within:ring-primary/50"
                          )}
                        >
                          <AccordionTrigger
                            className={cn(
                              "font-bold text-foreground py-4 text-sm md:text-base",
                              "hover:text-red-500 transition-colors duration-200",
                              "data-[state=open]:text-red-500",
                              "px-4 md:px-5",
                              "w-full flex justify-between items-center",
                              "focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
                            )}
                          >
                            <motion.div
                              className=""
                              animate={{
                                rotate: openItems.includes(
                                  `${sectionIndex}-${itemIndex}`
                                )
                                  ? 90
                                  : 0,
                              }}
                              transition={{
                                duration: 0.3,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            >
                              {openItems.includes(
                                `${sectionIndex}-${itemIndex}`
                              ) ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-minus text-red-500"
                                >
                                  <path d="M5 12h14" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-plus text-primary"
                                >
                                  <path d="M5 12h14" />
                                  <path d="M12 5v14" />
                                </svg>
                              )}
                            </motion.div>
                            <span className="flex-1 text-start ml-3">
                              {item.title}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent
                            className={cn(
                              "py-4 px-4 md:px-5",
                              "border-t-2 border-black/10",
                              "bg-background/50",
                              "rounded-b-lg",
                              "text-muted-foreground"
                            )}
                          >
                            {item.content}
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
