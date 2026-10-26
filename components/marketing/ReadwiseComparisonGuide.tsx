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
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ReadingGuide } from "@/lib/reading-guides";
import { comparisonFeatureCount } from "@/lib/readwise-comparison";
import { SITE_URL } from "@/lib/seo";
import { guideArticleSchema } from "@/lib/structured-data";
import { JsonLd } from "./JsonLd";
import { ReadwiseFeatureTable } from "./ReadwiseFeatureTable";
import { EditionNames } from "./EditionNames";
import { ReadwiseComparisonFilterProvider } from "./ReadwiseComparisonFilters";
import styles from "./ReadwiseComparison.module.css";

const sectionId = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const products = [
  { name: "Readwise", edition: "Highlights + Reader", price: "US$12.99", term: "/ month, billed monthly", text: "Reading, highlight review and cloud sync in one subscription.", href: "https://readwise.io/pricing/reader", link: "Readwise pricing", tone: "readwise" },
  { name: "Unearthed", edition: "Unearthed Local", price: "Buy once", term: "Desktop app", text: "Your library on your computer. Direct Obsidian and Craft export.", href: "/local", link: "Explore Unearthed Local", tone: "local" },
  { name: "Unearthed", edition: "Unearthed Online", price: "$5", term: "/ month, hosted service", text: "Your web library, connected notes apps and optional AI tools.", href: "/online", link: "Explore Unearthed Online", tone: "online" },
  { name: "Unearthed", edition: "Unearthed Mobile", price: "Buy once", term: "Separate purchase", text: "Articles, RSS and quote capture. Connect to Unearthed Local for book highlights.", href: "/mobile", link: "Explore Unearthed Mobile", tone: "mobile" },
];

