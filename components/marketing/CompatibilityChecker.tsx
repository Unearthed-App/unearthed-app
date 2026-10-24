/**
 * Copyright (C) 2026 Unearthed App
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

import { buttonVariants } from "@/components/ui/button";
import { CAPACITIES_ENABLED, CAPACITIES_LABEL, CAPACITIES_COMING_SOON, capacitiesText } from "@/lib/capacities-availability";
import { useId, useMemo, useState } from "react";
import { Crimson_Pro } from "next/font/google";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Info,
  PencilLine,
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
import styles from "./CompatibilityChecker.module.css";

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
type Status = "supported" | "requires" | "manual" | "unavailable" | "coming-soon";

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
  { id: "capacities", label: CAPACITIES_LABEL },
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

  if (destination === "capacities" && !CAPACITIES_ENABLED) return { status: "coming-soon", title: "Capacities · Coming soon", description: CAPACITIES_COMING_SOON, path: [] };

  if (product === "local") {
    if (destination !== "obsidian" && destination !== "craft") {
      return {
        status: "unavailable",
        title: `Local does not currently export to ${destinationLabel}`,
        description:
          capacitiesText("Unearthed Local exports directly to Obsidian and Craft. Choose Unearthed Online for Notion, Supernotes, or Capacities.", "Unearthed Local exports directly to Obsidian and Craft. Choose Unearthed Online for Notion or Supernotes. Capacities coming soon."),
        path: [sourceLabel, "Unearthed Online", destinationLabel],
      };
    }
    if (source === "koreader") {
      return {
        status: "requires",
        title: "Yes, with the KOReader plugin",
        description:
          "The Unearthed KOReader plugin sends your highlights to Local, which can then export them automatically.",
        path: ["KOReader plugin", "Unearthed Local", destinationLabel],
      };
    }
    if (source === "physical") {
      return {
        status: "requires",
        title: "Yes, with Unearthed Mobile",
        description:
          "Capture the passage with Mobile's OCR camera. It syncs to Local over your network, then Local exports it.",
        path: ["Unearthed Mobile", "Unearthed Local", destinationLabel],
      };
    }
    return {
      status: "supported",
      title: "Yes, this works with Unearthed Local",
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
          capacitiesText("Unearthed Local supports Craft. Online supports Obsidian, Notion, Supernotes, and Capacities.", "Unearthed Local supports Craft. Online supports Obsidian, Notion and Supernotes. Capacities coming soon."),
        path: [sourceLabel, "Unearthed Local", "Craft"],
      };
    }
    if (source === "kindle" || source === "koreader") {
      return {
        status: source === "koreader" ? "requires" : "supported",
        title:
          destination === "supernotes" || destination === "capacities"
            ? `Yes, daily reflections go to ${destinationLabel}`
            : source === "koreader"
            ? "Yes, with the KOReader plugin"
            : "Yes, this works with Unearthed Online",
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
        "You can add this content manually, but automatic YouTube, RSS, and web page capture are features of Unearthed Local.",
      path: ["Manual addition", "Unearthed Online", destinationLabel],
    };
  }

  if (destination === "obsidian" || destination === "craft") {
    return {
      status: "requires",
      title: "Yes, when Mobile is paired with Local",
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
      capacitiesText("Mobile is a local companion for capture, search, and reflection. For cloud destinations such as Notion, Supernotes, and Capacities, choose Unearthed Online.", "Mobile is a local companion for capture, search and reflection. Choose Unearthed Online for Notion or Supernotes. Capacities coming soon."),
    path: [sourceLabel, "Unearthed Online", destinationLabel],
  };
}

function getConfigurationNotes(
  product: UnearthedProduct,
  source: Source,
  destination: Destination,
  status: Status
): string[] {
  if (destination === "capacities" && !CAPACITIES_ENABLED) return [];
  const notes: string[] = [];
  const destinationLabel = destinations.find((item) => item.id === destination)!.label;

  if (destination === "supernotes" || destination === "capacities") {
    notes.push(
      `Only the daily reflection is sent to ${destinationLabel}. This does not sync your full library, whole books or all their highlights.`
    );
    notes.push(
      destination === "capacities"
        ? "Online adds the reflection to a Capacities daily note. Connect through Capacities’ approval screen in Online settings and choose a space."
        : "Connect your Supernotes API key and enable daily reflections in Online settings."
    );
  }

  if (status === "unavailable") {
    notes.push("The selected combination has no direct export. The alternative below uses a different Unearthed edition.");
  }
  const pathProduct = status === "unavailable"
    ? destination === "craft" ? "local" : "online"
    : product;

  if (source === "kindle") {
    notes.push("Kindle sync imports highlights available in Amazon Kindle Notebook. Books or documents you copied onto your Kindle yourself may be missing there.");
  }
  if (source === "koreader") {
    notes.push("Install and connect the Unearthed KOReader plugin to send your highlights.");
  }
  if (pathProduct === "online") {
    if (destination === "obsidian") {
      notes.push("Obsidian exports require the Unearthed Obsidian plugin, connected to your Online account.");
    }
    if (source === "physical") {
      notes.push("Online has no camera capture for physical books. Add the passage and its book details by hand.");
    } else if (source === "youtube" || source === "rss" || source === "webpage") {
      notes.push("Online does not automatically import this source. Add the passages you want to keep by hand.");
    }
  }
  if (pathProduct === "mobile" || (pathProduct === "local" && source === "physical")) {
    notes.push("This setup needs both Unearthed Local and Mobile, which are separate purchases. Mobile connects to Local over your network; Local handles the export.");
  }
  return notes;
}

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
  const configurationNotes = getConfigurationNotes(selectedProduct, source, destination, result.status);
  const reflectionOnly = destination === "supernotes" || destination === "capacities";
  const readingPath = reflectionOnly && result.path.length > 0
    ? [...result.path.slice(0, -1), "Daily reflection", result.path[result.path.length - 1]]
    : result.path;
  const ProductIcon = productIcons[selectedProduct];
  const id = useId();
  const StatusIcon =
    result.status === "coming-soon"
      ? Info
      : result.status === "unavailable"
      ? XCircle
      : result.status === "manual"
        ? PencilLine
        : result.status === "requires"
          ? Info
          : CheckCircle2;
  const statusLabel = {
    supported: "Supported",
    requires: "One extra step",
    manual: "Manual workflow",
    unavailable: "Not supported",
    "coming-soon": "Coming soon",
  }[result.status];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={buttonVariants({ variant: "marketingSecondary", tone: product, className: className })}
        >
          <Puzzle className="h-4 w-4" />
          {triggerLabel ?? "Check my reading setup"}
        </button>
      </DialogTrigger>

      <DialogContent
        data-product={selectedProduct}
        className={cn(
          "!h-auto !max-h-[90dvh] !block overflow-y-auto p-0",
          styles.dialog
        )}
      >
        <DialogHeader className={styles.header}>
          <div className={styles.eyebrow}>
            <ProductIcon size={16} aria-hidden="true" /> Compatibility checker
          </div>
          <DialogTitle className={cn(serif.className, styles.title)}>
            Is {productNames[selectedProduct]} right for you?
          </DialogTitle>
          <DialogDescription className={styles.description}>
            Choose what you read and where your quotes belong. We’ll show you how
            they connect.
          </DialogDescription>
        </DialogHeader>

        <div className={styles.body}>
          <div
            role="group"
            aria-labelledby={`${id}-edition`}
            className={styles.row}
          >
            <div className={styles.rowLabel}>
              <span className={styles.number}>01</span>
              <div>
                <p id={`${id}-edition`}>Your edition</p>
                <small>Compare any version</small>
              </div>
            </div>
            <div className={styles.editions}>
              {(["local", "online", "mobile"] as UnearthedProduct[]).map(
                (option) => {
                  const Icon = productIcons[option];
                  return (
                    <button
                      type="button"
                      aria-pressed={selectedProduct === option}
                      onClick={() => setSelectedProduct(option)}
                      className={cn(styles.choice, styles.edition)}
                      key={option}
                    >
                      <Icon size={17} aria-hidden="true" />
                      <span>{option[0].toUpperCase() + option.slice(1)}</span>
                      <Check
                        size={14}
                        aria-hidden="true"
                        className={styles.selectedMark}
                      />
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div
            role="group"
            aria-labelledby={`${id}-source`}
            className={styles.row}
          >
            <div className={styles.rowLabel}>
              <span className={styles.number}>02</span>
              <div>
                <p id={`${id}-source`}>What you read</p>
                <small>Pick a highlight source</small>
              </div>
            </div>
            <div className={styles.sources}>
              {sources.map(({ id: sourceId, label, Icon }) => (
                <button
                  type="button"
                  aria-pressed={source === sourceId}
                  onClick={() => setSource(sourceId)}
                  className={styles.choice}
                  key={sourceId}
                >
                  <Icon size={17} aria-hidden="true" />
                  <span>{label}</span>
                  <Check
                    size={14}
                    aria-hidden="true"
                    className={styles.selectedMark}
                  />
                </button>
              ))}
            </div>
          </div>

          <div
            role="group"
            aria-labelledby={`${id}-destination`}
            className={cn(styles.row, styles.lastRow)}
          >
            <div className={styles.rowLabel}>
              <span className={styles.number}>03</span>
              <div>
                <p id={`${id}-destination`}>Where it goes</p>
                <small>Your notes, your tools</small>
              </div>
            </div>
            <div className={styles.destinations}>
              {destinations.map(({ id: destinationId, label }) => (
                <button
                  type="button"
                  aria-pressed={destination === destinationId}
                  onClick={() => setDestination(destinationId)}
                  className={cn(styles.choice, styles.destination)}
                  key={destinationId}
                >
                  <span>{label}</span>
                  <Check
                    size={12}
                    aria-hidden="true"
                    className={styles.selectedMark}
                  />
                </button>
              ))}
            </div>
          </div>

          <section
            aria-live="polite"
            aria-atomic="true"
            data-status={result.status}
            className={styles.result}
          >
            <div className={styles.resultHeading}>
              <StatusIcon size={21} aria-hidden="true" />
              <span className={styles.status}>{statusLabel}</span>
            </div>
            <h3 className={cn(serif.className, styles.resultTitle)}>
              {result.title}
            </h3>
            <p className={styles.resultDescription}>{result.description}</p>
            {configurationNotes.length > 0 && (
              <div className={styles.limitations}>
                <div className={styles.limitationsHeading}>
                  <Info size={17} aria-hidden="true" />
                  <strong>{result.status === "coming-soon" ? "Integration update" : reflectionOnly ? "Daily reflections only" : "What to know about this setup"}</strong>
                </div>
                <ul>
                  {configurationNotes.map((note) => <li key={note}>{note}</li>)}
                </ul>
              </div>
            )}
            {readingPath.length > 0 && <>
            <div className={styles.routeLabel}>
              {result.status === "unavailable"
                ? "Alternative to explore"
                : "Your reading path"}
            </div>
            <ol
              className={styles.path}
              aria-label={
                result.status === "unavailable"
                  ? "Alternative reading path"
                  : "Your reading path"
              }
            >
              {readingPath.map((step, index) => (
                <li key={`${step}-${index}`}>
                  {index > 0 && (
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className={styles.pathArrow}
                    />
                  )}
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            </>}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
