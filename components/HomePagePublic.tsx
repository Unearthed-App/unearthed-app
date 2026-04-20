"use client";

import { Crimson_Pro } from "next/font/google";
import { useTheme } from "next-themes";
import {
  Terminal,
  RefreshCw,
  PuzzleIcon,
  Sparkles,
  Rss,
  PlayCircle,
  Globe,
  Network,
  ShieldCheck,
  PlusCircle,
  Cloud,
  Monitor,
  BookOpen,
  Scan,
  PuzzleIcon as Puzzle,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800"],
});

const LIGHT = {
  bg: "#fff8f7",
  surface: "#fff8f7",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#fff0f1",
  surfaceContainer: "#f5cdd0",
  surfaceContainerHigh: "#f8e3e4",
  surfaceContainerHighest: "#f2dedf",
  onSurface: "#23191a",
  onSurfaceVariant: "#3d4947",
  primary: "#006a64",
  primaryContainer: "#2daca3",
  onPrimaryContainer: "#003a36",
  secondary: "#695b5c",
  secondaryContainer: "#f2dedf",
  onSecondaryContainer: "#6f6162",
  inverseSurface: "#392d2f",
  outline: "#6d7a78",
  outlineVariant: "#bcc9c7",
  cardBg: "rgba(255,255,255,0.5)",
  cardBgStrong: "rgba(255,255,255,0.6)",
  border: "rgba(26,26,26,0.12)",
  borderLight: "rgba(26,26,26,0.1)",
  borderSubtle: "rgba(26,26,26,0.08)",
  borderStrong: "rgba(26,26,26,0.15)",
  kindleBg: "#1a6fbf22",
  kindleBorder: "#1a6fbf",
  kindleColor: "#1a5fa8",
  obsidianBg: "#7c3aed22",
  obsidianBorder: "#7c3aed",
  obsidianColor: "#6d28d9",
  glowLocal: "0 0 80px -20px rgba(45,172,163,0.2)",
  glowOnline: "0 0 80px -20px rgba(242,222,223,0.8)",
  dashedOnline: "#c0505066",
  mobileScreenshot: "/mobile/mobile-home-light.webp",
  buttonText: "white",
  tagWhiteBg: "white",
  tagWhiteColor: "#006a64",
};

const DARK = {
  bg: "#180f10",
  surface: "#180f10",
  surfaceContainerLowest: "#0f0809",
  surfaceContainerLow: "#221315",
  surfaceContainer: "#2e1b1e",
  surfaceContainerHigh: "#382124",
  surfaceContainerHighest: "#40272a",
  onSurface: "#f0dfe0",
  onSurfaceVariant: "#bcc9c7",
  primary: "#4dd4cc",
  primaryContainer: "#2daca3",
  onPrimaryContainer: "#a0e8e4",
  secondary: "#c4a8a9",
  secondaryContainer: "#40272a",
  onSecondaryContainer: "#c4a8a9",
  inverseSurface: "#f0dfe0",
  outline: "#8a9896",
  outlineVariant: "#3d4947",
  cardBg: "rgba(255,255,255,0.05)",
  cardBgStrong: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.12)",
  borderLight: "rgba(255,255,255,0.08)",
  borderSubtle: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.15)",
  kindleBg: "#60a5fa22",
  kindleBorder: "#60a5fa",
  kindleColor: "#93c5fd",
  obsidianBg: "#a78bfa22",
  obsidianBorder: "#a78bfa",
  obsidianColor: "#c4b5fd",
  glowLocal: "0 0 80px -20px rgba(45,172,163,0.12)",
  glowOnline: "0 0 80px -20px rgba(45,172,163,0.08)",
  dashedOnline: "#c4a8a966",
  mobileScreenshot: "/mobile/mobile-home-dark.webp",
  buttonText: "#0f0809",
  tagWhiteBg: "#2e1b1e",
  tagWhiteColor: "#4dd4cc",
};

type Colors = typeof LIGHT;

