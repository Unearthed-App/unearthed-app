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
import { useState } from "react";
import { PackageOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Crimson_Pro } from "next/font/google";
import { Button } from "./ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DemoVideo } from "@/components/DemoVideo";

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

const FeatureSection = ({
  promoButtonClassName,
}: {
  promoButtonClassName?: string;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activeTab, setActiveTab] = useState("contrary");
  const features: Feature[] = [
    {
      id: "contrary",
      title: "Blind Spot Detection",
      image: "/images/eye.png",
      description:
        "Ask AI to suggest topics or viewpoints that are missing from your reading library.",
      videoUrl: "/videos/blind-spot.mp4",
      fallbackImageUrl: "/images/blind-spot.webp",
    },
    {
      id: "reflectionquestions",
      title: "Generate Reflection Questions",
      image: "/images/question.png",
      description:
        "Generate questions about a book. Write an answer to get AI feedback and another interpretation to consider.",
      videoUrl: "/videos/question.mp4",
      fallbackImageUrl: "/images/question.webp",
    },
    {
      id: "analysis",
      title: "Book Analysis",
      image: "/images/microscope.png",
      description:
        "Generate a book summary, themes and key points to review alongside your highlights.",
      videoUrl: "/videos/deep.mp4",
      fallbackImageUrl: "/images/deep.webp",
    },
    {
      id: "similar",
      title: "Book Recommendations",
      image: "/images/hat.png",
      description:
        "Get book suggestions based on your library, including similar books and books with opposing viewpoints.",
      videoUrl: "/videos/similar-contrasting.mp4",
      fallbackImageUrl: "/images/similar-contrasting.webp",
    },
    {
      id: "autoextract",
      title: "Auto Extract Key Ideas",
      image: "/images/sparkles.png",
      description:
        "Generate a draft list of ideas from your highlights, then edit it in your own words.",
      videoUrl: "/videos/generating-tags.mp4",
      fallbackImageUrl: "/images/generating-tags.webp",
    },
  ];
  const activeFeature =
    features.find((feature) => feature.id === activeTab) ?? features[0];

  return (
    <section className="bg-popover py-16 shadow-cyan-300/10 shadow-xl">
      <div className="container mx-auto px-4">
        <div>
          <div className="mt-12 w-full flex justify-center">
            <PromoBanner buttonClassName={promoButtonClassName} />
          </div>
        </div>
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
            Optional AI tools for your reading
          </h3>
          <p className="text-lg max-w-2xl mx-auto mt-2">
            Generate summaries, questions and book suggestions when you want
            them. These tools are optional.
          </p>
        </div>

        {/* Desktop View */}
        {isDesktop && (
          <div className="flex gap-8">
            <div className="w-1/2">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  type="button"
                  aria-label={`Show ${feature.title} demo`}
                  aria-pressed={activeTab === feature.id}
                  className={`w-full p-6 mb-4 cursor-pointer border-2 rounded-2xl text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                    activeTab === feature.id
                      ? "bg-primary-lighter border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[4px_4px_0px_rgba(255,255,255,1)]"
                      : "bg-card border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:border-white dark:hover:shadow-[2px_2px_0px_rgba(255,255,255,1)]"
                  }`}
                  onClick={() => setActiveTab(feature.id)}
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
                </button>
              ))}
            </div>

            <div className="w-1/2">
              <DemoVideo
                key={activeFeature.id}
                src={activeFeature.videoUrl}
                poster={
                  activeFeature.fallbackImageUrl || "/images/falling-books.webp"
                }
                title={activeFeature.title}
                className="border-2"
              />
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
                <DemoVideo
                  src={feature.videoUrl}
                  poster={
                    feature.fallbackImageUrl || "/images/falling-books.webp"
                  }
                  title={feature.title}
                  className="border-2"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const PromoBanner = ({ buttonClassName }: { buttonClassName?: string }) => (
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
          Read the source code
        </h4>
        <p className="mb-4">
          Unearthed Online is{" "}
          <span className="font-bold text-secondary">open source</span>,
          including the web app, browser extension, Obsidian plugin and KOReader
          plugin. Feel free to inspect the code, run it yourself, or contribute
          to make it better.
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          Kindle imports use your signed in Amazon browser session. You do not
          give your Amazon password to Unearthed Online.
        </p>
        <Link
          href="https://github.com/Unearthed-App"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="brutalshimmer" className={buttonClassName}>
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