export function ReadwiseComparisonGuide({ guide }: { guide: ReadingGuide }) {
  return (
    <ReadwiseComparisonFilterProvider><main className={styles.page}>
      <JsonLd data={guideArticleSchema(guide)} />
      {guide.faqs?.length && <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "@id": `${SITE_URL}/guides/${guide.slug}#readwise-alternative-questions`,
        mainEntity: guide.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
      }} />}
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Unearthed", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
          { "@type": "ListItem", position: 3, name: guide.title, item: `${SITE_URL}/guides/${guide.slug}` },
        ],
      }} />
      <article className={styles.article}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/" target="_blank" rel="noopener noreferrer">Unearthed</Link><span aria-hidden="true">/</span><Link href="/guides" target="_blank" rel="noopener noreferrer">Guides</Link><span aria-hidden="true">/</span><span>Readwise alternative</span></nav>
        <header className={styles.hero}>
          <div className={styles.eyebrow}><span>Unearthed vs Readwise</span><span>Updated <time dateTime={guide.updatedAt}>{new Date(`${guide.updatedAt}T00:00:00Z`).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time></span></div>
          <h1>A Readwise <span>alternative</span></h1>
          <p className={styles.heroIntro}>Reading apps, highlight libraries<br /> <em>and the notes you keep.</em></p>
          <aside className={styles.researchNote} aria-label="A note from Unearthed’s developer">
            <p>I’m the developer of Unearthed, and this comparison is based on my findings. Please do your own research into Readwise too. I’ve included links to Readwise resources throughout this guide, including its <a href="https://readwise.io/pricing/reader" target="_blank" rel="noopener noreferrer">pricing</a>, <a href="https://readwise.io/read" target="_blank" rel="noopener noreferrer">Reader product page</a> and <a href="https://docs.readwise.io/readwise/docs" target="_blank" rel="noopener noreferrer">documentation</a>, so you can check the details for yourself.</p>
          </aside>
          <p className={styles.answer}><EditionNames text={guide.answer} /></p>
          <div className={styles.heroActions}>
            <a className={styles.primaryLink} href="#compare-the-features">Compare all {comparisonFeatureCount} features <ArrowDown size={17} aria-hidden="true" /></a>
            <Link className={styles.textLink} href="/which-unearthed" target="_blank" rel="noopener noreferrer">Find your Unearthed edition <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </header>
        <div className={styles.products} aria-label="Products and pricing at a glance">
          {products.map((product) => (
            <div className={`${styles.product} ${styles[product.tone]}`} key={product.href}>
              <p className={styles.productName}>{product.name}</p>
              <h2><EditionNames text={product.edition} /></h2>
              <p className={styles.productPrice}>{product.price}</p><p className={styles.productTerm}>{product.term}</p>
              <p className={styles.productDescription}><EditionNames text={product.text} /></p>
              <a href={product.href} target="_blank" rel="noopener noreferrer"><span><EditionNames text={product.link} /></span><ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          ))}
        </div>
        <p className={styles.pricingNote}><EditionNames text="Subscription prices shown use monthly billing. Full Readwise also offers annual billing at US$119.88 per year, paid upfront. Unearthed Local and Unearthed Mobile are sold separately." /> See the <a href="#pricing-and-what-your-purchase-includes">pricing notes</a> for Readwise’s single app plans and requirements.</p>
        <nav className={styles.contents} aria-label="On this page"><span>In this guide</span>{guide.sections.map((section) => <a key={section.heading} href={`#${sectionId(section.heading)}`}>{section.heading}</a>)}{guide.faqs?.length && <a href="#readwise-alternative-questions">Readwise alternative FAQs</a>}</nav>
        {guide.sections.map((section) => (
          <section key={section.heading} className={section.comparison ? styles.wideSection : styles.proseSection} aria-labelledby={sectionId(section.heading)}>
            <div className={styles.sectionIntro}>
              <h2 id={sectionId(section.heading)}>{section.heading}</h2>
              <p><EditionNames text={section.text} /></p>
              {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}><EditionNames text={bullet} /></li>)}</ul>}
              {section.steps && <ol>{section.steps.map((step) => <li key={step}><EditionNames text={step} /></li>)}</ol>}
            </div>
            {section.comparison && <ReadwiseFeatureTable />}
            {section.sources && <ul className={styles.sourceList}>{section.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer"><EditionNames text={source.label} /><ArrowUpRight size={13} aria-hidden="true" /></a></li>)}</ul>}
          </section>
        ))}
        {guide.faqs?.length && (
          <section className={styles.proseSection} aria-labelledby="readwise-alternative-questions">
            <div className={styles.sectionIntro}>
              <h2 id="readwise-alternative-questions">Questions about switching from Readwise</h2>
              {guide.faqs.map((faq) => (
                <div className={styles.faqItem} key={faq.question}>
                  <h3 id={sectionId(faq.question)}>{faq.question}</h3>
                  <p><EditionNames text={faq.answer} /></p>
                  {faq.links && <ul className={styles.faqLinks}>{faq.links.map((link) => <li key={link.href}><Link href={link.href} target="_blank" rel="noopener noreferrer"><EditionNames text={link.label} /><ArrowUpRight size={13} aria-hidden="true" /></Link></li>)}</ul>}
                </div>
              ))}
            </div>
          </section>
        )}
        <aside className={styles.nextStep} aria-labelledby="choose-your-edition">
          <div><p className={styles.kicker}>Choose an edition</p><h2 id="choose-your-edition">Find your Unearthed setup.</h2><p><EditionNames text="Compare Unearthed Local, Unearthed Online and Unearthed Mobile, including what you need for your notes app." /></p></div>
          <Link href="/which-unearthed" className={styles.primaryLink} target="_blank" rel="noopener noreferrer">Compare Unearthed editions <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </aside>
        <footer className={styles.footer}><Link href="/guides" target="_blank" rel="noopener noreferrer">All guides</Link>{guide.links.map((link) => <Link href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">{link.label}</Link>)}</footer>
      </article>
    </main></ReadwiseComparisonFilterProvider>
  );
}
