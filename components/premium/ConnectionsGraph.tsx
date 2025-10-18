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

import { Button } from "@/components/ui/button";
import { getBookNetworkData } from "@/server/actions-premium";
import { toast } from "@/hooks/use-toast";
import { Loader2, Waypoints, X, Book, Quote, Tag, Info } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { MultiGraph } from "graphology";
import Sigma from "sigma";
import FA2LayoutSupervisor from "graphology-layout-forceatlas2/worker";
import Link from "next/link";
import { ConnectionsGraphModal } from "./ConnectionsGraphModal";
import { createPortal } from "react-dom";

const getCSSColorValue = (cssVar: string): string => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "#888888";
  }
  try {
    const hslRaw = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim();
    if (!hslRaw) {
      console.warn(`CSS variable ${cssVar} not found or empty.`);
      return "#888888";
    }
    const temp = document.createElement("div");
    temp.style.color = `hsl(${hslRaw})`;
    temp.style.position = "absolute";
    temp.style.opacity = "0";
    temp.style.pointerEvents = "none";
    document.body.appendChild(temp);
    const color = window.getComputedStyle(temp).color;
    document.body.removeChild(temp);
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const hex =
        "#" +
        rgb
          .slice(0, 3)
          .map((x) => {
            const hexValue = parseInt(x, 10).toString(16);
            return hexValue.length === 1 ? "0" + hexValue : hexValue;
          })
          .join("");
      return hex;
    } else {
      console.warn(
        `Could not parse RGB from computed color '${color}' for variable ${cssVar}.`
      );
      return "#888888";
    }
  } catch (error) {
    console.error(`Error getting CSS color value for ${cssVar}:`, error);
    return "#888888";
  }
};

const NODE_SIZES: Record<string, number> = {
  source: 15,
  quote: 10,
  tag: 7,
  default: 8,
};

const HIGHLIGHT_COLOR = "#ff9900";
const HIGHLIGHT_TEXT_COLOR = "#BD7201";
const DEFAULT_EDGE_COLOR = "#e2e2e2";
const DEFAULT_EDGE_COLOR_DARK = "#333333";
const DIMMED_EDGE_COLOR = "#e2e2e2";
const DIMMED_EDGE_COLOR_DARK = "#333333";
const DIMMED_NODE_COLOR = "#e2e2e2";

const isDarkMode = (): boolean => {
  return document.documentElement.classList.contains("dark");
};

