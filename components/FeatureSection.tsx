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
import { useState, useEffect, useRef } from "react";
import { PackageOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Crimson_Pro } from "next/font/google";
import { Button } from "./ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

type Feature = {
  id: string;
  title: string;
  icon?: React.ElementType;
  image?: string;
  description: string;
  videoUrl: string;
  fallbackImageUrl?: string;
};

const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

const FeatureSection = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activeTab, setActiveTab] = useState("contrary");
  const [loadedVideos, setLoadedVideos] = useState<string[]>(["contrary"]);
  const [visibleVideos, setVisibleVideos] = useState<string[]>(["contrary"]);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const videoContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const fallbackTimeout = useRef<NodeJS.Timeout | null>(null);
  const [videoLoadError, setVideoLoadError] = useState<Record<string, boolean>>(
    {}
  );
  const [erroredVideos, setErroredVideos] = useState<Set<string>>(new Set());

  const handleVideoError = (featureId: string) => {
    // Add to errored videos set to prevent retry attempts
    setErroredVideos((prev) => new Set(prev).add(featureId));

    // Update other states
    setVideoLoadError((prevErrors) => ({
      ...prevErrors,
      [featureId]: true,
    }));

    setLoadedVideos((prev) => prev.filter((id) => id !== featureId));

    // Remove video element from refs to prevent further attempts
    videoRefs.current.delete(featureId);
  };

  const resetVideoError = (featureId: string) => {
    setVideoLoadError((prevErrors) => {
      const newState = { ...prevErrors };
      delete newState[featureId];
      return newState;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const featureId = entry.target.getAttribute("data-feature-id");
          if (!featureId) return;

          setVisibleVideos((prev) =>
            entry.isIntersecting
              ? [...prev, featureId]
              : prev.filter((id) => id !== featureId)
          );

          if (entry.isIntersecting) {
            if (!loadedVideos.includes(featureId)) {
              setLoadedVideos((prev) => [...prev, featureId]);
            }

            // Play video when it comes into view (desktop only)
            if (isDesktop) {
              const video = videoRefs.current.get(featureId);
              if (
                video &&
                video.readyState >= 2 &&
                !videoLoadError[featureId]
              ) {
                video.play().catch(() => {});
              } else if (video && !videoLoadError[featureId]) {
                const handleCanPlay = () => {
                  video.play().catch(() => {});
                  video.removeEventListener("canplay", handleCanPlay);
                };
                video.addEventListener("canplay", handleCanPlay);
              }
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    videoContainerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
      if (fallbackTimeout.current) {
        clearTimeout(fallbackTimeout.current);
      }
      videoRefs.current.forEach((video) => {
        video.removeEventListener("canplay", () => {});
        video.removeEventListener("error", () => {});
      });
    };
  }, [loadedVideos, isDesktop, videoLoadError]);

  useEffect(() => {
    visibleVideos.forEach((featureId) => {
      const video = videoRefs.current.get(featureId);
      if (
        video &&
        loadedVideos.includes(featureId) &&
        !videoLoadError[featureId]
      ) {
        if (video.readyState >= 2) {
          video.play().catch((error) => {
            console.warn(`Video playback failed: ${error.message}`);
            handleVideoError(featureId);
          });
        } else {
          const handleCanPlay = () => {
            video.play().catch((error) => {
              console.warn(`Video playback failed: ${error.message}`);
              handleVideoError(featureId);
            });
            video.removeEventListener("canplay", handleCanPlay);
          };
          video.addEventListener("canplay", handleCanPlay);
        }
      }
    });

    const videosToPause = loadedVideos.filter(
      (id) => !visibleVideos.includes(id)
    );
    videosToPause.forEach((featureId) => {
      const video = videoRefs.current.get(featureId);
      if (video) video.pause();
    });

    return () => {
      videoRefs.current.forEach((video) => {
        video.removeEventListener("canplay", () => {});
        video.removeEventListener("error", () => {});
      });
      if (fallbackTimeout.current) {
        clearTimeout(fallbackTimeout.current);
      }
    };
  }, [visibleVideos, loadedVideos, videoLoadError]);

  const handleTabClick = (featureId: string) => {
    setActiveTab(featureId);
    if (!loadedVideos.includes(featureId)) {
      setLoadedVideos((prev) => [...prev, featureId]);
    }
    resetVideoError(featureId); // Reset error state when tab is clicked
  };

  const features: Feature[] = [
    {
      id: "contrary",
      title: "Blind Spot Detection",
      image: "/images/eye.png",
      description:
        "Your entire reading history is analyzed to identify potential knowledge gaps and areas for improvement.",
      videoUrl: "/videos/blind-spot.mp4",
      fallbackImageUrl: "/images/blind-spot.webp",
    },
    {
      id: "reflectionquestions",
      title: "Generate Reflection Questions",
      image: "/images/question.png",
      description:
        "Unearthed generates thought-provoking questions about your book, prompting deeper reflection. Answer the questions, and the AI will rate your response and provide an alternative perspective, enhancing your understanding and critical thinking.",
      videoUrl: "/videos/question.mp4",
      fallbackImageUrl: "/images/question.webp",
    },
    {
      id: "analysis",
      title: "Book Analysis",
      image: "/images/microscope.png",
      description:
        "Get comprehensive AI-generated analysis including book summaries, major themes, key takeaways, and an attempt and at the reader's perspective. Perfect for deeper understanding or quick refreshers.",
      videoUrl: "/videos/deep.mp4",
      fallbackImageUrl: "/images/deep.webp",
    },
    {
      id: "similar",
      title: "Book Recommendations",
      image: "/images/hat.png",
      description:
        "Discover books outside of your library that align with your interests based on your reading patterns and highlights. Also receive recommendations that challenge your current viewpoints.",
      videoUrl: "/videos/similar-contrasting.mp4",
      fallbackImageUrl: "/images/similar-contrasting.webp",
    },
    {
      id: "autoextract",
      title: "Auto Extract Key Ideas",
      image: "/images/sparkles.png",
      description:
        "Unearthed identifies and extracts the most important ideas from your highlights, saving you time and effort. You can edit these later, but it's a great starting point.",
      videoUrl: "/videos/generating-tags.mp4",
      fallbackImageUrl: "/images/generating-tags.webp",
    },
  ];

  return (
    <section className="bg-popover py-16 shadow-cyan-300/10 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-full flex justify-center">
            <Image
              src={"/images/light.png"}
              width={100}
              height={100}
              alt="light"
              className="mr-4 dark:invert motion-preset-seesaw"
            />
          </div>
          <h3
            className={`${crimsonPro.className} text-4xl font-bold text-secondary`}
          >
            <span className="text-foreground text-bold">Unearth </span> Deeper
            Meaning
          </h3>
          <p className="text-lg max-w-2xl mx-auto mt-2">
            Transform your reading experience with AI that analyses your books,
            generates insights, and helps you discover new perspectives
          </p>
        </div>

        {/* Desktop View */}
        {isDesktop && (
          <div className="flex gap-8">
            <div className="w-1/2">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`p-6 mb-4 cursor-pointer border-2 rounded-2xl transition-all duration-200 ${
                    activeTab === feature.id
                      ? "bg-primary-lighter border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[4px_4px_0px_rgba(255,255,255,1)]"
                      : "bg-card border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:border-white dark:hover:shadow-[2px_2px_0px_rgba(255,255,255,1)]"
                  }`}
                  onClick={() => handleTabClick(feature.id)}
                >
                  <div className="flex items-center">
                    {feature.icon ? (
                      <feature.icon className="w-11 h-11 mr-4 text-secondary" />
                    ) : feature.image ? (
                      <Image
                        src={feature.image}
                        width={100}
                        height={100}
                        alt={feature.title}
                        className="h-14 w-14 mr-4 dark:invert"
                      />
                    ) : null}
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="mt-4 text-alternate font-semibold">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="w-1/2">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  ref={(el) => {
                    if (el) videoContainerRefs.current.set(feature.id, el);
                    else videoContainerRefs.current.delete(feature.id);
                  }}
                  data-feature-id={feature.id}
                  className={activeTab === feature.id ? "block" : "hidden"}
                >
                  {erroredVideos.has(feature.id) ||
                  !loadedVideos.includes(feature.id) ||
                  videoLoadError[feature.id] ? (
                    <Image
                      src={
                        feature.fallbackImageUrl || "/images/falling-books.webp"
                      }
                      alt={`${feature.title} fallback`}
                      layout="responsive"
                      width={16}
                      height={9}
                      className="rounded-2xl border-2"
                    />
                  ) : (
                    <video
                      ref={(el) => {
                        if (el && !erroredVideos.has(feature.id)) {
                          videoRefs.current.set(feature.id, el);
                          el.loop = true;
                          el.preload = "auto";

                          const handleError = () => {
                            console.log("Error event fired for:", feature.id);
                            handleVideoError(feature.id);
                          };

                          el.onerror = handleError;
                          el.addEventListener("error", handleError, {
                            once: true,
                          });

                          const source = el.querySelector("source");
                          if (source) {
                            source.onerror = handleError;
                          }
                        } else {
                          videoRefs.current.delete(feature.id);
                        }
                      }}
                      muted
                      playsInline
                      className="w-full h-full object-cover rounded-2xl border-2"
                    >
                      <source
                        src={feature.videoUrl}
                        type="video/mp4"
                        onError={(e) => {
                          console.log(
                            "Source error event fired for:",
                            feature.id
                          );
                          handleVideoError(feature.id);
                        }}
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile View */}
        {!isDesktop && (
          <div>
            {features.map((feature) => (
              <div
                key={feature.id}
                className="mb-8 bg-primary-lighter p-6 rounded-2xl"
                ref={(el) => {
                  if (el) videoContainerRefs.current.set(feature.id, el);
                  else videoContainerRefs.current.delete(feature.id);
                }}
                data-feature-id={feature.id}
              >
                <div className="flex items-center mb-4">
                  {feature.icon ? (
                    <feature.icon className="w-11 h-11 mr-4 text-secondary" />
                  ) : feature.image ? (
                    <Image
                      src={feature.image}
                      width={100}
                      height={100}
                      alt={feature.title}
                      className="h-14 w-14 mr-4 dark:invert"
                    />
                  ) : null}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="mb-4 text-alternate font-semibold">
                  {feature.description}
                </p>
                {erroredVideos.has(feature.id) ||
                !loadedVideos.includes(feature.id) ||
                videoLoadError[feature.id] ? (
                  <Image
                    src={
                      feature.fallbackImageUrl || "/images/falling-books.webp"
                    }
                    alt={`${feature.title} fallback`}
                    layout="responsive"
                    width={16}
                    height={9}
                    className="rounded-2xl border-2"
                  />
                ) : (
                  <video
                    ref={(el) => {
                      if (el && !erroredVideos.has(feature.id)) {
                        videoRefs.current.set(feature.id, el);
                        el.loop = true;
                        el.preload = "auto";

                        const handleError = () => {
                          console.log("Error event fired for:", feature.id);
                          handleVideoError(feature.id);
                        };

                        el.onerror = handleError;
                        el.addEventListener("error", handleError, {
                          once: true,
                        });

                        const source = el.querySelector("source");
                        if (source) {
                          source.onerror = handleError;
                        }
                      } else {
                        videoRefs.current.delete(feature.id);
                      }
                    }}
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl border-2"
                  >
                    <source
                      src={feature.videoUrl}
                      type="video/mp4"
                      onError={(e) => {
                        console.log(
                          "Source error event fired for:",
                          feature.id
                        );
                        handleVideoError(feature.id);
                      }}
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        )}

        <div>
          <div className="mt-12 w-full flex justify-center">
            <PromoBanner />
          </div>
        </div>
      </div>
    </section>
  );
};

const PromoBanner = () => (
  <div className="p-8 max-w-[750px]">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <div className="text-sm mb-2 flex items-center text-secondary">
          <Image
            src={"/images/box.png"}
            width={100}
            height={100}
            alt="box"
            className="w-12 h-12 mr-4 dark:invert motion-preset-pulse"
          />
          {/* Open Source */}
        </div>
        <h4 className={`${crimsonPro.className} text-3xl font-semibold mb-4`}>
          Built with transparency in mind
        </h4>
        <p className="mb-4">
          Everything is{" "}
          <span className="font-bold text-secondary">open source</span>,
          including the web app, browser extension, and Obsidian plugin. Feel
          free to inspect the code, run it yourself, or contribute to make it
          better.
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          When linking accounts, we never store or even see your Amazon login
          credentials. If you delete your account, we completely remove all your
          data without leaving any trace of you.
        </p>
        <Link
          href="https://github.com/Unearthed-App"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="brutalshimmer">
            <PackageOpen className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </Link>
      </div>
      <div className="md:w-1/2 flex items-center">
        <Image
          src="/images/open-book.webp"
          width={446}
          height={446}
          alt="Open Book"
          className="dark:invert"
        />
      </div>
    </div>
  </div>
);

export default FeatureSection;