function FeatureItem({
  icon,
  children,
  colors,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  colors: Colors;
}) {
  return (
    <li className="flex items-start gap-4">
      <span style={{ color: colors.primary, marginTop: "2px", flexShrink: 0 }}>
        {icon}
      </span>
      <span style={{ color: colors.onSurface, fontSize: "1.05rem" }}>{children}</span>
    </li>
  );
}

function SectionTag({
  children,
  variant = "primary",
  colors,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "white";
  colors: Colors;
}) {
  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "secondary"
      ? colors.secondaryContainer
      : colors.tagWhiteBg;
  const color =
    variant === "primary"
      ? colors.buttonText
      : variant === "secondary"
      ? colors.onSecondaryContainer
      : colors.tagWhiteColor;
  return (
    <div
      className="inline-block px-4 py-1 rounded-full font-bold text-xs tracking-widest uppercase mb-6"
      style={{ background: bg, color }}
    >
      {children}
    </div>
  );
}

export function HomePagePublic() {
  const { resolvedTheme } = useTheme();
  const C = resolvedTheme === "dark" ? DARK : LIGHT;

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: C.bg,
        color: C.onSurface,
        minHeight: "100vh",
      }}
    >
      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <h1
            className={`${crimsonPro.className} text-4xl md:text-6xl font-bold leading-tight mb-6`}
          >
            Ok so you&apos;re probably just here to get your{" "}
            <span
              style={{
                background: C.kindleBg,
                borderBottom: `3px solid ${C.kindleBorder}`,
                paddingBottom: "2px",
                paddingLeft: "4px",
                paddingRight: "4px",
                color: C.kindleColor,
              }}
            >
              Kindle Highlights
            </span>{" "}
            into{" "}
            <span
              style={{
                background: C.obsidianBg,
                borderBottom: `3px solid ${C.obsidianBorder}`,
                paddingBottom: "2px",
                paddingLeft: "4px",
                paddingRight: "4px",
                color: C.obsidianColor,
              }}
            >
              Obsidian
            </span>
          </h1>
          <div
            className={`${crimsonPro.className} text-3xl md:text-4xl font-bold italic mt-16`}
            style={{ color: C.primary }}
          >
            Unearthed provides 2 options...
          </div>
        </header>

        {/* ── Two Column ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-4">
          {/* ── OPTION 1: LOCAL ─────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <div
              className="pt-10 p-6 md:p-10 rounded-3xl relative overflow-hidden flex-1"
              style={{
                background: C.surfaceContainerLow,
                border: `4px solid ${C.border}`,
                boxShadow: C.glowLocal,
              }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Monitor size={96} />
              </div>
              <p
                className={`${crimsonPro.className} italic text-base absolute`}
                style={{
                  color: C.primary,
                  top: "0.7rem",
                  left: "1.2rem",
                  transform: "rotate(-1.5deg)",
                  transformOrigin: "left center",
                }}
              >
                the one I&apos;m most excited about
              </p>
              <SectionTag colors={C}>Option 1</SectionTag>
              <h2 className={`${crimsonPro.className} text-4xl font-bold mb-2`}>
                Unearthed{" "}
                <span
                  style={{
                    textDecoration: "underline",
                    textDecorationStyle: "wavy",
                    textDecorationColor: C.primaryContainer,
                    textDecorationThickness: "3px",
                    textUnderlineOffset: "6px",
                  }}
                >
                  Local
                </span>
              </h2>
              <p
                className={`${crimsonPro.className} text-xl mb-8`}
                style={{ color: C.onSurfaceVariant }}
              >
                — install it on your machine
              </p>
              <ul className="space-y-6">
                <FeatureItem colors={C} icon={<Terminal size={22} />}>
                  Runs on: MacOS, Windows, Linux
                </FeatureItem>
                <FeatureItem colors={C} icon={<RefreshCw size={22} />}>
                  Runs in the background pulling in Kindle Highlights
                </FeatureItem>
                <FeatureItem colors={C} icon={<PuzzleIcon size={22} />}>
                  You do not need another Obsidian plugin or anything else
                </FeatureItem>
                <FeatureItem colors={C} icon={<ShieldCheck size={22} />}>
                  No Amazon credentials required
                </FeatureItem>
              </ul>

              <div
                className="mt-10 p-6 rounded-2xl border-2 text-center"
                style={{
                  background: C.surfaceContainerHighest,
                  borderColor: `${C.primary}44`,
                }}
              >
                <span
                  className={`${crimsonPro.className} font-black text-3xl tracking-widest`}
                  style={{ color: C.primary }}
                >
                  DONE!
                </span>
              </div>

              {/* Extra features — inside the same card */}
              <div
                className="mt-10 pt-10"
                style={{ borderTop: `3px dashed ${C.primaryContainer}55` }}
              >
                <h3
                  className={`${crimsonPro.className} italic text-2xl font-bold mb-8`}
                >
                  Stick around for extra features that are included but are
                  optional...
                </h3>

                <div className="space-y-8">
                  {/* KOReader */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span style={{ color: C.primary }}>
                        <BookOpen size={22} />
                      </span>
                      <h4 className="font-bold text-lg">
                        KOReader sync as well
                      </h4>
                    </div>
                    <p
                      className="leading-relaxed mb-2"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      Get your KOReader highlights in the same place as your
                      Kindle ones. They all get merged nicely too. You&apos;ll
                      need this fella:
                    </p>
                    <Link
                      href="https://github.com/Unearthed-App/unearthed-koreader"
                      target="_blank"
                      className="text-sm underline break-all"
                      style={{ color: C.primary }}
                    >
                      github.com/Unearthed-App/unearthed-koreader
                    </Link>
                  </div>

                  {[
                    {
                      icon: <Sparkles size={22} />,
                      title: "Daily Reflections",
                      body: "Every day unearthed will show you a random quote for you to re-digest. This also gets added to your Obsidian Daily note.",
                    },
                    {
                      icon: <Rss size={22} />,
                      title: "RSS Feed",
                      body: "Pull in FULL articles even if the RSS feed restricts it. Articles can be treated as sources, just like Kindle Books. Highlight them in the app and send them to obsidian (in full if you want).",
                    },
                    {
                      icon: <PlayCircle size={22} />,
                      title: "Youtube",
                      body: "Subscribe to youtube channels like an RSS feed. Pull in individual Youtube videos. Get their transcripts with just a click. Youtube videos are treated the same as RSS articles, you can highlight etc.",
                    },
                    {
                      icon: <Globe size={22} />,
                      title: "Webpages",
                      body: "Save entire webpages as an article that you can highlight and comment on.",
                    },
                  ].map(({ icon, title, body }) => (
                    <div key={title}>
                      <div className="flex items-center gap-3 mb-2">
                        <span style={{ color: C.primary }}>{icon}</span>
                        <h4 className="font-bold text-lg">{title}</h4>
                      </div>
                      <p
                        className="leading-relaxed"
                        style={{ color: C.onSurfaceVariant }}
                      >
                        {body}
                      </p>
                    </div>
                  ))}

                  {/* Local screenshot */}
                  <div
                    className="rounded-2xl overflow-hidden shadow-lg"
                    style={{ border: `4px solid ${C.border}` }}
                  >
                    <Image
                      src="/mockups/local_light.webp"
                      alt="Unearthed Local app screenshot"
                      width={900}
                      height={560}
                      className="w-full h-auto"
                      priority
                    />
                  </div>

                  <div
                    className="pt-6"
                    style={{ borderTop: `2px solid ${C.secondaryContainer}` }}
                  >
                    <p className="font-bold mb-2" style={{ color: C.primary }}>
                      Don&apos;t forget, this all gets sent to Obsidian too
                    </p>
                    <p className={`${crimsonPro.className} italic text-lg`}>
                      I love this because all the highlights from every source
                      that I consume is now in one spot.
                    </p>
                  </div>
                  <Link
                    href="/local"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-95 active:scale-90 shadow-md mt-2"
                    style={{ background: C.primary, color: C.buttonText }}
                  >
                    Unearthed Local →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── OPTION B: ONLINE ────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <div
              className="p-6 md:p-10 rounded-3xl relative overflow-hidden flex-1"
              style={{
                background: C.surfaceContainer,
                border: `4px solid ${C.borderLight}`,
                boxShadow: C.glowOnline,
              }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Cloud size={96} />
              </div>
              <SectionTag variant="secondary" colors={C}>
                Option B
              </SectionTag>
              <h2 className={`${crimsonPro.className} text-4xl font-bold mb-8`}>
                Unearthed{" "}
                <span
                  style={{
                    textDecoration: "underline",
                    textDecorationStyle: "wavy",
                    textDecorationColor: C.onSecondaryContainer,
                    textDecorationThickness: "3px",
                    textUnderlineOffset: "6px",
                  }}
                >
                  Online
                </span>
              </h2>
              <ul className="space-y-6">
                <FeatureItem colors={C} icon={<Globe size={22} />}>
                  Sign up at unearthed.app
                </FeatureItem>
                <FeatureItem colors={C} icon={<Puzzle size={22} />}>
                  <div>
                    <p>
                      Install the browser extension — it pulls your Kindle
                      highlights
                    </p>
                    <Link
                      href="https://github.com/Unearthed-App/unearthed-web-extension"
                      className="text-sm underline break-all"
                      style={{ color: C.primary }}
                      target="_blank"
                    >
                      github.com/Unearthed-App/unearthed-web-extension
                    </Link>
                  </div>
                </FeatureItem>
                <FeatureItem colors={C} icon={<Network size={22} />}>
                  <div>
                    <p>Install the Obsidian plugin to sync highlights across</p>
                    <Link
                      href="https://github.com/Unearthed-App/unearthed-obsidian"
                      className="text-sm underline break-all"
                      style={{ color: C.primary }}
                      target="_blank"
                    >
                      github.com/Unearthed-App/unearthed-obsidian
                    </Link>
                  </div>
                </FeatureItem>
                <FeatureItem colors={C} icon={<ShieldCheck size={22} />}>
                  No Amazon credentials required
                </FeatureItem>
              </ul>

              {/* DONE badge */}
              <div
                className="mt-10 p-6 rounded-2xl border-2 text-center"
                style={{
                  background: C.surfaceContainerHighest,
                  borderColor: `${C.onSecondaryContainer}44`,
                }}
              >
                <span
                  className={`${crimsonPro.className} font-black text-3xl tracking-widest`}
                  style={{ color: C.secondary }}
                >
                  DONE!
                </span>
              </div>

              <div
                className="mt-10 pt-10"
                style={{ borderTop: `3px dashed ${C.dashedOnline}` }}
              >
                <h3 className="font-bold text-xl mb-8 flex items-center gap-2">
                  <PlusCircle size={22} />
                  Extra Features:
                </h3>
                <div className="space-y-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span style={{ color: C.primary }}>
                        <BookOpen size={22} />
                      </span>
                      <h4 className="font-bold text-lg">
                        KOReader sync as well
                      </h4>
                    </div>
                    <p
                      className="leading-relaxed mb-3"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      Get your KOReader highlights in the same place as your
                      Kindle ones. They all get merged nicely too. You&apos;ll
                      need this fella
                    </p>
                    <Link
                      href="https://github.com/Unearthed-App/unearthed-koreader"
                      className="text-sm underline break-all"
                      style={{ color: C.primary }}
                      target="_blank"
                    >
                      https://github.com/Unearthed-App/unearthed-koreader
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span style={{ color: C.primary }}>
                        <Sparkles size={22} />
                      </span>
                      <h4 className="font-bold text-lg">Daily Reflections</h4>
                    </div>
                    <p
                      className="leading-relaxed"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      Every day unearthed will show you a random quote for you
                      to re-digest. This also gets added to your Obsidian Daily
                      note.
                    </p>
                  </div>

                  <div
                    className="p-6 rounded-2xl"
                    style={{ background: C.cardBg }}
                  >
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                      AI{" "}
                      <span className="text-sm font-normal italic opacity-60">
                        — I know 😫 but it&apos;s optional (opt in).
                      </span>
                    </h4>
                    <p
                      className="leading-relaxed"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      The intent behind this was to help with question prompting
                      and blind spot detection in my reading. I did not intend
                      for it to replace my brain.{" "}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { title: "Tags", body: "You can inline tag" },
                      {
                        title: "Graph view",
                        body: "See connections between books",
                      },
                    ].map(({ title, body }) => (
                      <div
                        key={title}
                        className="p-6 rounded-2xl"
                        style={{ background: C.cardBg }}
                      >
                        <h4 className="font-bold text-lg mb-2">{title}</h4>
                        <p
                          className="text-sm"
                          style={{ color: C.onSurfaceVariant }}
                        >
                          {body}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Blind spot video */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <PlayCircle size={20} style={{ color: C.primary }} />
                      Blind Spot Detection
                    </h4>
                    <div
                      className="rounded-2xl overflow-hidden border-4 shadow-md"
                      style={{ borderColor: C.border }}
                    >
                      <video
                        src="/videos/blind-spot.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto"
                      />
                    </div>
                  </div>

                  {/* Transparency */}
                  <div
                    className="p-6 rounded-2xl"
                    style={{ background: C.cardBg }}
                  >
                    <h4 className="font-bold text-lg mb-3">
                      Built with transparency in mind
                    </h4>
                    <p
                      className="leading-relaxed text-sm mb-4"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      Everything is <strong>open source</strong>, including the
                      web app, browser extension, and Obsidian plugin. Feel free
                      to inspect the code, run it yourself, or contribute to
                      make it better.
                    </p>
                    <p
                      className="leading-relaxed text-sm mb-4"
                      style={{ color: C.onSurfaceVariant }}
                    >
                      When linking accounts, Amazon login credentials are never
                      stored or even seen. If you delete your account, it is
                      gone.
                    </p>
                    <Link
                      href="https://github.com/Unearthed-App"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-opacity hover:opacity-80"
                      style={{ background: C.onSurface, color: C.bg }}
                    >
                      View on GitHub
                    </Link>
                  </div>

                  {/* Sync to these apps */}
                  <div
                    className="p-6 rounded-2xl"
                    style={{ background: C.cardBg }}
                  >
                    <p
                      className="text-xs font-bold tracking-widest uppercase text-center mb-6 flex items-center justify-center gap-2"
                      style={{ color: C.primaryContainer }}
                    >
                      <span>✦</span> Sync to these apps <span>✦</span>
                    </p>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        {
                          src: "/notion-logo-no-background.png",
                          label: "Notion",
                        },
                        { src: "/obsidian.svg", label: "Obsidian" },
                        { src: "/supernotes.png", label: "Supernotes" },
                        { src: "/capacities-logo.png", label: "Capacities" },
                      ].map(({ src, label }) => (
                        <div
                          key={label}
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center p-2 shadow-sm"
                            style={{
                              background: C.surfaceContainerLowest,
                              border: `2px solid ${C.borderSubtle}`,
                            }}
                          >
                            <Image
                              src={src}
                              alt={label}
                              width={40}
                              height={40}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span
                            className="text-xs font-medium"
                            style={{ color: C.onSurfaceVariant }}
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/online"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-95 active:scale-90 shadow-md mt-2"
                    style={{ background: C.secondary, color: C.buttonText }}
                  >
                    Unearthed Online →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Local → Mobile connector ─────────────────────────────── */}
        <div className="flex items-center justify-center py-4">
          <div
            className="flex items-center gap-3 px-5 py-2.5 rounded-full text-sm tracking-wide border"
            style={{
              color: C.primary,
              borderColor: `${C.primaryContainer}80`,
              background: `${C.primaryContainer}18`,
            }}
          >
            <span>
              <strong>Unearthed Local</strong> pairs with{" "}
              <strong>Unearthed Mobile</strong>
            </span>
          </div>
        </div>

        {/* ── Mobile Section ───────────────────────────────────────────── */}
        <section className="mt-4 max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-6 md:p-12 lg:p-20 relative overflow-hidden"
            style={{
              background: C.surfaceContainerLow,
              border: `4px solid ${C.borderLight}`,
            }}
          >
            <div
              className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl"
              style={{ background: `${C.primary}0d` }}
            />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* text */}
              <div className="order-2 md:order-1">
                <SectionTag variant="white" colors={C}>
                  highlights in your pocket
                </SectionTag>
                <h2
                  className={`${crimsonPro.className} text-5xl font-bold mb-4`}
                >
                  Unearthed Mobile
                </h2>
                <p
                  className={`${crimsonPro.className} italic text-2xl mb-8`}
                  style={{ color: C.primary }}
                >
                  I use this the most
                </p>
                <div
                  className="space-y-6 text-lg"
                  style={{ color: C.onSurfaceVariant }}
                >
                  <p>
                    A companion app that let&apos;s you quickly capture quotes
                    from physical books, allowing them to join the rest of your
                    library.
                  </p>
                  <p>
                    It does nearly everything Unearthed Local does, but lives on
                    your phone (Android &amp; iOS).
                  </p>
                  <p>
                    Mainly relies on Unearthed Local for Kindle and KOReader
                    highlights.
                  </p>
                </div>

                {/* OCR feature callout */}
                <div
                  className="mt-8 p-6 rounded-2xl"
                  style={{
                    background: `${C.primary}12`,
                    border: `2px solid ${C.primary}30`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span style={{ color: C.primary }}>
                      <Scan size={22} />
                    </span>
                    <h4
                      className="font-bold text-lg"
                      style={{ color: C.onSurface }}
                    >
                      OCR : for physical books
                    </h4>
                  </div>
                  <p
                    className="leading-relaxed"
                    style={{ color: C.onSurfaceVariant }}
                  >
                    Point your camera at any page and select the text you want
                    to capture. Quotes from physical books land in the same
                    place as everything else.
                  </p>
                  <p
                    className={`${crimsonPro.className} italic text-lg mt-4`}
                    style={{ color: C.primary }}
                  >
                    This was a big motivation for me to create the mobile app
                  </p>
                </div>
                <Link
                  href="/mobile"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-95 active:scale-90 shadow-md mt-6"
                  style={{ background: C.primary, color: C.buttonText }}
                >
                  Unearthed Mobile →
                </Link>
              </div>

              {/* Mobile screenshot */}
              <div className="order-1 md:order-2 flex justify-center">
                <div
                  className="rounded-[2.5rem] overflow-hidden shadow-2xl"
                  style={{
                    border: `4px solid ${C.borderStrong}`,
                    maxWidth: "260px",
                  }}
                >
                  <Image
                    src={C.mobileScreenshot}
                    alt="Unearthed Mobile app screenshot"
                    width={390}
                    height={844}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* How does it do it */}
            <div
              className="mt-20 pt-12"
              style={{ borderTop: `2px solid ${C.secondaryContainer}` }}
            >
              <h3 className={`${crimsonPro.className} text-3xl font-bold mb-8`}>
                How does it do it?
              </h3>
              <p
                className="text-xl leading-relaxed mb-10 max-w-3xl"
                style={{ color: C.onSurface }}
              >
                It is a PWA that talks to Unearthed Local over your wifi. Grabs
                everything that Unearthed Local has and adds to it. E.g. you can
                manage your RSS feeds on mobile. It also maintains a database on
                the phone itself so that it is accessible offline and you
                don&apos;t fully rely on your computer.
              </p>
              <div
                className="p-6 md:p-10 rounded-2xl"
                style={{ background: C.cardBgStrong }}
              >
                <p className={`${crimsonPro.className} italic text-2xl mb-6`}>
                  &ldquo;The initial motivation for this was to have my daily
                  reflection with me, capture physical book content quickly, and
                  have my complete highlighting history on me.&rdquo;
                </p>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: C.onSurfaceVariant }}
                >
                  I like this because my pocket contains every quote that
                  I&apos;ve ever thought was worth saving, ready to share with
                  someone. If I need to quickly remember something from a past
                  book, I can find it instantly, ready for whatever conversation
                  that I&apos;m in. The Daily reflection is also most useful to
                  me in my pocket too.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
