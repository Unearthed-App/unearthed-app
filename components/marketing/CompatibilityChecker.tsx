"use client";

import { useMemo, useState } from "react";
import { Crimson_Pro } from "next/font/google";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cloud,
  FileText,
  Globe,
  Monitor,
  Puzzle,
  ScanLine,
  Smartphone,
  Video,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const serif = Crimson_Pro({ subsets: ["latin"], weight: ["600", "700"] });

export type UnearthedProduct = "local" | "online" | "mobile";
type Source =
  | "kindle"
  | "koreader"
  | "physical"
  | "youtube"
  | "rss"
  | "webpage";
type Destination =
  | "obsidian"
  | "craft"
  | "notion"
  | "supernotes"
  | "capacities";
type Status = "supported" | "requires" | "manual" | "unavailable";

const sources: { id: Source; label: string; Icon: typeof BookOpen }[] = [
  { id: "kindle", label: "Kindle", Icon: BookOpen },
  { id: "koreader", label: "KOReader", Icon: BookOpen },
  { id: "physical", label: "Physical books", Icon: ScanLine },
  { id: "youtube", label: "YouTube", Icon: Video },
  { id: "rss", label: "RSS & articles", Icon: FileText },
  { id: "webpage", label: "Web pages", Icon: Globe },
];

const destinations: { id: Destination; label: string }[] = [
  { id: "obsidian", label: "Obsidian" },
  { id: "craft", label: "Craft" },
  { id: "notion", label: "Notion" },
  { id: "supernotes", label: "Supernotes" },
  { id: "capacities", label: "Capacities" },
];

const productNames = {
  local: "Unearthed Local",
  online: "Unearthed Online",
  mobile: "Unearthed Mobile",
};

const productIcons = {
  local: Monitor,
  online: Cloud,
  mobile: Smartphone,
};

const accents = {
  local: {
    button:
      "border-orange-900 bg-orange-500 text-white shadow-[4px_4px_0_#7c2d12] hover:bg-orange-600",
    soft: "bg-orange-50 dark:bg-orange-950/35",
    border: "border-orange-300 dark:border-orange-800",
    text: "text-orange-700 dark:text-orange-400",
  },
  online: {
    button:
      "border-teal-900 bg-[#25b1a6] text-[#102521] shadow-[4px_4px_0_#064e3b] hover:bg-[#35c2b6]",
    soft: "bg-teal-50 dark:bg-teal-950/35",
    border: "border-teal-300 dark:border-teal-800",
    text: "text-teal-700 dark:text-teal-400",
  },
  mobile: {
    button:
      "border-purple-900 bg-purple-500 text-white shadow-[4px_4px_0_#581c87] hover:bg-purple-600",
    soft: "bg-purple-50 dark:bg-purple-950/35",
    border: "border-purple-300 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-400",
  },
};

type Result = {
  status: Status;
  title: string;
  description: string;
  path: string[];
};