const NodeDetailsPopup = ({
  node,
  onClose,
}: {
  node: any;
  onClose: () => void;
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const nodeUrl =
    node.contentType === "quote"
      ? `/premium/book/${node.sourceId}`
      : node.contentType === "tag"
        ? `/premium/tag/${node.id}`
        : node.contentType === "source"
          ? `/premium/book/${node.id}`
          : "";

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div>
              {node.contentType === "source" && <Book className="h-5 w-5" />}
              {node.contentType === "quote" && <Quote className="h-5 w-5" />}
              {node.contentType === "tag" && <Tag className="h-5 w-5" />}
            </div>
            <h2 className="text-xl font-semibold">
              {node.label &&
                node.label.charAt(0).toUpperCase() + node.label.slice(1)}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            {" "}
            <X className="h-4 w-4" />{" "}
          </Button>
        </div>
        <div className="space-y-4 overflow-y-auto max-h-64">
          {node.author && (
            <p className="text-sm text-muted-foreground">By {node.author}</p>
          )}
          {node.fullContent && <p className="text-sm">{node.fullContent}</p>}
          {node.note && <p className="text-sm italic">Note: {node.note}</p>}
          {node.description && <p className="text-sm">{node.description}</p>}
        </div>
        {nodeUrl && (
          <div className="flex justify-end mt-4">
            <Link href={nodeUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="brutal" size="sm">
                {" "}
                View <Info className="ml-2 h-5 w-5" />{" "}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

interface NetworkData {
  sources: any[];
  quotes: any[];
  tags: any[];
  sourceTags: any[];
  quoteTags: any[];
}
interface TransformedNode {
  id: string;
  label: string;
  author?: string;
  x: number;
  y: number;
  type: "source" | "quote" | "tag";
  sourceId?: string;
  note?: string;
  fullContent?: string;
  description?: string;
}
interface TransformedEdge {
  source: string;
  target: string;
}

export const ConnectionsGraph = () => {
  const [isMindMapSigmaGenerating, setIsMindMapSigmaGenerating] =
    useState(false);
  const [mindMapSigmaData, setMindMapSigmaData] = useState<NetworkData | null>(
    null
  );
  const [isMindMapSigmaDialogOpen, setIsMindMapSigmaDialogOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [showSelectedNodeDetails, setShowSelectedNodeDetails] = useState(false);
  const [dynamicSourceColor, setDynamicSourceColor] = useState<string | null>(
    null
  );
  const [dynamicQuoteColor, setDynamicQuoteColor] = useState<string | null>(
    null
  );
  const [dynamicTagColor, setDynamicTagColor] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const rendererRef = useRef<Sigma | null>(null);
  const graphRef = useRef<MultiGraph | null>(null);
  const layoutRef = useRef<FA2LayoutSupervisor | null>(null);
  const searchQueryRef = useRef(searchQuery); // Ref to track latest search query for effects

  useEffect(() => {
    if (isMindMapSigmaDialogOpen) {
      if (!dynamicSourceColor) {
        const color = getCSSColorValue("--alternate");
        setDynamicSourceColor(color);
      }
      if (!dynamicQuoteColor) {
        const color = getCSSColorValue("--primary");
        setDynamicQuoteColor(color);
      }
      if (!dynamicTagColor) {
        const color = getCSSColorValue("--destructive");
        setDynamicTagColor(color);
      }
    }
    if (!isMindMapSigmaDialogOpen) {
      setDynamicSourceColor(null);
      setDynamicQuoteColor(null);
      setDynamicTagColor(null);
    }
  }, [
    isMindMapSigmaDialogOpen,
    dynamicSourceColor,
    dynamicQuoteColor,
    dynamicTagColor,
  ]);

  // Update search query ref whenever state changes
  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  const handleSearch = useCallback(
    (query: string) => {
      if (!graphRef.current || !rendererRef.current) return;

      const graph = graphRef.current;
      const renderer = rendererRef.current;
      const lcQuery = query.toLowerCase().trim();

      setSearchQuery(query);

      if (
        !dynamicSourceColor &&
        !dynamicQuoteColor &&
        !dynamicTagColor &&
        graph.nodes().some((n) => graph.getNodeAttribute(n, "type") === "quote")
      ) {
        console.warn(
          "handleSearch called before dynamicQuoteColor was ready. Resetting might use incorrect original colors."
        );
      }

      if (lcQuery) {
        const matchingNodes = graph.nodes().filter((n) => {
          const attrs = graph.getNodeAttributes(n);
          const label = (attrs.label as string) || "";
          const author = (attrs.author as string) || "";
          const fullContent = (attrs.fullContent as string) || "";
          const note = (attrs.note as string) || "";
          const description = (attrs.description as string) || "";
          return (
            label.toLowerCase().includes(lcQuery) ||
            fullContent.toLowerCase().includes(lcQuery) ||
            note.toLowerCase().includes(lcQuery) ||
            description.toLowerCase().includes(lcQuery) ||
            author.toLowerCase().includes(lcQuery)
          );
        });
        const nodesToHighlight = new Set<string>();
        matchingNodes.forEach((nodeId) => {
          nodesToHighlight.add(nodeId);
          graph.forEachNeighbor(nodeId, (neighborId) =>
            nodesToHighlight.add(neighborId)
          );
        });

        graph.forEachNode((node) => {
          if (nodesToHighlight.has(node)) {
            graph.setNodeAttribute(node, "color", HIGHLIGHT_COLOR);
            graph.setNodeAttribute(node, "highlighted", true);
            graph.setNodeAttribute(node, "labelColor", HIGHLIGHT_TEXT_COLOR);
          } else {
            graph.setNodeAttribute(node, "color", DIMMED_NODE_COLOR);
            graph.setNodeAttribute(node, "highlighted", false);
            graph.setNodeAttribute(
              node,
              "labelColor",
              isDarkMode() ? "#ffffff" : "#000000"
            );
          }
        });
        graph.forEachEdge((edge, attributes, source, target) => {
          const sourceHighlighted = nodesToHighlight.has(source);
          const targetHighlighted = nodesToHighlight.has(target);
          if (sourceHighlighted && targetHighlighted) {
            graph.setEdgeAttribute(edge, "hidden", false);
            graph.setEdgeAttribute(edge, "color", HIGHLIGHT_COLOR);
            graph.setEdgeAttribute(edge, "size", 2);
          } else if (sourceHighlighted || targetHighlighted) {
            graph.setEdgeAttribute(edge, "hidden", false);
            graph.setEdgeAttribute(
              edge,
              "color",
              isDarkMode() ? DEFAULT_EDGE_COLOR_DARK : DEFAULT_EDGE_COLOR
            );
            graph.setEdgeAttribute(edge, "size", 1.5);
          } else {
            graph.setEdgeAttribute(edge, "hidden", true);
            graph.setEdgeAttribute(
              edge,
              "color",
              isDarkMode() ? DIMMED_EDGE_COLOR_DARK : DIMMED_EDGE_COLOR
            );
            graph.setEdgeAttribute(edge, "size", 1);
          }
        });
      } else {
        graph.forEachNode((node) => {
          const originalColor = graph.getNodeAttribute(node, "originalColor");
          graph.setNodeAttribute(node, "color", originalColor || "#888888");
          graph.setNodeAttribute(node, "highlighted", false);
          graph.setNodeAttribute(
            node,
            "labelColor",
            isDarkMode() ? "#ffffff" : "#000000"
          );
        });
        graph.forEachEdge((edge) => {
          graph.setEdgeAttribute(edge, "hidden", false);
          graph.setEdgeAttribute(
            edge,
            "color",
            isDarkMode() ? DEFAULT_EDGE_COLOR_DARK : DEFAULT_EDGE_COLOR
          );
          graph.setEdgeAttribute(edge, "size", 1);
        });
      }
      renderer.refresh();
    },
    [dynamicSourceColor, dynamicQuoteColor, dynamicTagColor]
  );

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showSelectedNodeDetails) {
          setShowSelectedNodeDetails(false);
        } else if (isMindMapSigmaDialogOpen && searchQueryRef.current) {
          handleSearch("");
        } else if (isMindMapSigmaDialogOpen && !searchQueryRef.current) {
          setIsMindMapSigmaDialogOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [isMindMapSigmaDialogOpen, showSelectedNodeDetails, handleSearch]);

  const transformData = (
    rawData: NetworkData | null
  ): { nodes: TransformedNode[]; edges: TransformedEdge[] } | null => {
    if (!rawData) return null;
    const { sources, quotes, tags, sourceTags, quoteTags } = rawData;
    const nodes: TransformedNode[] = [];

    sources.forEach((source, index) => {
      const angle = (2 * Math.PI * index) / sources.length;
      const radius = 10;
      nodes.push({
        id: source.id,
        label: source.title || "Untitled Source",
        author: source.author,
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        type: "source" as const,
      });
    });

    quotes.forEach((quote, index) => {
      const angle = (2 * Math.PI * index) / quotes.length;
      const radius = 20;
      nodes.push({
        id: quote.id,
        sourceId: quote.sourceId,
        label:
          quote.content.length > 31
            ? quote.content.substring(0, 30) + "..."
            : quote.content,
        note: quote.note,
        fullContent: quote.content,
        x: radius * Math.cos(angle) + (Math.random() - 0.5) * 5,
        y: radius * Math.sin(angle) + (Math.random() - 0.5) * 5,
        type: "quote" as const,
      });
    });

    tags.forEach((tag, index) => {
      const angle = (2 * Math.PI * index) / tags.length;
      const radius = 30;
      nodes.push({
        id: tag.id,
        label: tag.title,
        description: tag.description,
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        type: "tag" as const,
      });
    });

    const edges: TransformedEdge[] = [];
    quotes.forEach((quote) =>
      edges.push({ source: quote.sourceId, target: quote.id })
    );
    quoteTags.forEach((qt) =>
      edges.push({ source: qt.quoteId, target: qt.tagId })
    );
    sourceTags
      .filter(
        (st) =>
          !quoteTags.some((qt) => {
            const quote = quotes.find((q) => q.id === qt.quoteId);
            return (
              quote && quote.sourceId === st.sourceId && qt.tagId === st.tagId
            );
          })
      )
      .forEach((st) => edges.push({ source: st.sourceId, target: st.tagId }));

    const validEdges = edges.filter(
      (edge) =>
        nodes.some((n) => n.id === edge.source) &&
        nodes.some((n) => n.id === edge.target)
    );
    return { nodes, edges: validEdges };
  };

  useEffect(() => {
    if (
      !containerRef.current ||
      !mindMapSigmaData ||
      !isMindMapSigmaDialogOpen ||
      !dynamicSourceColor ||
      !dynamicQuoteColor ||
      !dynamicTagColor
    ) {
      layoutRef.current?.kill();
      rendererRef.current?.kill();
      graphRef.current?.clear();
      layoutRef.current = null;
      rendererRef.current = null;
      graphRef.current = null;
      return;
    }

    const graph = new MultiGraph();
    graphRef.current = graph;
    const transformedData = transformData(mindMapSigmaData);
    if (!transformedData) {
      console.error("Transformed data is null, cannot initialize graph.");
      return;
    }

    transformedData.nodes.forEach((node) => {
      const nodeType = node.type || "default";
      let color: string;
      if (nodeType === "source") {
        color = dynamicSourceColor;
      } else if (nodeType === "quote") {
        color = dynamicQuoteColor;
      } else if (nodeType === "tag") {
        color = dynamicTagColor;
      } else {
        color = "#888888";
      }
      const size = NODE_SIZES[nodeType] || NODE_SIZES.default;
      let contentType: "source" | "quote" | "tag" | "" = "";
      if (node.type === "source") contentType = "source";
      else if (node.type === "tag") contentType = "tag";
      else if (node.type === "quote") contentType = "quote";

      graph.addNode(node.id, {
        label: node.label,
        x: node.x,
        y: node.y,
        size: size,
        color: color,
        author: node.author,
        id: node.id,
        sourceId: node.sourceId,
        fullContent: node.fullContent,
        note: node.note,
        description: node.description,
        originalColor: color,
        originalSize: size,
        contentType: contentType,
        type: "circle",
        highlighted: false,
      });
    });

    transformedData.edges.forEach((edge, index) => {
      if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
        try {
          const edgeId = `${edge.source}->${edge.target}_${index}`;
          const currentEdgeColor = isDarkMode()
            ? DEFAULT_EDGE_COLOR_DARK
            : DEFAULT_EDGE_COLOR;
          graph.addEdgeWithKey(edgeId, edge.source, edge.target, {
            size: 1,
            color: currentEdgeColor,
            originalColor: currentEdgeColor,
            hidden: false,
            type: "line",
          });
        } catch (e) {
          console.warn(`Could not add edge`, e);
        }
      } else {
        console.warn(
          `Skipping edge due to missing node: ${edge.source} or ${edge.target}`
        );
      }
    });

    // --- Sigma Renderer Initialization ---
    const renderer = new Sigma(graph, containerRef.current, {
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
      defaultNodeColor: "#888888",
      defaultEdgeColor: isDarkMode()
        ? DEFAULT_EDGE_COLOR_DARK
        : DEFAULT_EDGE_COLOR,
      labelFont: "Arial",
      labelSize: 12,
      labelWeight: "500",
      labelRenderedSizeThreshold: 12,
      renderLabels: true,
      defaultEdgeType: "line",
      allowInvalidContainer: true,
      hideEdgesOnMove: true,
      hideLabelsOnMove: true,
      labelColor: {
        attribute: "labelColor",
        color: isDarkMode() ? "#ffffff" : "#000000",
      },
      nodeReducer: (node, data) => {
        const graph = graphRef.current;
        if (!graph) return data;
        const attrs = graph.getNodeAttributes(node);
        const res = { ...data };
        if (attrs.color) res.color = attrs.color;
        if (attrs.size) res.size = attrs.size;
        if (attrs.hidden) res.hidden = attrs.hidden;
        return res;
      },
      edgeReducer: (edge, data) => {
        const graph = graphRef.current;
        if (!graph) return data;
        const attrs = graph.getEdgeAttributes(edge);
        const res = { ...data };
        if (attrs.color) res.color = attrs.color;
        if (attrs.size) res.size = attrs.size;
        if (attrs.hidden !== undefined) res.hidden = attrs.hidden;
        return res;
      },
    });
    rendererRef.current = renderer;

    const layout = new FA2LayoutSupervisor(graph, {
      settings: {
        barnesHutOptimize: graph.order > 1000,
        strongGravityMode: false,
        gravity: 1,
        scalingRatio: 2.0,
        slowDown: Math.max(1, Math.log(graph.order + 1)),
        linLogMode: false,
        adjustSizes: true,
        edgeWeightInfluence: 0.2,
        outboundAttractionDistribution: true,
        barnesHutTheta: 0.5,
      },
    });
    layoutRef.current = layout;
    layout.start();

    const handleNodeClick = (event: { node: string }) => {
      const graph = graphRef.current;
      if (!graph) return;
      const nodeAttributes = graph.getNodeAttributes(event.node);
      if (nodeAttributes) {
        setSelectedNode(nodeAttributes);
        setShowSelectedNodeDetails(true);
      } else {
        console.warn("Clicked node has no attributes:", event.node);
      }
    };
    let currentlyHoveredNode: string | null = null;
    const handleEnterNode = (event: { node: string }) => {
      const graph = graphRef.current;
      const renderer = rendererRef.current;
      if (!graph || !renderer || searchQueryRef.current) return;
      currentlyHoveredNode = event.node;
      const neighbors = new Set<string>(graph.neighbors(currentlyHoveredNode));
      neighbors.add(currentlyHoveredNode);
      graph.forEachNode((node) => {
        if (neighbors.has(node)) {
          graph.setNodeAttribute(node, "color", HIGHLIGHT_COLOR);
          graph.setNodeAttribute(node, "labelColor", HIGHLIGHT_TEXT_COLOR);
        } else {
          graph.setNodeAttribute(node, "color", DIMMED_NODE_COLOR);
          graph.setNodeAttribute(
            node,
            "labelColor",
            isDarkMode() ? "#ffffff" : "#000000"
          );
        }
      });
      graph.forEachEdge((edge, attributes, source, target) => {
        const sourceIsNeighbor = neighbors.has(source);
        const targetIsNeighbor = neighbors.has(target);
        if (sourceIsNeighbor && targetIsNeighbor) {
          graph.setEdgeAttribute(edge, "hidden", false);
          graph.setEdgeAttribute(edge, "color", HIGHLIGHT_COLOR);
          graph.setEdgeAttribute(edge, "size", 2);
        } else if (sourceIsNeighbor || targetIsNeighbor) {
          graph.setEdgeAttribute(edge, "hidden", false);
          graph.setEdgeAttribute(
            edge,
            "color",
            isDarkMode() ? DEFAULT_EDGE_COLOR_DARK : DEFAULT_EDGE_COLOR
          );
          graph.setEdgeAttribute(edge, "size", 1.5);
        } else {
          graph.setEdgeAttribute(edge, "hidden", true);
          graph.setEdgeAttribute(
            edge,
            "color",
            isDarkMode() ? DIMMED_EDGE_COLOR_DARK : DIMMED_EDGE_COLOR
          );
          graph.setEdgeAttribute(edge, "size", 1);
        }
      });
      renderer.refresh();
    };
    const handleLeaveNode = () => {
      const graph = graphRef.current;
      const renderer = rendererRef.current;

      if (
        !graph ||
        !renderer ||
        !currentlyHoveredNode ||
        searchQueryRef.current
      ) {
        return;
      }
      graph.forEachNode((node) => {
        graph.setNodeAttribute(
          node,
          "color",
          graph.getNodeAttribute(node, "originalColor")
        );
        graph.setNodeAttribute(
          node,
          "labelColor",
          isDarkMode() ? "#ffffff" : "#000000"
        );
      });
      graph.forEachEdge((edge) => {
        graph.setEdgeAttribute(edge, "hidden", false);
        graph.setEdgeAttribute(
          edge,
          "color",
          graph.getEdgeAttribute(edge, "originalColor")
        );
        graph.setEdgeAttribute(edge, "size", 1);
      });
      currentlyHoveredNode = null;
      renderer.refresh();
    };

    renderer.on("clickNode", handleNodeClick);
    renderer.on("enterNode", handleEnterNode);
    renderer.on("leaveNode", handleLeaveNode);

    const layoutDuration = 8000;
    const timeoutId = setTimeout(() => {
      layoutRef.current?.stop();
      if (renderer.getCamera) {
        const finalRatio = graph.order > 50 ? 1.5 : 1.1;
        // Calculate the center of the viewport using camera coordinates
        const camera = renderer.getCamera();
        const viewportState = camera.getState();
        const graphCenter = {
          x: viewportState.x,
          y: viewportState.y,
        };

        renderer.getCamera().animate(
          {
            ratio: finalRatio,
            x: graphCenter.x,
            y: graphCenter.y,
          },
          { duration: 600 }
        );
      }
    }, layoutDuration);

    return () => {
      clearTimeout(timeoutId);
      layoutRef.current?.kill();
      rendererRef.current?.kill();
      graphRef.current?.clear();
      layoutRef.current = null;
      rendererRef.current = null;
      graphRef.current = null;
      currentlyHoveredNode = null;
    };
  }, [mindMapSigmaData, isMindMapSigmaDialogOpen, dynamicQuoteColor]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.target instanceof HTMLElement &&
          mutation.attributeName === "class"
        ) {
          const renderer = rendererRef.current;
          if (renderer) {
            renderer.refresh();
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleGenerateMindMapSigma = async () => {
    setIsMindMapSigmaGenerating(true);
    setMindMapSigmaData(null);
    setDynamicQuoteColor(null); // Reset color
    setSearchQuery("");
    setSelectedNode(null);
    setShowSelectedNodeDetails(false);
    try {
      const result = await getBookNetworkData();
      if (!result || !result.sources || !result.quotes || !result.tags) {
        throw new Error("Received invalid data from API.");
      }

      if (result.sources.length == 0) {
        toast({
          title: "Error",
          description: "No data found, make sure you have synced some books first",
          variant: "destructive",
        });
        return;
      }

      setMindMapSigmaData(result);
      setIsMindMapSigmaDialogOpen(true);
    } catch (error) {
      console.error("Error generating mind map:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate mind map.",
        variant: "destructive",
      });
      setIsMindMapSigmaDialogOpen(false);
    } finally {
      setIsMindMapSigmaGenerating(false);
    }
  };

  return (
    <>
      <div className="">
        <Button
          variant="brutalshimmer"
          className="w-full"
          size={"icon"}
          onClick={handleGenerateMindMapSigma}
          disabled={isMindMapSigmaGenerating}
          aria-label="Generate Connections Graph"
        >
          {isMindMapSigmaGenerating ? (
            <>
              {" "}
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              {" "}
              <Waypoints className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <ConnectionsGraphModal
        isOpen={isMindMapSigmaDialogOpen}
        onClose={() => setIsMindMapSigmaDialogOpen(false)}
        onRefresh={handleGenerateMindMapSigma}
        isGenerating={isMindMapSigmaGenerating}
        searchQuery={searchQuery}
        onSearch={(value) => handleSearch(value)}
        searchInputRef={searchInputRef}
        containerRef={containerRef}
        mindMapSigmaData={mindMapSigmaData}
        dynamicQuoteColor={dynamicQuoteColor}
      />

      {showSelectedNodeDetails && selectedNode && (
        <NodeDetailsPopup
          node={selectedNode}
          onClose={() => {
            setShowSelectedNodeDetails(false);
            setSelectedNode(null);
          }}
        />
      )}
    </>
  );
};
