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

import { buttonVariants } from "@/components/ui/button";
import { CAPACITIES_LABEL, capacitiesText } from "@/lib/capacities-availability";
import Link from "next/link";
import { Crimson_Pro } from "next/font/google";
import { ArrowDown, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { CompatibilityChecker } from "@/components/marketing/CompatibilityChecker";
import { readingGuides } from "@/lib/reading-guides";
import styles from "./HomePagePublic.module.css";

const serif = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--reading-serif",
});

const editions = [
  {
    name: "Local",
    label: "The desktop edition",
    price: "One time purchase",
    detail:
      "A library on your own computer. Kindle, KOReader, saved articles and RSS, with exports to Obsidian and Craft.",
    foot: "Windows · macOS · Linux",
    href: "/local",
    tone: "local",
  },
  {
    name: "Online",
    label: "The open source edition",
    price: "$5 / month",
    detail:
      capacitiesText("Your highlight library in a web browser. Connect Obsidian and Notion, send daily reflections to Capacities and Supernotes, and use optional AI summaries and book chat.", "Your highlight library in a web browser. Connect Obsidian and Notion, send daily reflections to Supernotes, and use optional AI summaries and book chat. Capacities coming soon."),
    foot: "Web app · GPL-3.0 open source",
    href: "/online",
    tone: "online",
  },
  {
    name: "Mobile",
    label: "The pocket edition",
    price: "One time purchase",
    detail:
      "Read articles and save passages on your phone. Connect to Local for Kindle and KOReader highlights.",
    foot: "Android & iOS · Install from your browser",
    href: "/mobile",
    tone: "mobile",
  },
] as const;