function getCompatibility(
  product: UnearthedProduct,
  source: Source,
  destination: Destination
): Result {
  const sourceLabel = sources.find((item) => item.id === source)!.label;
  const destinationLabel = destinations.find(
    (item) => item.id === destination
  )!.label;

  if (product === "local") {
    if (destination !== "obsidian" && destination !== "craft") {
      return {
        status: "unavailable",
        title: `Local does not currently export to ${destinationLabel}`,
        description:
          "Unearthed Local exports directly to Obsidian and Craft. Choose Unearthed Online for Notion, Supernotes, or Capacities.",
        path: [sourceLabel, "Unearthed Online", destinationLabel],
      };
    }
    if (source === "koreader") {
      return {
        status: "requires",
        title: "Yes—with the KOReader plugin",
        description:
          "The Unearthed KOReader plugin sends your highlights to Local, which can then export them automatically.",
        path: ["KOReader plugin", "Unearthed Local", destinationLabel],
      };
    }
    if (source === "physical") {
      return {
        status: "requires",
        title: "Yes—with Unearthed Mobile",
        description:
          "Capture the passage with Mobile's OCR camera. It syncs to Local over your network, then Local exports it.",
        path: ["Unearthed Mobile", "Unearthed Local", destinationLabel],
      };
    }
    return {
      status: "supported",
      title: "Yes—this works with Unearthed Local",
      description:
        source === "kindle"
          ? "Local imports your Kindle highlights in the background and exports them without storing your Amazon credentials."
          : "Local brings this content into your library and exports it directly.",
      path: [sourceLabel, "Unearthed Local", destinationLabel],
    };
  }

  if (product === "online") {
    if (destination === "craft") {
      return {
        status: "unavailable",
        title: "Online does not currently export to Craft",
        description:
          "Unearthed Local supports Craft. Online supports Obsidian, Notion, Supernotes, and Capacities.",
        path: [sourceLabel, "Unearthed Local", "Craft"],
      };
    }
    if (source === "kindle" || source === "koreader") {
      return {
        status: source === "koreader" ? "requires" : "supported",
        title:
          source === "koreader"
            ? "Yes—with the KOReader plugin"
            : "Yes—this works with Unearthed Online",
        description:
          source === "koreader"
            ? "Use the Unearthed KOReader plugin to bring highlights into your Online library."
            : "The browser extension imports Kindle highlights using your existing browser session; your Amazon password is never stored.",
        path: [
          source === "koreader" ? "KOReader plugin" : "Browser extension",
          "Unearthed Online",
          destinationLabel,
        ],
      };
    }
    if (source === "physical") {
      return {
        status: "manual",
        title: "Possible, with manual capture",
        description:
          "You can add the passage to Online manually. For fast OCR capture, Unearthed Mobile paired with Local is the better workflow.",
        path: ["Manual capture", "Unearthed Online", destinationLabel],
      };
    }
    return {
      status: "manual",
      title: "Not automated in Online",
      description:
        "You can add this content manually, but automatic YouTube, RSS, and web-page capture are features of Unearthed Local.",
      path: ["Manual addition", "Unearthed Online", destinationLabel],
    };
  }

  if (destination === "obsidian" || destination === "craft") {
    return {
      status: "requires",
      title: "Yes—when Mobile is paired with Local",
      description:
        source === "physical"
          ? "Capture the passage with Mobile's OCR camera. Mobile sends it to Local, which exports it to your destination."
          : "Unearthed Local is required to import or manage this source and export it. Mobile gives you access to the library on your phone.",
      path:
        source === "physical"
          ? ["Mobile OCR capture", "Unearthed Local", destinationLabel]
          : [sourceLabel, "Unearthed Local + Mobile", destinationLabel],
    };
  }

  return {
    status: "unavailable",
    title: `Mobile does not directly sync to ${destinationLabel}`,
    description:
      "Mobile is a local companion for capture, search, and reflection. For cloud destinations such as Notion, Supernotes, and Capacities, choose Unearthed Online.",
    path: [sourceLabel, "Unearthed Online", destinationLabel],
  };
}

const statusStyles: Record<Status, string> = {
  supported:
    "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-100",
  requires:
    "border-sky-300 bg-sky-50 text-sky-950 dark:border-sky-800 dark:bg-sky-950/45 dark:text-sky-100",
  manual:
    "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/45 dark:text-amber-100",
  unavailable:
    "border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-800 dark:bg-rose-950/45 dark:text-rose-100",
};

