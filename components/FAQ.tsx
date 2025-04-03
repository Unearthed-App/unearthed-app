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

const faqData = [
  {
    title: "What is Unearthed?",
    content: (
      <>
        <p className="">
          A place to collect, manage, analyse, tag, and send your Kindle
          highlights and notes.
        </p>
      </>
    ),
  },
  {
    title: "Is Unearthed free to use?",
    content: (
      <>
        <p className="">
          Yes, Unearthed offers a free tier with features like automatic Kindle
          import, global search for books and quotes, book selection for
          syncing, Obsidian integration, and daily reflections.
        </p>
      </>
    ),
  },
  {
    title: "Is Unearthed open source?",
    content: (
      <>
        <p className="">
          Yes, the entire Unearthed ecosystem, including the web app, browser
          extension, and Obsidian plugin, is open source. This allows for code
          inspection, self-hosting, and community contributions.
        </p>
      </>
    ),
  },
  {
    title: "How does Unearthed access my Kindle data?",
    content: (
      <>
        <p className="">
          Unearthed uses a browser extension (Chrome/Firefox) to access your
          Kindle data from read.amazon.com when you&apos;re logged into your
          Amazon account. It doesn&apos;t require or store your Amazon
          credentials.
        </p>
      </>
    ),
  },
  {
    title: "Is my data private and secure with Unearthed?",
    content: (
      <>
        <p className="">
          Yes, Unearthed prioritises user privacy and security. It doesn&apos;t
          store Amazon credentials, and all data is completely removed if you
          delete your account. Code inspection is encouraged.
        </p>
      </>
    ),
  },
  {
    title: "How do I sync my Kindle highlights to Obsidian?",
    content: (
      <>
        <ol className="list-decimal list-inside space-y-2 ">
          <li>Install the Unearthed plugin in Obsidian</li>
          <li>Generate an API key in your Unearthed account settings</li>
          <li>Enter the API key in the Obsidian plugin settings</li>
          <li>Enable auto-sync or perform manual syncs</li>
        </ol>
      </>
    ),
  },
  {
    title: "What are Daily Reflections?",
    content: (
      <>
        <p className="">
          Unearthed will select a quote to serve to you for the day, and are
          designed to help you rediscover past insights. They appear in the web
          interface, browser extension and can be synced to Obsidian daily
          notes, Capacities, and Supernotes.
        </p>
      </>
    ),
  },
  {
    title: "What are the AI features?",
    content: (
      <>
        <p className="">
          Available in the premium version, Unearthed offers several AI-powered
          features:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>
            <strong>Chat</strong> - Ask any question about your books, quotes,
            or notes
          </li>
          <li>
            <strong>Blind Spot Detection</strong> - Analyzes your reading
            history to identify knowledge gaps and areas for improvement
          </li>
          <li>
            <strong>Reflection Questions</strong> - Generates thought-provoking
            questions about your highlights, rates your responses
          </li>
          <li>
            <strong>Book Analysis</strong> - Creates comprehensive analysis
            including summaries, themes, takeaways, and reader&apos;s
            perspective
          </li>
          <li>
            <strong>Book Recommendations</strong> - Suggests both similar books
            and ones that challenge your viewpoints
          </li>
          <li>
            <strong>Auto Extract Key Ideas</strong> - Automatically identifies
            and extracts important concepts from your highlights
          </li>
        </ul>
        <p className="mt-2 text-alternate">
          These features use Google Gemini by default but can be configured to
          use other OpenAI-compatible providers.
        </p>
      </>
    ),
  },
  {
    title: "Can I export my data from Unearthed?",
    content: (
      <>
        <p className="">
          Unearthed allows you to download your Kindle highlights and notes as a
          CSV file via the browser extension. You can also fully export to
          Obsidian.
        </p>
      </>
    ),
  },
  {
    title: "Can I import a CSV or Kindle clippings file?",
    content: (
      <>
        <p className="">
          Yes, you can import your Kindle highlights and notes from a CSV file
          or a Kindle clippings file with the premium version.
        </p>
      </>
    ),
  },
  {
    title: "What if I have more questions or want to suggest new features?",
    content: (
      <>
        <p className="">
          You can reach out directly with questions or suggestions. For feature
          requests or improvements, you can create a GitHub issue since
          Unearthed is open source.
        </p>
      </>
    ),
  },
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleOpenChange = (item: string | string[]) => {
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
    <div className="w-full bg-background px-2 md:px-8 pt-8 pb-24">
      <h2 className="block w-full pb-8 text-center text-xl md:text-4xl uppercase font-black italic items-center text-alternate">
        FAQ
      </h2>
      <Accordion
        type="multiple"
        className="w-full max-w-4xl mx-auto"
        value={openItems}
        onValueChange={handleOpenChange}
      >
        {faqData.map((item, index) => (
          <AccordionItem
            key={`faq-${index}`}
            value={`item-${index}`}
            className={cn(
              "border-2",
              "bg-card/50 backdrop-blur-md rounded-lg mb-4",
              "transition-all duration-300",
              "hover:shadow-lg hover:shadow-black/20",
              "focus-within:ring-2 focus-within:ring-teal-500/50"
            )}
          >
            <AccordionTrigger
              className={cn(
                "font-semibold text-alternate py-4 text-sm md:text-lg",
                "hover:text-secondary transition-colors duration-200",
                "data-[state=open]:text-secondary",
                "px-4",
                "w-full flex justify-between items-center",
                "focus:outline-none focus:ring-2 focus:ring-teal-500/50 rounded-md"
              )}
            >
              <motion.div
                className=""
                animate={{
                  rotate: openItems.includes(`item-${index}`) ? 180 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {openItems.includes(`item-${index}`) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-minus-circle text-gray-400"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-plus-circle text-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                )}
              </motion.div>
              <span className="flex-1 text-start ml-2">{item.title}</span>
            </AccordionTrigger>
            <AccordionContent
              className={cn(
                "py-4 px-4",
                "border-t",
                "bg-card/50",
                "rounded-b-lg"
              )}
            >
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
