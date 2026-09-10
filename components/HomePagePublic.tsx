"use client";
import Link from "next/link";
import { CompatibilityChecker } from "@/components/marketing/CompatibilityChecker";
import { Crimson_Pro } from "next/font/google";
import {
  ArrowRight,
  BookOpen,
  Check,
  Cloud,
  FileText,
  Github,
  KeyRound,
  Laptop,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SunMedium,
  UploadCloud,
} from "lucide-react";
const serif = Crimson_Pro({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});
const features = [
  [
    "DAILY REFLECTIONS",
    "One idea, every day.",
    "Open Unearthed to a highlight you once thought was worth saving. Add a note or send it to your daily note—so useful ideas become part of how you think.",
    SunMedium,
  ],
  [
    "GLOBAL SEARCH",
    "Find any idea in seconds.",
    "Search across books, authors, highlights, notes, tags, articles and saved sources—even when you cannot remember where an idea came from.",
    Search,
  ],
  [
    "AUTOMATIC SYNC",
    "Your reading, where you work.",
    "Bring in highlights from Kindle and KOReader, then keep your library moving to Obsidian, Notion, Capacities, Supernotes and more.",
    UploadCloud,
  ],
];
const plans = [
  [
    "Local",
    "One-time purchase",
    "Maximum privacy and desktop ownership",
    "macOS, Windows & Linux",
    Laptop,
    "/local",
  ],
  [
    "Online",
    "$5 / month",
    "The simplest setup, available anywhere",
    "Web app",
    Cloud,
    FileText,
    "/online",
  ],
  [
    "Mobile",
    "One-time purchase",
    "Your library and book capture in your pocket",
    "Android & iOS PWA",
    Smartphone,
    "/mobile",
  ],
];
function SearchCard() {
  return (
    <div className="rounded-xl border-[3px] border-[#1d2926] dark:border-[#9edbd1] bg-[#fffdf8] dark:bg-[#18231f] p-4 shadow-[8px_8px_0_#1d2926] dark:shadow-[8px_8px_0_#075f58]">
      <div className="mb-4 flex text-[9px] text-stone-400 dark:text-stone-400">
        ●　●　● <span className="mx-auto">Search everything</span>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-[#075f5850] bg-[#f7faf7] dark:bg-[#121d1a] p-3 text-[#075f58] dark:text-[#67d7c9]">
        <Search size={18} />
        <b>attention</b>
        <kbd className="ml-auto text-[10px]">⌘ K</kbd>
      </div>
      <p className="my-4 text-[9px] tracking-[.16em] text-stone-400 dark:text-stone-400">
        12 IDEAS FOUND ACROSS YOUR LIBRARY
      </p>
      {[
        [
          "BOOK",
          "Stolen Focus",
          "Our attention did not collapse. It was stolen.",
        ],
        [
          "ARTICLE",
          "The Shape of Attention",
          "Protecting attention is a form of choosing a life.",
        ],
        ["NOTE", "Deep work", "Attention is the beginning of devotion."],
      ].map((x) => (
        <div
          className="flex gap-3 border-t border-stone-200 dark:border-stone-700 py-3"
          key={x[1]}
        >
          <span className="h-fit rounded bg-teal-50 dark:bg-[#173b34] px-2 py-1 text-[8px] text-[#075f58] dark:text-[#67d7c9]">
            {x[0]}
          </span>
          <div>
            <b className="text-xs">{x[1]}</b>
            <p className="font-serif text-xs text-stone-600 dark:text-stone-300">
              {x[2]}
            </p>
            <small className="text-[9px] text-stone-400 dark:text-stone-400">
              Saved with source context
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
export function HomePagePublic() {
  return (
    <div className="overflow-hidden bg-[#f8f3e9] text-[#1d2926] dark:bg-[#101815] dark:text-[#f3ece2]">
      <section className="relative min-h-[780px] bg-[radial-gradient(circle_at_78%_30%,#d4e9df_0,transparent_32%),linear-gradient(115deg,#fffaf1,#f3ede2)] dark:bg-[radial-gradient(circle_at_78%_30%,#16443a_0,transparent_34%),linear-gradient(115deg,#14211d,#0d1512)] px-5 pb-24 pt-40">
        <div className="mx-auto grid max-w-[1180px] items-center gap-16 lg:grid-cols-[5fr_7fr]">
          <div>
            <p className="text-xs font-bold tracking-[.19em] text-[#075f58] dark:text-[#67d7c9]">
              — READING HIGHLIGHTS, REMEMBERED
            </p>
            <h1
              className={
                serif.className +
                " my-6 text-6xl font-semibold leading-[.92] tracking-[-.04em] sm:text-7xl"
              }
            >
              Remember more of{" "}
              <em className="text-[#075f58] dark:text-[#67d7c9]">
                what you read.
              </em>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-stone-600 dark:text-stone-300">
              Unearthed brings highlights from Kindle, KOReader, articles,
              YouTube and physical books into one searchable library. Revisit a
              meaningful idea every day and sync everything to the tools you
              already use.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#choose-your-setup"
                className="flex items-center justify-center gap-3 rounded-lg border-[3px] border-[#1d2926] dark:border-[#9edbd1] bg-[#25b1a6] px-6 py-4 text-sm font-black text-[#102521] shadow-[5px_5px_0_#1d2926] dark:shadow-[5px_5px_0_#075f58] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Get Unearthed <ArrowRight size={17} />
              </a>
              <a
                href="#features"
                className="rounded-lg border-[3px] border-[#1d2926] dark:border-[#9edbd1] bg-[#fffdf8] dark:bg-[#18231f] px-6 py-4 text-center text-sm font-black shadow-[5px_5px_0_#1d2926] dark:shadow-[5px_5px_0_#075f58] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                See how it works
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-4 text-[11px] text-stone-500 dark:text-stone-400">
              <span>Open source</span>
              <span>Privacy first</span>
              <span>No Amazon credentials stored</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-5 -top-12 z-10 w-56 rounded-2xl border border-[#d07b6560] bg-[#f7dcd3] dark:border-[#e77962] dark:bg-[#39251f] p-5 shadow-xl">
              <small className="tracking-widest">TODAY'S REFLECTION</small>
              <p className="my-3 font-serif text-lg">
                “What we remember changes what we become.”
              </p>
              <span className="text-[10px]">
                The Art of Stillness · Pico Iyer
              </span>
            </div>
            <SearchCard />
            <div className="absolute -bottom-9 right-0 rounded-xl bg-[#075f58] px-5 py-4 text-xs font-bold text-white shadow-xl">
              ●　All caught up
              <br />
              <small className="font-normal text-teal-100">
                Obsidian · Notion · Capacities
              </small>
            </div>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="reading-flow-title"
        className="border-y border-[#1d2926]/15 bg-[#fffdf8] px-5 py-16 dark:border-[#9edbd1]/20 dark:bg-[#18231f]"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10 grid items-end gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] font-bold tracking-[.2em] text-[#dc755f]">
                ONE LIBRARY · EVERYWHERE YOU READ AND WRITE
              </p>
              <h2
                id="reading-flow-title"
                className={
                  serif.className +
                  " mt-2 text-4xl font-semibold leading-none text-[#1d2926] dark:text-[#f3ece2] md:text-5xl"
                }
              >
                From scattered highlights to{" "}
                <em className="text-[#075f58] dark:text-[#67d7c9]">
                  useful ideas.
                </em>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-stone-500 dark:text-stone-400">
              Unearthed connects the places you read with the places you think.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#1d2926]/15 bg-[#f8f3e9] p-6 shadow-[0_20px_60px_-40px_rgba(29,41,38,.55)] dark:border-[#9edbd1]/20 dark:bg-[#111b18] md:p-10">
            <div className="absolute inset-x-16 top-1/2 hidden border-t border-dashed border-[#075f58]/35 md:block" />

            <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto_220px_auto_1fr]">
              <div>
                <p className="mb-4 flex items-center gap-2 text-[9px] font-bold tracking-[.18em] text-stone-500 dark:text-stone-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fff0d5] text-[9px] text-[#1d2926] dark:bg-[#30291c] dark:text-[#f3ece2]">
                    1
                  </span>
                  READ & CAPTURE
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["Kindle", "KOReader", "Articles", "YouTube"].map(
                    (source) => (
                      <span
                        className="rounded-lg border border-[#1d2926]/15 bg-white/70 px-3 py-3 text-center text-xs font-semibold text-[#1d2926] shadow-sm backdrop-blur dark:border-[#9edbd1]/15 dark:bg-[#1b2925] dark:text-[#f3ece2]"
                        key={source}
                      >
                        {source}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#075f58]/25 bg-white text-[#075f58] shadow-sm dark:bg-[#18231f] dark:text-[#67d7c9]">
                  <ArrowRight
                    aria-hidden="true"
                    className="rotate-90 md:rotate-0"
                    size={17}
                    strokeWidth={2}
                  />
                </span>
              </div>

              <div className="relative rounded-2xl bg-[#075f58] px-6 py-7 text-center text-white shadow-[0_16px_35px_-20px_#075f58] ring-1 ring-white/10">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/12">
                  <Sparkles size={19} />
                </div>
                <b
                  className={serif.className + " block text-3xl font-semibold"}
                >
                  Unearthed
                </b>
                <p className="mt-2 text-[9px] font-bold tracking-[.16em] text-teal-100">
                  SEARCH · REVISIT · SYNC
                </p>
              </div>

              <div className="flex justify-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#075f58]/25 bg-white text-[#075f58] shadow-sm dark:bg-[#18231f] dark:text-[#67d7c9]">
                  <ArrowRight
                    aria-hidden="true"
                    className="rotate-90 md:rotate-0"
                    size={17}
                    strokeWidth={2}
                  />
                </span>
              </div>

              <div>
                <p className="mb-4 flex items-center gap-2 text-[9px] font-bold tracking-[.18em] text-stone-500 dark:text-stone-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f8ded6] text-[9px] text-[#1d2926] dark:bg-[#35231f] dark:text-[#f3ece2]">
                    2
                  </span>
                  THINK & CREATE
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["Obsidian", "Notion", "Capacities", "Craft"].map(
                    (destination) => (
                      <span
                        className="rounded-lg border border-[#1d2926]/15 bg-white/70 px-3 py-3 text-center text-xs font-semibold text-[#1d2926] shadow-sm backdrop-blur dark:border-[#9edbd1]/15 dark:bg-[#1b2925] dark:text-[#f3ece2]"
                        key={destination}
                      >
                        {destination}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      <main id="features" className="mx-auto max-w-[1180px] px-5 py-28">
        <header className="mx-auto mb-24 max-w-3xl text-center">
          <p className="text-xs tracking-[.2em] text-[#075f58] dark:text-[#67d7c9]">
            BUILT FOR REMEMBERING
          </p>
          <h2
            className={
              serif.className +
              " mt-5 text-5xl font-semibold leading-none sm:text-6xl"
            }
          >
            Your highlights deserve a life{" "}
            <em className="text-[#075f58] dark:text-[#67d7c9]">
              beyond the last page.
            </em>
          </h2>
        </header>
        {features.map(([tag, title, text, Icon]: any, i) => (
          <section
            className="mb-32 grid items-center gap-14 lg:grid-cols-2"
            key={title}
          >
            <div className={i % 2 ? "lg:order-2" : ""}>
              <Icon className="mb-6 text-[#dc755f]" size={42} />
              <p className="text-xs font-bold tracking-[.18em] text-[#075f58] dark:text-[#67d7c9]">
                {tag}
              </p>
              <h3 className={serif.className + " my-4 text-5xl font-semibold"}>
                {title}
              </h3>
              <p className="max-w-lg leading-7 text-stone-600 dark:text-stone-300">
                {text}
              </p>
              <ul className="my-6 space-y-3 text-sm">
                {[
                  "Everything stays attached to its source",
                  "Designed for your real reading workflow",
                  "Private, portable and fast",
                ].map((p) => (
                  <li className="flex gap-2" key={p}>
                    <Check
                      size={18}
                      className="text-[#075f58] dark:text-[#67d7c9]"
                    />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/local-docs/features"
                className="inline-flex items-center gap-2 border-b border-teal-700 dark:border-[#5ed0c2] text-sm font-bold text-[#075f58] dark:text-[#67d7c9]"
              >
                Explore this feature <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rounded-xl border-[3px] border-[#1d2926] dark:border-[#9edbd1] bg-[#bfe6df] dark:bg-[#173b34] p-4 shadow-[10px_10px_0_#1d2926] dark:shadow-[10px_10px_0_#075f58] sm:p-10">
              {i === 0 ? (
                <div className="rounded-lg border-[3px] border-[#1d2926] dark:border-[#9edbd1] bg-[#fffdf8] dark:bg-[#18231f] p-8 shadow-[6px_6px_0_#e77962] dark:shadow-[6px_6px_0_#e77962]">
                  <Sparkles className="text-[#dc755f]" />
                  <blockquote className="my-6 font-serif text-3xl">
                    “The things you think about determine the quality of your
                    mind.”
                  </blockquote>
                  <p>
                    — Marcus Aurelius, <i>Meditations</i>
                  </p>
                  <div className="mt-8 border-l-2 border-[#dc755f] bg-[#f6efe3] dark:bg-[#28271f] p-4 font-serif italic">
                    What does this change about today?
                  </div>
                </div>
              ) : i === 1 ? (
                <SearchCard />
              ) : (
                <div className="rounded-lg border-[3px] border-[#1d2926] dark:border-[#9edbd1] bg-[#fffdf8] dark:bg-[#18231f] p-5 shadow-[6px_6px_0_#e77962] dark:shadow-[6px_6px_0_#e77962] sm:p-7">
                  <div className="flex items-center justify-between border-b-[3px] border-[#1d2926] dark:border-[#9edbd1] pb-4">
                    <div>
                      <p className="text-[9px] font-black tracking-[.18em] text-stone-400 dark:text-stone-400">
                        LIVE SYNC ACTIVITY
                      </p>
                      <b className={serif.className + " text-2xl"}>
                        Your library is up to date
                      </b>
                    </div>
                    <span className="flex items-center gap-2 rounded-full border-2 border-[#1d2926] dark:border-[#9edbd1] bg-[#bfe6df] dark:bg-[#173b34] px-3 py-1 text-[9px] font-black">
                      <i className="h-2 w-2 rounded-full bg-[#075f58]" />
                      LIVE
                    </span>
                  </div>
                  <div className="relative my-5 space-y-3 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-[3px] before:bg-[#1d2926] dark:before:bg-[#9edbd1]">
                    {[
                      [
                        BookOpen,
                        "Imported from Kindle",
                        "246 highlights",
                        "#fff0d5",
                      ],
                      [
                        UploadCloud,
                        "Organised in Unearthed",
                        "Notes & locations kept",
                        "#bfe6df",
                      ],
                      [
                        FileText,
                        "Delivered to Obsidian",
                        "Vault updated",
                        "#f8ded6",
                      ],
                    ].map(([Icon, title, detail, color]: any) => (
                      <div
                        className="relative flex items-center gap-4 rounded-lg border-2 border-[#1d2926] dark:border-[#9edbd1] bg-white p-3 dark:bg-[#111b18]"
                        key={title}
                      >
                        <span
                          className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-[#1d2926] dark:border-[#9edbd1]"
                          style={{ backgroundColor: color }}
                        >
                          <Icon size={18} strokeWidth={2.5} />
                        </span>
                        <div className="min-w-0">
                          <b className="block text-sm">{title}</b>
                          <small className="text-stone-500 dark:text-stone-400">
                            {detail}
                          </small>
                        </div>
                        <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#075f58] text-white">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-md bg-[#1d2926] px-4 py-3 text-white">
                    <span className="text-xs font-bold">
                      Next sync runs automatically
                    </span>
                    <small className="text-right text-[#9edbd1]">
                      No manual export needed
                    </small>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </main>
      <section className="bg-[#075f58] px-5 py-24 text-white">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-xs tracking-[.2em] text-teal-200">A SIMPLE LOOP</p>
          <h2
            className={
              serif.className + " my-6 max-w-2xl text-6xl leading-none"
            }
          >
            From saved highlight to{" "}
            <em className="text-[#f3aa96]">useful idea.</em>
          </h2>
          <div className="mt-16 grid border-t border-white/20 md:grid-cols-3">
            {[
              ["01", "Bring it in"],
              ["02", "Find it"],
              ["03", "Use it again"],
            ].map((x) => (
              <article
                className="border-b border-white/20 py-8 md:border-b-0 md:border-r md:pr-10"
                key={x[0]}
              >
                <small className="text-[#f3aa96]">{x[0]}</small>
                <h3 className={serif.className + " my-4 text-3xl"}>{x[1]}</h3>
                <p className="text-sm leading-6 text-teal-100">
                  Move from a saved passage to a searchable, useful part of the
                  way you think.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="choose-your-setup"
        className="mx-auto max-w-[1180px] px-5 py-28"
        tabIndex={-1}
      >
        <header className="mx-auto mb-20 max-w-3xl text-center">
          <p className="text-xs tracking-[.2em] text-[#075f58] dark:text-[#67d7c9]">
            CHOOSE YOUR SETUP
          </p>
          <h2 className={serif.className + " my-5 text-6xl"}>
            The same goal.{" "}
            <em className="text-[#075f58] dark:text-[#67d7c9]">Your way.</em>
          </h2>
          <p className="text-stone-500 dark:text-stone-400">
            Pick the balance of privacy, convenience and mobile access that
            feels right for you.
          </p>
          <div className="mt-7">
            <CompatibilityChecker
              product="online"
              triggerLabel="Check which Unearthed version fits your setup"
            />
          </div>
        </header>
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map(([name, price, best, runs, Icon, href]: any, i) => (
            <article
              className={
                "relative flex flex-col rounded-xl border-[3px] border-[#1d2926] dark:border-[#9edbd1] p-8 shadow-[8px_8px_0_#1d2926] dark:shadow-[8px_8px_0_#075f58] transition-transform hover:-translate-y-1 " +
                (i === 0
                  ? "bg-[#fff0d5] dark:bg-[#30291c]"
                  : i === 1
                    ? "bg-[#d7f0eb] dark:bg-[#173b34]"
                    : "bg-[#f8ded6] dark:bg-[#35231f]")
              }
              key={name}
            >
              <Icon className="text-[#dc755f]" />
              <h3 className={serif.className + " mt-5 text-3xl"}>
                Unearthed {name}
              </h3>
              <b className="my-2 text-sm text-[#075f58] dark:text-[#67d7c9]">
                {price}
              </b>
              <p className="min-h-14 text-sm text-stone-500 dark:text-stone-400">
                {best}
              </p>
              {name === "Mobile" && (
                <p className="mt-3 border-l-[3px] border-[#1d2926] dark:border-[#9edbd1] bg-white/60 dark:bg-[#101815]/70 px-3 py-2 text-xs font-bold text-[#1d2926] dark:text-[#f3ece2]">
                  Unearthed Local is required for Kindle and KOReader syncing,
                  and gives you the best overall Mobile experience.
                </p>
              )}
              <dl className="my-6 border-t text-sm">
                <dt className="mt-4 text-[9px] uppercase tracking-widest text-stone-400 dark:text-stone-400">
                  Runs on
                </dt>
                <dd>{runs}</dd>
              </dl>
              <Link
                href={href}
                className="mt-auto flex justify-between rounded-lg border-[3px] border-[#1d2926] dark:border-[#9edbd1] bg-[#25b1a6] px-5 py-4 text-sm font-black text-[#102521] shadow-[4px_4px_0_#1d2926] dark:shadow-[4px_4px_0_#075f58] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Choose {name}
                <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-[#ece5d9] dark:bg-[#151f1c] px-5 py-24">
        <div className="mx-auto grid max-w-[1180px] gap-16 md:grid-cols-2">
          <div>
            <p className="text-xs tracking-[.2em] text-[#075f58] dark:text-[#67d7c9]">
              TRUST & OWNERSHIP
            </p>
            <h2 className={serif.className + " my-5 text-6xl leading-none"}>
              Your highlights should{" "}
              <em className="text-[#075f58] dark:text-[#67d7c9]">
                stay yours.
              </em>
            </h2>
            <p className="leading-7 text-stone-600 dark:text-stone-300">
              Unearthed is open source and built to keep you in control. Your
              Amazon credentials are never stored or seen.
            </p>
          </div>
          <div className="space-y-6">
            {[
              [Github, "Open source"],
              [KeyRound, "No credential collection"],
              [ShieldCheck, "No lock-in"],
            ].map(([Icon, t]: any) => (
              <p
                className="flex items-center gap-4 border-b border-stone-300 dark:border-stone-700 pb-5"
                key={t}
              >
                <Icon className="text-[#075f58] dark:text-[#67d7c9]" />
                <b>{t}</b>
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-28 text-center">
        <Sparkles className="mx-auto text-[#dc755f]" />
        <blockquote
          className={
            serif.className + " my-7 text-4xl italic leading-tight sm:text-5xl"
          }
        >
          “I built Unearthed because saving highlights felt productive, but
          finding and using them later was still too hard.”
        </blockquote>
        <p className="text-xs tracking-widest text-stone-500 dark:text-stone-400">
          — MATT, FOUNDER OF UNEARTHED
        </p>
      </section>
      <section className="bg-[#075f58] px-5 py-24 text-center text-white">
        <h2 className={serif.className + " mx-auto my-6 max-w-3xl text-6xl"}>
          Make your highlights <em className="text-[#f3aa96]">useful</em>
        </h2>
        <p className="text-teal-100">
          Build a searchable reading library and revisit one meaningful idea
          each day.
        </p>
        <a
          href="#choose-your-setup"
          className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-bold text-[#075f58] dark:text-[#075f58]"
        >
          Choose your setup <ArrowRight size={17} />
        </a>
      </section>
      <footer className="bg-[#17332f] px-5 py-12 text-teal-50">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-7">
          <b className={serif.className + " text-3xl"}>
            Unearthed<span className="text-[#f3aa96]">.</span>
          </b>
          <p className="text-xs text-teal-200">
            Remember more of what you read.
          </p>
          <nav className="ml-auto flex gap-5 text-xs">
            <Link href="/local">Local</Link>
            <Link href="/online">Online</Link>
            <Link href="/mobile">Mobile</Link>
            <Link href="/local-docs">Docs</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
