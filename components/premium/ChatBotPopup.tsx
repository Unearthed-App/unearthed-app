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
import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Loader2,
  X,
  Copy,
  MessageCircleQuestion,
  ChevronsUpDown,
  Settings,
} from "lucide-react";
import { z } from "zod";
import {
  selectProfileSchema,
  selectQuoteSchema,
  selectSourceSchema,
} from "@/db/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { toast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getProfile } from "@/server/actions";
import { calculateAiUsage } from "@/server/actions-premium";
import Link from "next/link";
import { AiChatSuggestions } from "@/components/premium/AiChatSuggestions";

type Profile = z.infer<typeof selectProfileSchema>;
type Quote = z.infer<typeof selectQuoteSchema>;
type Source = z.infer<typeof selectSourceSchema>;

interface ChatBotPopupProps {
  book: Source;
  quotes: Quote[];
}

type Message = {
  role: "user" | "assistant" | "assistant-thinking";
  content: string;
};

export const ChatBotPopup = ({ book, quotes }: ChatBotPopupProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const bookIdRef = useRef<string>();
  const [input, setInput] = useState("");
  const [systemMessage, setSystemMessage] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const hasLoadedRef = useRef(false);
  const [aiPercentageUsed, setAiPercentageUsed] = useState(0);

  async function fetchProfileData() {
    const prof = (await getProfile()) as Profile;
    setProfile(prof);
    const usage = await calculateAiUsage(prof);
    setAiPercentageUsed(usage);
  }

  useEffect(() => {
    if (!isFetched && book) {
      fetchProfileData();
      setIsFetched(true);
    }
  }, [isFetched, book]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!book?.id || !quotes) return;

    if (book.id === bookIdRef.current) return;

    const storedMessages = sessionStorage.getItem(`chatMessages-${book.id}`);
    const storedSystemMessage = sessionStorage.getItem(
      `chatSystemMessage-${book.id}`
    );

    if (storedMessages) {
      try {
        setSystemMessage(JSON.parse(storedSystemMessage!));
        setMessages(JSON.parse(storedMessages));
      } catch {
        initializeNewChat();
      }
    } else {
      initializeNewChat();
    }

    bookIdRef.current = book.id;
    hasLoadedRef.current = true;
  }, [book?.id]);

  const initializeNewChat = () => {
    if (book && quotes) {
      const sm = `Book Context:
Title: ${book.title}
Author: ${book.author || "Unknown"}
Subtitle: ${book.subtitle || "N/A"}
Quotes:
${quotes
  .map(
    (q, i) => `- "${q.content}"
  Note: ${q.note || "N/A"}
  Location: ${q.location || "N/A"}`
  )
  .join("\n")}`;

      setSystemMessage(sm);
      setMessages([
        {
          role: "assistant",
          content: `Hello! I'm here to help you get the most out of "${book.title}."`,
        },
      ]);
    }
  };

  useEffect(() => {
    if (hasLoadedRef.current && book?.id) {
      sessionStorage.setItem(
        `chatMessages-${book.id}`,
        JSON.stringify(messages)
      );
      sessionStorage.setItem(
        `chatSystemMessage-${book.id}`,
        JSON.stringify(systemMessage)
      );
    }
  }, [messages, book?.id]);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (userInput: string) => {
      const payload = {
        systemMessage,
        messages,
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Failed to fetch:", response.statusText);
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data, userInput) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];

        if (lastMessage?.role === "user" && lastMessage.content === userInput) {
          const thinking = data.response.includes("<think>");

          if (thinking) {
            const match = data.response.match(/<think>(.*?)<\/think>/s);
            const thinkingText = match?.[1]?.trim() || "";
            const cleanedResponse = data.response
              .replace(/<think>.*?<\/think>/s, "")
              .trim();

            newMessages.push(
              { role: "assistant-thinking", content: thinkingText },
              { role: "assistant", content: cleanedResponse }
            );
          } else {
            newMessages.push({ role: "assistant", content: data.response });
          }
        }

        return newMessages;
      });
    },
    onError: (error, userInput) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble responding. Please try again later.",
        },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent | string) => {
    if (typeof e !== "string") {
      e.preventDefault();
    }

    if (input.trim() || typeof e === "string") {
      console.log("e 1 ", e);
      const userInput = input ? input : (e as string);
      setMessages(() => {
        return [...messages, { role: "user", content: userInput }];
      });
      sendMessage(userInput);
      setInput("");
      scrollToBottom();
    }
  };

  const handleClearSession = (e: React.FormEvent) => {
    e.preventDefault();

    if (book?.id) {
      sessionStorage.removeItem(`chatMessages-${book.id}`);
      sessionStorage.removeItem(`chatSystemMessage-${book.id}`);
      initializeNewChat();
      setInput("");
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    const container = e.currentTarget.parentElement;
    if (!container) {
      console.error("Container not found");
      return;
    }

    const preElement = container.querySelector("pre");
    if (preElement) {
      const range = document.createRange();
      range.selectNodeContents(preElement);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      try {
        const textToCopy = preElement.textContent || "";
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: "Copied to Clipboard",
        });
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    } else {
      console.log("preElement not found");
    }
  };

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
        duration: 0.3,
      },
    },
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="brutalprimary">
            <MessageCircleQuestion className="mr-2 h-6 w-6" />
            Analyze
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] h-[80vh]" forceMount>
          {aiPercentageUsed >= 100 &&
          (!profile?.aiApiKey || !profile?.aiApiModel) ? (
            <DialogHeader className="mb-2">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl">
                  You have run out of AI credits
                </DialogTitle>
              </div>
              <DialogDescription>
                You can either wait until next month, or use your own AI
                Provider in the settings
              </DialogDescription>
              <Link href="/premium/settings">
                <Button variant="brutal">
                  <Settings className="w-6 h-6 mr-2" />
                  Go to Settings
                </Button>
              </Link>
            </DialogHeader>
          ) : (
            <>
              <DialogHeader className="mb-2">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl">
                    Chat about{" "}
                    <span className="text-secondary">{book?.title}</span>
                  </DialogTitle>
                </div>
                <DialogDescription>
                  Ask questions or get quizzed about your notes and quotes
                </DialogDescription>
              </DialogHeader>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 overflow-y-auto space-y-4 pr-2"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className={`p-3 rounded-lg border-2 border-black ${
                      msg.role === "user"
                        ? "bg-primary dark:bg-accent-foreground ml-auto max-w-[80%]"
                        : "bg-card max-w-[90%]"
                    }`}
                  >
                    <p
                      className={`font-medium text-sm mb-1 ${
                        msg.role === "assistant" ||
                        msg.role === "assistant-thinking"
                          ? "text-secondary"
                          : ""
                      }`}
                    >
                      {msg.role === "user"
                        ? "You"
                        : msg.role === "assistant-thinking"
                          ? "Book Assistant's thoughts..."
                          : "Book Assistant"}
                    </p>

                    {msg.role === "assistant-thinking" ? (
                      <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className=""
                      >
                        <div className="flex items-center justify-start space-x-4">
                          <CollapsibleTrigger asChild>
                            <Button variant="brutal" size="icon">
                              <ChevronsUpDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <h4 className="text-sm font-semibold">
                            {isOpen
                              ? "Click to hide..."
                              : "Click to view my thought process..."}
                          </h4>
                        </div>
                        <CollapsibleContent className="pt-2">
                          <ReactMarkdown
                            className="markdown whitespace-pre-wrap"
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              table: ({ node, ...props }) => (
                                <div className="relative overflow-x-auto rounded-lg">
                                  <table
                                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    {...props}
                                  />
                                </div>
                              ),
                              thead: ({ node, ...props }) => (
                                <thead
                                  className="text-xs text-primary uppercase bg-gray-50 dark:bg-black/20 "
                                  {...props}
                                />
                              ),
                              th: ({ node, ...props }) => (
                                <th
                                  scope="col"
                                  className="px-6 py-3 border-b border-black/20 dark:border-white/20"
                                  {...props}
                                />
                              ),
                              td: ({ node, ...props }) => (
                                <td className="px-6 py-4" {...props} />
                              ),
                              tr: ({ node, ...props }) => (
                                <tr
                                  className="bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
                                  {...props}
                                />
                              ),
                              pre: ({ node, children, ...props }) => (
                                <div className="relative">
                                  <pre
                                    {...props}
                                    className="rounded-lg overflow-x-auto text-sm leading-6 bg-gray-800 p-4"
                                  >
                                    {children}
                                  </pre>
                                  <Button
                                    variant="brutal"
                                    size="icon"
                                    onClick={handleCopy}
                                    className="absolute top-2 right-2 h-8 w-8 p-0"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              ),
                              code: ({
                                node,
                                className,
                                children,
                                ...props
                              }) => {
                                const isInline = !className?.includes("hljs");

                                return isInline ? (
                                  <code
                                    {...props}
                                    className="bg-gray-100 px-1.5 py-0.5 rounded-md text-sm font-mono"
                                  >
                                    {children}
                                  </code>
                                ) : (
                                  <code
                                    {...props}
                                    className={`${className} font-mono hljs bg-gray-800 rounded-lg p-0`}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <ReactMarkdown
                        className="markdown whitespace-pre-wrap"
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          table: ({ node, ...props }) => (
                            <div className="relative overflow-x-auto rounded-lg">
                              <table
                                className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                {...props}
                              />
                            </div>
                          ),
                          thead: ({ node, ...props }) => (
                            <thead
                              className="text-xs text-primary uppercase bg-gray-50 dark:bg-black/20 "
                              {...props}
                            />
                          ),
                          th: ({ node, ...props }) => (
                            <th
                              scope="col"
                              className="px-6 py-3 border-b border-black/20 dark:border-white/20"
                              {...props}
                            />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="px-6 py-4" {...props} />
                          ),
                          tr: ({ node, ...props }) => (
                            <tr
                              className="bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
                              {...props}
                            />
                          ),
                          pre: ({ node, children, ...props }) => (
                            <div className="relative">
                              <pre
                                {...props}
                                className="rounded-lg overflow-x-auto text-sm leading-6 bg-gray-800 p-4"
                              >
                                {children}
                              </pre>
                              <Button
                                variant="brutal"
                                size="icon"
                                onClick={handleCopy}
                                className="absolute top-2 right-2 h-8 w-8 p-0"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          ),
                          code: ({ node, className, children, ...props }) => {
                            const isInline = !className?.includes("hljs");

                            return isInline ? (
                              <code
                                {...props}
                                className="bg-gray-100 px-1.5 py-0.5 rounded-md text-sm font-mono"
                              >
                                {children}
                              </code>
                            ) : (
                              <code
                                {...props}
                                className={`${className} font-mono hljs bg-gray-800 rounded-lg p-0`}
                              >
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </motion.div>
                ))}
                {isPending && (
                  <motion.div
                    variants={itemVariants}
                    className="p-3 rounded-lg border-2 border-black max-w-[90%]"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </motion.div>

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 border-2 border-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <AiChatSuggestions
                    onPromptSelect={(prompt) => {
                      setInput(prompt);
                      handleSubmit(prompt);
                    }}
                  />
                  <Button
                    variant="brutal"
                    type="button"
                    disabled={isPending}
                    onClick={handleClearSession}
                  >
                    Clear Session
                  </Button>
                  <Button
                    variant="brutalprimary"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="brutalprimary" size="icon">
          <MessageCircleQuestion />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        {aiPercentageUsed >= 100 &&
        (!profile?.aiApiKey || !profile?.aiApiModel) ? (
          <DrawerHeader className="text-left">
            <div className="flex justify-between items-center">
              <DrawerTitle className="text-xl">
                You have run out of AI credits
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription>
              You can either wait until next month, or use your own AI Provider
              in the settings
            </DrawerDescription>
            <Link href="/premium/settings">
              <Button variant="brutal">
                <Settings className="w-6 h-6 mr-2" />
                Go to Settings
              </Button>
            </Link>
          </DrawerHeader>
        ) : (
          <>
            <DrawerHeader className="text-left">
              <div className="flex justify-between items-center">
                <DrawerTitle className="text-xl">
                  Chat about{" "}
                  <span className="text-secondary">{book?.title}</span>
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
              <DrawerDescription>
                Ask questions or get quizzed about your notes
              </DrawerDescription>
            </DrawerHeader>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 overflow-y-auto px-4 space-y-4"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={`p-3 rounded-lg border-2 border-black ${
                    msg.role === "user"
                      ? "bg-primary dark:bg-accent-foreground ml-auto max-w-[80%]"
                      : "bg-card max-w-[90%]"
                  }`}
                >
                  <p
                    className={`font-medium text-sm mb-1 ${
                      msg.role === "assistant" ||
                      msg.role === "assistant-thinking"
                        ? "text-secondary"
                        : ""
                    }`}
                  >
                    {msg.role === "user"
                      ? "You"
                      : msg.role === "assistant-thinking"
                        ? "Book Assistant's thoughts..."
                        : "Book Assistant"}
                  </p>
                  {msg.role === "assistant-thinking" ? (
                    <Collapsible
                      open={isOpen}
                      onOpenChange={setIsOpen}
                      className=""
                    >
                      <div className="flex items-center justify-start space-x-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="brutal" size="icon">
                            <ChevronsUpDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <h4 className="text-sm font-semibold">
                          {isOpen
                            ? "Click to hide..."
                            : "Click to view my thought process..."}
                        </h4>
                      </div>
                      <CollapsibleContent className="pt-2">
                        <ReactMarkdown
                          className="markdown whitespace-pre-wrap"
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            table: ({ node, ...props }) => (
                              <div className="relative overflow-x-auto rounded-lg">
                                <table
                                  className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                  {...props}
                                />
                              </div>
                            ),
                            thead: ({ node, ...props }) => (
                              <thead
                                className="text-xs text-primary uppercase bg-gray-50 dark:bg-black/20 "
                                {...props}
                              />
                            ),
                            th: ({ node, ...props }) => (
                              <th
                                scope="col"
                                className="px-6 py-3 border-b border-black/20 dark:border-white/20"
                                {...props}
                              />
                            ),
                            td: ({ node, ...props }) => (
                              <td className="px-6 py-4" {...props} />
                            ),
                            tr: ({ node, ...props }) => (
                              <tr
                                className="bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
                                {...props}
                              />
                            ),
                            pre: ({ node, children, ...props }) => (
                              <div className="relative">
                                <pre
                                  {...props}
                                  className="rounded-lg overflow-x-auto text-sm leading-6 bg-gray-800 p-4"
                                >
                                  {children}
                                </pre>
                                <Button
                                  variant="brutal"
                                  size="icon"
                                  onClick={handleCopy}
                                  className="absolute top-2 right-2 h-8 w-8 p-0"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            ),
                            code: ({ node, className, children, ...props }) => {
                              const isInline = !className?.includes("hljs");

                              return isInline ? (
                                <code
                                  {...props}
                                  className="bg-gray-100 px-1.5 py-0.5 rounded-md text-sm font-mono"
                                >
                                  {children}
                                </code>
                              ) : (
                                <code
                                  {...props}
                                  className={`${className} font-mono hljs bg-gray-800 rounded-lg p-0`}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <ReactMarkdown
                      className="markdown whitespace-pre-wrap"
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        table: ({ node, ...props }) => (
                          <div className="relative overflow-x-auto rounded-lg">
                            <table
                              className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                              {...props}
                            />
                          </div>
                        ),
                        thead: ({ node, ...props }) => (
                          <thead
                            className="text-xs text-primary uppercase bg-gray-50 dark:bg-black/20 "
                            {...props}
                          />
                        ),
                        th: ({ node, ...props }) => (
                          <th
                            scope="col"
                            className="px-6 py-3 border-b border-black/20 dark:border-white/20"
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-6 py-4" {...props} />
                        ),
                        tr: ({ node, ...props }) => (
                          <tr
                            className="bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20"
                            {...props}
                          />
                        ),
                        pre: ({ node, children, ...props }) => (
                          <div className="relative">
                            <pre
                              {...props}
                              className="rounded-lg overflow-x-auto text-sm leading-6 bg-gray-800 p-4"
                            >
                              {children}
                            </pre>
                            <Button
                              variant="brutal"
                              size="icon"
                              onClick={handleCopy}
                              className="absolute top-2 right-2 h-8 w-8 p-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ),
                        code: ({ node, className, children, ...props }) => {
                          const isInline = !className?.includes("hljs");

                          return isInline ? (
                            <code
                              {...props}
                              className="bg-gray-100 px-1.5 py-0.5 rounded-md text-sm font-mono"
                            >
                              {children}
                            </code>
                          ) : (
                            <code
                              {...props}
                              className={`${className} font-mono hljs bg-gray-800 rounded-lg p-0`}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </motion.div>
              ))}
              {isPending && (
                <motion.div
                  variants={itemVariants}
                  className="p-3 rounded-lg border-2 border-black max-w-[90%]"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>

            <DrawerFooter className="pt-2">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-wrap">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full border-2 border-black p-2 rounded focus:outline-none"
                  />
                  <Button
                    variant="brutalprimary"
                    type="submit"
                    disabled={isPending}
                    className="w-full"
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
                <div className="flex">
                  <div className="w-1/2 mt-2">
                    <AiChatSuggestions
                      onPromptSelect={(prompt) => {
                        setInput(prompt);
                        handleSubmit(prompt);
                      }}
                    />
                  </div>
                  <Button
                    variant="brutal"
                    type="button"
                    disabled={isPending}
                    onClick={handleClearSession}
                    className="w-1/2 mt-2"
                  >
                    Clear Session
                  </Button>
                </div>
              </form>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