export function CompatibilityChecker({
  product,
  className,
  triggerLabel,
}: {
  product: UnearthedProduct;
  className?: string;
  triggerLabel?: string;
}) {
  const [selectedProduct, setSelectedProduct] =
    useState<UnearthedProduct>(product);
  const [source, setSource] = useState<Source>("kindle");
  const [destination, setDestination] = useState<Destination>("obsidian");
  const result = useMemo(
    () => getCompatibility(selectedProduct, source, destination),
    [selectedProduct, source, destination]
  );
  const ProductIcon = productIcons[selectedProduct];
  const accent = accents[selectedProduct];
  const triggerAccent = accents[product];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none",
            triggerAccent.button,
            className
          )}
        >
          <Puzzle className="h-4 w-4" />
          {triggerLabel ?? `Check if ${productNames[product]} is right for you`}
        </button>
      </DialogTrigger>

      <DialogContent className="!h-auto !max-h-[90vh] !block max-w-4xl overflow-y-auto rounded-2xl border-2 border-foreground/70 bg-background p-0 shadow-[8px_8px_0_hsl(var(--foreground))]">
        <DialogHeader
          className={cn(
            "border-b p-5 pr-14 sm:p-6 sm:pr-14",
            accent.soft,
            accent.border
          )}
        >
          <div
            className={cn(
              "mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.16em]",
              accent.text
            )}
          >
            <ProductIcon className="h-4 w-4" />
            Compatibility checker
          </div>
          <DialogTitle className={serif.className + " text-2xl sm:text-3xl"}>
            Is {productNames[selectedProduct]} right for your reading setup?
          </DialogTitle>
          <DialogDescription className="max-w-2xl pt-1 text-sm leading-5">
            Choose where your content comes from and where you want it to go.
            We’ll show the exact path and any extra requirements.
          </DialogDescription>
        </DialogHeader>

        <div
          role="group"
          aria-labelledby="product-version-label"
          className="grid gap-3 border-b border-border/70 px-5 py-5 sm:px-6 md:grid-cols-[180px_1fr] md:items-center md:gap-6"
        >
          <div>
            <p
              id="product-version-label"
              className="text-[10px] font-black uppercase tracking-[.16em] text-muted-foreground"
            >
              Unearthed version
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Compare any version
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["local", "online", "mobile"] as UnearthedProduct[]).map(
              (option) => {
                const OptionIcon = productIcons[option];
                const optionAccent = accents[option];

                return (
                  <button
                    type="button"
                    aria-pressed={selectedProduct === option}
                    onClick={() => setSelectedProduct(option)}
                    className={cn(
                      "flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-black transition sm:text-sm",
                      selectedProduct === option
                        ? cn(
                            optionAccent.soft,
                            optionAccent.border,
                            optionAccent.text,
                            "shadow-[3px_3px_0_hsl(var(--foreground))]"
                          )
                        : "border-border bg-card hover:border-foreground/40"
                    )}
                    key={option}
                  >
                    <OptionIcon className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">Unearthed</span>{" "}
                    {option[0].toUpperCase() + option.slice(1)}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div
            role="group"
            aria-labelledby="reading-source-label"
            className="grid gap-4 border-b border-border/60 pb-5 md:grid-cols-[180px_1fr] md:items-start md:gap-6"
          >
            <div className="pt-1">
              <p
                id="reading-source-label"
                className="text-xs font-black uppercase tracking-[.16em] text-muted-foreground"
              >
                1. Where are you reading?
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Pick the source of your highlights or saved content.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {sources.map(({ id, label, Icon }) => (
                <button
                  type="button"
                  aria-pressed={source === id}
                  onClick={() => setSource(id)}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-xl border-2 p-3 text-left text-sm font-bold transition",
                    source === id
                      ? cn(
                          accent.soft,
                          accent.border,
                          accent.text,
                          "shadow-[3px_3px_0_hsl(var(--foreground))]"
                        )
                      : "border-border bg-card hover:border-foreground/40"
                  )}
                  key={id}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            role="group"
            aria-labelledby="sync-destination-label"
            className="grid gap-4 md:grid-cols-[180px_1fr] md:items-start md:gap-6"
          >
            <div className="pt-1">
              <p
                id="sync-destination-label"
                className="text-xs font-black uppercase tracking-[.16em] text-muted-foreground"
              >
                2. Where should it go?
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Choose the tool where you want to use your highlights.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {destinations.map(({ id, label }) => (
                <button
                  type="button"
                  aria-pressed={destination === id}
                  onClick={() => setDestination(id)}
                  className={cn(
                    "min-h-12 rounded-xl border-2 px-3 py-2 text-sm font-bold transition",
                    destination === id
                      ? cn(
                          accent.soft,
                          accent.border,
                          accent.text,
                          "shadow-[3px_3px_0_hsl(var(--foreground))]"
                        )
                      : "border-border bg-card hover:border-foreground/40"
                  )}
                  key={id}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <section
            aria-live="polite"
            className={cn(
              "rounded-2xl border-2 p-4 sm:p-5",
              statusStyles[result.status]
            )}
          >
            <div className="flex items-start gap-3">
              {result.status === "unavailable" ? (
                <XCircle className="mt-0.5 h-6 w-6 shrink-0" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />
              )}
              <div>
                <p className="text-xs font-black uppercase tracking-[.15em] opacity-65">
                  {result.status === "supported"
                    ? "Supported"
                    : result.status === "requires"
                      ? "Supported with a requirement"
                      : result.status === "manual"
                        ? "Manual workflow"
                        : "Not supported by this version"}
                </p>
                <h3 className={serif.className + " mt-1 text-2xl font-bold"}>
                  {result.title}
                </h3>
                <p className="mt-2 text-sm leading-6 opacity-80">
                  {result.description}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col items-stretch gap-2 border-t border-current/15 pt-5 sm:flex-row sm:items-center">
              {result.path.map((step, index) => (
                <div className="contents" key={`${step}-${index}`}>
                  <span className="rounded-lg border border-current/20 bg-white/45 px-3 py-2 text-center text-xs font-bold dark:bg-black/15">
                    {step}
                  </span>
                  {index < result.path.length - 1 && (
                    <ArrowRight className="mx-auto h-4 w-4 rotate-90 opacity-50 sm:rotate-0" />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
