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

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { readingGuides } from "@/lib/reading-guides";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/marketing/JsonLd";
import { guideArticleSchema } from "@/lib/structured-data";
import { ReadwiseComparisonGuide } from "@/components/marketing/ReadwiseComparisonGuide";

function sectionId(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const dynamicParams = false;
export function generateStaticParams() {
  return readingGuides.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = readingGuides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const metadata = pageMetadata(`/guides/${slug}`, guide);
  if (guide.status === "coming-soon") return metadata;
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      modifiedTime: guide.updatedAt,
      section: "Reading guides",
      ...(slug === "readwise-alternative" ? { images: [{ url: "/og/readwise-alternative", width: 1200, height: 630, alt: "Unearthed: a Readwise alternative for Kindle, KOReader and Obsidian" }] } : {}),
    },
    ...(slug === "readwise-alternative" ? { twitter: { ...metadata.twitter, images: ["/og/readwise-alternative"] } } : {}),
  };
}
export default async function ReadingGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = readingGuides.find((item) => item.slug === slug);
  if (!guide) notFound();
  if (slug === "readwise-alternative") return <ReadwiseComparisonGuide guide={guide} />;
  if (guide.status === "coming-soon") {
    return (
      <main data-page-status="coming-soon" className="flex min-h-[75vh] flex-col items-center justify-center gap-5 px-5 pt-28 text-center">
        <JsonLd data={guideArticleSchema(guide)} />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#075f58] dark:text-[#67d7c9]">Capacities</p>
        <h1 className="font-serif text-5xl sm:text-7xl">Coming soon</h1>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#f8f3e9] px-5 pb-20 pt-32 text-[#1d2926] dark:bg-[#101815] dark:text-[#f3ece2]">
      <JsonLd data={guideArticleSchema(guide)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Unearthed",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Reading guides",
              item: `${SITE_URL}/guides`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: guide.title,
              item: `${SITE_URL}/guides/${slug}`,
            },
          ],
        }}
      />
      {slug === "open-source" && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: "Unearthed Online",
            description: guide.answer,
            codeRepository: "https://github.com/Unearthed-App/unearthed-app",
            license: "https://www.gnu.org/licenses/gpl-3.0.html",
            programmingLanguage: "TypeScript",
            url: `${SITE_URL}/online`,
          }}
        />
      )}
      <article className="mx-auto max-w-3xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex flex-wrap gap-2 text-sm"
        >
          <Link className="underline" href="/">
            Unearthed
          </Link>
          <span aria-hidden="true">/</span>
          <Link className="underline" href="/guides">
            Reading guides
          </Link>
        </nav>
        <p className="text-xs font-bold uppercase tracking-widest text-[#075f58] dark:text-[#67d7c9]">
          Unearthed · Reading guides
        </p>
        <p className="mt-3 text-sm text-[#1d2926]/70 dark:text-[#f3ece2]/70">
          Updated{" "}
          <time dateTime={guide.updatedAt}>
            {new Date(`${guide.updatedAt}T00:00:00Z`).toLocaleDateString("en-AU", {
              day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
            })}
          </time>
        </p>
        <h1 className="mb-8 mt-4 font-serif text-4xl leading-tight sm:text-6xl">
          {guide.title}
        </h1>
        <p className="border-l-4 border-[#25b1a6] pl-5 text-lg leading-8">
          {guide.answer}
        </p>
        <nav aria-label="On this page" className="mt-8 border-y border-current/20 py-6">
          <p className="mb-3 text-sm font-bold">On this page</p>
          <ul className="space-y-2 text-sm leading-6">
            {guide.sections.map((section) => (
              <li key={section.heading}>
                <a className="underline underline-offset-4" href={`#${sectionId(section.heading)}`}>
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {guide.sections.map((section) => (
          <section className="mt-12" key={section.heading}>
            <h2 id={sectionId(section.heading)} className="mb-4 scroll-mt-28 font-serif text-3xl">
              <a href={`#${sectionId(section.heading)}`} className="underline-offset-4 hover:underline">
                {section.heading}
              </a>
            </h2>
            <p className="leading-8">{section.text}</p>
            {section.steps && (
              <ol className="mt-5 list-decimal space-y-4 pl-6 leading-7">
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            )}
            {section.bullets && (
              <ul className="mt-5 list-disc space-y-3 pl-6 leading-7">
                {section.bullets.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
            {section.table && (
              <div
                role="region"
                aria-label={section.table.caption}
                tabIndex={0}
                className="mt-6 max-w-full overflow-x-auto rounded-lg border border-current/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm leading-6">
                  <caption className="caption-top p-4 text-left font-semibold">
                    {section.table.caption}
                  </caption>
                  <thead className="bg-black/5 dark:bg-white/5">
                    <tr>
                      {section.table.columns.map((column) => (
                        <th scope="col" key={column} className="border-t border-current/20 p-4 align-top">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, index) => index === 0 ? (
                          <th scope="row" key={index} className="border-t border-current/20 p-4 align-top font-semibold">{cell}</th>
                        ) : (
                          <td key={index} className="border-t border-current/20 p-4 align-top">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.example && (
              <figure className="mt-6 min-w-0 overflow-hidden rounded-lg border border-current/20">
                <figcaption className="border-b border-current/20 px-4 py-3 text-sm leading-6">
                  {section.example.caption}
                </figcaption>
                <pre className="overflow-x-auto bg-black/5 p-4 text-sm leading-7 dark:bg-white/5"><code>{section.example.code}</code></pre>
              </figure>
            )}
            {section.image && (
              <figure className="mt-6">
                <a href={section.image.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full size screenshot: ${section.image.alt}`}>
                  <Image
                    src={section.image.src}
                    alt={section.image.alt}
                    width={section.image.width}
                    height={section.image.height}
                    sizes="(max-width: 768px) calc(100vw - 40px), 768px"
                    className="h-auto max-h-[36rem] w-full rounded-lg border border-current/20 object-contain"
                  />
                </a>
                <figcaption className="mt-3 text-sm leading-6 text-[#1d2926]/70 dark:text-[#f3ece2]/70">
                  {section.image.caption}{" "}
                  <a href={section.image.src} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Open full size screenshot</a>.
                </figcaption>
              </figure>
            )}
            {section.sources && (
              <div className="mt-5 text-sm leading-6">
                <p className="font-semibold">Documentation and links</p>
                <ul className="mt-2 space-y-2">
                  {section.sources.map((source) => (
                    <li key={source.href}><Link href={source.href} className="underline underline-offset-4">{source.label}</Link></li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
        <aside
          className="mt-14 rounded-xl border border-current/20 p-6"
          aria-labelledby="next-steps"
        >
          <h2 id="next-steps" className="mb-5 font-serif text-3xl">
            Related links
          </h2>
          <ul className="space-y-4">
            {guide.links.map((link) => (
              <li key={link.href}>
                <Link className="underline underline-offset-4" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <footer className="mt-12 flex flex-wrap gap-6 border-t border-current/20 pt-6 text-sm">
          <Link className="underline" href="/guides">
            All guides
          </Link>
          <Link className="underline" href="/which-unearthed">
            Compare editions
          </Link>
          <Link className="underline" href="/privacy">
            Privacy
          </Link>
        </footer>
      </article>
    </main>
  );
}
