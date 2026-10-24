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

import { useId, useState } from "react";
import { Check, Clock3, HelpCircle, Minus, Search, CircleDot, X } from "lucide-react";
import {
  comparisonGroups,
  comparisonSources,
  comparisonFeatureCount,
  matchesComparisonAudience,
  type ComparisonCell,
} from "@/lib/readwise-comparison";
import styles from "./ReadwiseComparison.module.css";
import { EditionNames } from "./EditionNames";
import { ReadwiseComparisonFilters, useComparisonFilter } from "./ReadwiseComparisonFilters";

function Availability({ cell }: { cell: ComparisonCell }) {
  const Icon = { yes: Check, no: Minus, limited: CircleDot, unknown: HelpCircle, soon: Clock3 }[cell.status];
  const iconOnly = cell.label === "Included" || cell.label === "Not included";
  return (
    <span className={`${styles.availability} ${styles[cell.status]}`}>
      <Icon size={17} strokeWidth={cell.status === "yes" ? 2.6 : 1.7} aria-hidden="true" />
      <span className={iconOnly ? "sr-only" : undefined}><EditionNames text={cell.label} /></span>
    </span>
  );
}

export function ReadwiseFeatureTable() {
  const { audience, setAudience } = useComparisonFilter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const inputId = useId();
  const categoryId = useId();
  const needle = query.trim().toLowerCase();
  const groups = comparisonGroups
    .filter((group) => category === "all" || group.id === category)
    .map((group) => ({
      ...group,
      features: group.features.filter((feature) => matchesComparisonAudience(feature, audience) &&
        [group.title, feature.name, feature.detail, ...feature.cells.map((cell) => cell.label)]
          .filter(Boolean).join(" ").toLowerCase().includes(needle),
      ),
    }))
    .filter((group) => group.features.length);
  const visibleCount = groups.reduce((sum, group) => sum + group.features.length, 0);

  return (
    <div className={styles.comparison}>
      <div className={styles.controls}>
        <div className={styles.searchField}>
          <label htmlFor={inputId}>Find a feature</label>
          <div className={styles.searchInput}>
            <Search size={18} aria-hidden="true" />
            <input id={inputId} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Kindle, Craft or AI…" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear feature search"><X size={17} aria-hidden="true" /></button>}
          </div>
        </div>
        <div className={styles.categoryField}>
          <label htmlFor={categoryId}>Browse a section</label>
          <select id={categoryId} value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All sections</option>
            {comparisonGroups.map((group) => <option value={group.id} key={group.id}>{group.title}</option>)}
          </select>
        </div>
      </div>
      <ReadwiseComparisonFilters />
      <div className={styles.tableMeta}>
        <p role="status" aria-live="polite" aria-atomic="true">{visibleCount} of {comparisonFeatureCount} features</p>
        <p>On a small screen, scroll each table sideways to compare editions.</p>
      </div>
      <ul className={styles.legend} aria-label="Comparison key">
        <li><Availability cell={{ status: "yes", label: "Included" }} /><span>Supported</span></li>
        <li><Availability cell={{ status: "limited", label: "" }} /><span>With conditions</span></li>
        <li><Availability cell={{ status: "no", label: "Not included" }} /><span>Not included</span></li>
        <li><Availability cell={{ status: "unknown", label: "" }} /><span>Not verified / listed</span></li>
        <li><Availability cell={{ status: "soon", label: "" }} /><span>Coming soon</span></li>
      </ul>
      <nav className={styles.categoryNav} aria-label="Feature categories">
        {groups.map((group) => <a href={`#features-${group.id}`} key={group.id}>{group.title}</a>)}
      </nav>
      {groups.length === 0 && (
        <div className={styles.emptyState}>
          <h3>No matching features</h3>
          <p>Try a broader search or choose another section.</p>
          <button type="button" onClick={() => { setQuery(""); setCategory("all"); setAudience("all"); }}>Show all features</button>
        </div>
      )}
      {groups.map((group) => (
        <section key={group.id} className={styles.featureGroup} aria-labelledby={`features-${group.id}`}>
          <div className={styles.groupHeading}>
            <div><h3 id={`features-${group.id}`}>{group.title}</h3><p><EditionNames text={group.description} /></p></div>
            <span>{String(comparisonGroups.findIndex((item) => item.id === group.id) + 1).padStart(2, "0")}</span>
          </div>
          <div className={styles.tableScroll} role="region" aria-label={`${group.title} feature comparison`} tabIndex={0}>
            <table className={styles.featureTable}>
              <caption className="sr-only">{group.title}: Full Readwise, Unearthed Local, Unearthed Online and Unearthed Mobile</caption>
              <colgroup><col className={styles.featureColumn} /><col /><col /><col /><col /></colgroup>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col"><span>Readwise</span><small>Highlights + Reader</small></th>
                  <th scope="col"><span><EditionNames text="Unearthed Local" /></span><small>Desktop</small></th>
                  <th scope="col"><span><EditionNames text="Unearthed Online" /></span><small>Cloud</small></th>
                  <th scope="col"><span><EditionNames text="Unearthed Mobile" /></span><small>Phone & tablet</small></th>
                </tr>
              </thead>
              <tbody>
                {group.features.map((feature) => (
                  <tr key={feature.name}>
                    <th scope="row"><span><EditionNames text={feature.name} /></span>{feature.detail && <small><EditionNames text={feature.detail} /></small>}</th>
                    {feature.cells.map((cell, index) => <td key={index}><Availability cell={cell} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.groupSources}>
            <span>Sources</span>
            {group.sources.map((id) => {
              const source = comparisonSources.find((item) => item.id === id);
              return source ? <a href={source.href} key={id} target="_blank" rel="noopener noreferrer"><EditionNames text={source.label} /></a> : null;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