export function HomePagePublic() {
  return (
    <div className={`${styles.page} ${serif.variable}`}>
      <aside
        aria-labelledby="obsidian-local-banner-title"
        className="mx-auto mb-8 max-w-[1220px] border-[3px] border-[#25372e] bg-[#f5ce62] p-5 text-[#172c23] shadow-[7px_7px_0_#25372e] sm:p-7 lg:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
          <div className="min-w-0">
            <p className="mb-3 inline-flex border border-[#25372e] bg-[#172c23] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#fff7dd] sm:text-xs">
              <span>Using <span className="text-[#c4b5fd]">Obsidian</span>? Start here.</span>
            </p>
            <p
              id="obsidian-local-banner-title"
              className="max-w-3xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl"
            >
              Kindle &amp; KOReader highlights in <span className="text-[#7c3aed]">Obsidian</span>. Kept local.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
              Choose <strong className="italic">Unearthed Local</strong> to keep
              your library on your computer, read saved highlights offline and
              export directly to your <span className="text-[#7c3aed]">Obsidian</span> vault.
            </p>
            <p className="mt-3 text-xs font-semibold leading-relaxed sm:text-sm">
              Windows, macOS &amp; Linux · One time purchase · No <span className="text-[#7c3aed]">Obsidian</span> plugin
              needed
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-3 lg:w-64">
            <Link
              href="/local"
              className={buttonVariants({
                variant: "marketing",
                className: "w-full bg-[#172c23] text-sm text-[#fff7dd] hover:bg-[#263f31]",
              })}
            >
              Explore Unearthed Local <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/local-docs/install"
              className={buttonVariants({
                variant: "marketingSecondary",
                className: "w-full text-sm",
              })}
            >
              Read the setup guide <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </aside>
      <div className={styles.sheet}>
        <header className={styles.masthead}>
          <Link href="/" className={styles.wordmark}>
            Unearthed
          </Link>
          <p>
            Book highlights, articles
            <br />
            and your notes.
          </p>
          <span className={styles.folio}>READ · COLLECT · RETURN</span>
        </header>

        <article>
          <header className={styles.hero}>
            <div className={styles.kicker}>
              <span>On reading & remembering</span>
              <span>Kindle & KOReader highlights</span>
            </div>
            <h1>
              Knowledge shouldn’t stay buried.
            </h1>
            <p className={styles.heroSubtitle}>
              <em>Unearth the ideas hiding in your reading history.</em>
            </p>
            <div className={styles.introduction}>
              <p className={styles.dek}>
                Unearthed collects Kindle and KOReader highlights and connects
                them to your notes in Obsidian, and others.
              </p>
              <p className={styles.abstract}>
                Keep your library on your computer with (Unearthed Local), or use
                open source (Unearthed Online) in your browser. (Unearthed Local) also lets you save articles
                and read RSS feeds. Add (Unearthed Mobile) if you want to read and capture
                highlights on your phone.
              </p>
            </div>
            <div className={styles.actions}>
              <Link
                href="#choose-your-setup"
                className={buttonVariants({ variant: "marketing" })}
              >
                Find your edition <ArrowDown size={17} />
              </Link>
              <Link href="#a-second-reading" className={styles.textLink}>
                Read the introduction <span aria-hidden="true">↓</span>
              </Link>
              <span className={styles.smallNote}>
                Kindle · KOReader · Articles · Your own ideas
              </span>
            </div>
          </header>



          <div className={styles.articleLayout}>
            <aside className={styles.contents} aria-label="In this article">
              <span className={styles.label}>IN THIS ARTICLE</span>
              <a href="#a-second-reading">01 &nbsp; A second reading</a>
              <a href="#your-own-sources">02 &nbsp; Your own sources</a>
              <a href="#your-notes">03 &nbsp; Into your notes</a>
              <a href="#open-by-design">04 &nbsp; Open by design</a>
              <a href="#choose-your-setup">05 &nbsp; Choose an edition</a>
              <div className={styles.marginNote}>
                Already have a
                <br />
                note taking app?
                <br />
                Check which edition
                <br />
                connects to it.
              </div>
            </aside>
            <div className={styles.prose}>
              <section id="a-second-reading">
                <span className={styles.chapter}>01 / A SECOND READING</span>
                <h2>Find a passage without reopening every book.</h2>
                <p>
                  It’s easy to remember an idea and forget which book it came
                  from. With your highlights in one library, you can search
                  for a few words instead of looking through each book or switching apps.
                </p>
                <p>
                  Import your Kindle and KOReader highlights and keep your
                  notes alongside them in your favourite note taking app.
                </p>

                <p>
                  Daily reflections bring saved highlights back for another
                  look.
                </p>
                <p>
                  <Link href="/local">Unearthed Local</Link> also saves web
                  articles and follows RSS feeds, so new posts from the sites
                  you follow appear alongside your book highlights.{" "}
                  <Link href="/mobile">Mobile</Link> lets you read articles and
                  save passages on your phone.
                </p>
              </section>
              <section id="your-own-sources">
                <span className={styles.chapter}>02 / YOUR OWN SOURCES</span>
                <h2>Keep your short form inspiration in one place.</h2>
                <p>
                  A thought on a walk, advice from a friend, a useful fact or a
                  random quote. Save it in Unearthed, even if it didn’t come
                  from a book.
                </p>
                <p>
                  <strong>Create your own sources and use them as categories.</strong>{" "}
                  You could make one for “Ideas for work”, another for “Things
                  I’ve learned” and one for “Quotes to remember”. Add entries
                  to whichever source makes sense to you.
                </p>
                <p>
                  Your entries work like book highlights: keep notes alongside
                  them, search them and manage them in the same library. They
                  can also come back in daily reflections, alongside the
                  passages you’ve saved from books, RSS feeds and web articles.
                </p>
                <p>
                  The reflection might bring back something you read, or
                  something you thought of yourself.
                </p>
              </section>
              <section id="your-notes">
                <span className={styles.chapter}>03 / INTO YOUR NOTES</span>
                <h2>
                  Keep your highlights
                  <br />
                  with the rest of your notes.
                </h2>
                <p>
                  Export books and highlights to Obsidian, Craft or Notion,
                  {capacitiesText("or send a daily reflection to Capacities or Supernotes.", "or send a daily reflection to Supernotes. Capacities is coming soon.")}
                  Each edition connects to a different set of apps:
                </p>
                <div className={styles.integrationIndex}>
                  <Link href="/guides/kindle-to-obsidian">
                    <span>Obsidian</span>
                    <small>Local or Online · books & highlights</small>
                    <ArrowUpRight size={18} />
                  </Link>
                  <Link href="/guides/kindle-to-craft">
                    <span>Craft</span>
                    <small>Local · books, articles & highlights</small>
                    <ArrowUpRight size={18} />
                  </Link>
                  <Link href="/guides/kindle-to-notion">
                    <span>Notion</span>
                    <small>Online · books & highlights</small>
                    <ArrowUpRight size={18} />
                  </Link>
                  <Link href="/guides/kindle-to-capacities">
                    <span>{CAPACITIES_LABEL}</span>
                    <small>{capacitiesText("Online · daily reflections", "Online · Coming soon")}</small>
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
                <p>
                  (Unearthed Local) saves your Kindle highlights as Markdown files in your
                  Obsidian vault, the folder where you keep your notes. You pay
                  for (Unearthed Local) once.
                  No Unearthed browser extension or Obsidian plugin needed.
                </p>
                <Link
                  href="/guides/kindle-to-obsidian"
                  className={styles.textLink}
                >
                  Read the Kindle to Obsidian guide <ArrowUpRight size={17} />
                </Link>
              </section>
              <section id="open-by-design">
                <span className={styles.chapter}>04 / OPEN BY DESIGN</span>
                <h2>
                  Read the code, too.
                </h2>
                <p>
                  <strong>(Unearthed Online) is open source.</strong> The web app
                  is licensed under GPL-3.0, and the browser extension, Obsidian
                  plugin and KOReader plugin have their code on GitHub too.
                </p>
                <p>
                  You can read the code, report a bug or suggest a change. You
                  can run the source code on your own infrastructure; hosting
                  and connected services may have their own costs. Using
                  Online at unearthed.app costs a monthly subscription. Local
                  and Mobile are separate one time paid apps.
                </p>
                <div className={styles.sourceStamp}>
                  <Github size={23} />
                  <div>
                    <b>OPEN SOURCE / GPL-3.0</b>
                    <span>Web app, extension and plugins.</span>
                  </div>
                  <Link
                    href="/guides/open-source"
                    aria-label="Read about Unearthed Online’s open source code"
                  >
                    <ArrowUpRight size={24} />
                  </Link>
                </div>
              </section>
            </div>
          </div>

          <section id="choose-your-setup" className={styles.editions}>
            <div className={styles.editionHeading}>
              <div>
                <span className={styles.chapter}>05 / CHOOSE AN EDITION</span>
                <h2>
                  Which edition
                  <br />
                  <em>fits you?</em>
                </h2>
              </div>
              <p>
                Start with where you read
                <br />
                and where you want your notes.
              </p>
            </div>
            {editions.map((edition, index) => (
              <div className={styles.editionRow} key={edition.name}>
                <div className={styles.editionName}>
                  <span>0{index + 1}</span>
                  <div>
                    <small>{edition.label}</small>
                    <h3>{edition.name}</h3>
                  </div>
                </div>
                <div className={styles.editionDetail}>
                  <p>{edition.detail}</p>
                  <small>{edition.foot}</small>
                </div>
                <div className={styles.editionAction}>
                  <b>{edition.price}</b>
                  <Link
                    href={edition.href}
                    className={buttonVariants({ variant: "marketing", tone: edition.tone })}
                  >
                    Explore {edition.name} <ArrowUpRight size={17} />
                  </Link>
                </div>
              </div>
            ))}
            <div className={styles.helpChoose}>
              <span>A little help choosing?</span>
              <CompatibilityChecker
                product="online"
                triggerLabel="Check my reading setup"
              />
            </div>
          </section>

          <section className={styles.furtherReading}>
            <div>
              <span className={styles.chapter}>FURTHER READING</span>
              <h2>Guides for your reading apps</h2>
              <p>How to bring in your highlights, send them to your notes and choose an edition.</p>
            </div>
            <ol>
              {readingGuides.map((guide, index) => (
                <li key={guide.slug}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Link href={`/guides/${guide.slug}`} target="_blank" rel="noopener noreferrer">
                    {guide.slug === "readwise-alternative"
                      ? "Readwise alternative: compare Unearthed features and pricing"
                      : guide.title}
                    <ArrowUpRight size={17} />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </article>
        <footer className={styles.footer}>
          <Link href="/" className={styles.wordmark}>
            Unearthed.
          </Link>
          <p>Highlights, articles and notes in one library.</p>
          <nav aria-label="Footer">
            <Link href="/guides">Guides</Link>
            <Link href="/local-docs">Documentation</Link>
            <Link href="/privacy">Privacy</Link>
            <a href="https://github.com/Unearthed-App">GitHub</a>
          </nav>
          <span className={styles.endMark}>■</span>
        </footer>
      </div>
    </div>
  );
}
