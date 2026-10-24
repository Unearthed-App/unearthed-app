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

import { createContext, useContext, useId, useState, type ReactNode } from "react";
import { comparisonGroups, matchesComparisonAudience, type ComparisonAudience } from "@/lib/readwise-comparison";
import { EditionNames } from "./EditionNames";
import styles from "./ReadwiseComparison.module.css";

const ComparisonFilterContext = createContext<{
  audience: ComparisonAudience;
  setAudience: (audience: ComparisonAudience) => void;
} | null>(null);

export function ReadwiseComparisonFilterProvider({ children }: { children: ReactNode }) {
  const [audience, setAudience] = useState<ComparisonAudience>("all");
  return <ComparisonFilterContext.Provider value={{ audience, setAudience }}>{children}</ComparisonFilterContext.Provider>;
}

export function useComparisonFilter() {
  const context = useContext(ComparisonFilterContext);
  if (!context) throw new Error("Comparison filters require their provider.");
  return context;
}

export function ReadwiseComparisonFilters() {
  const { audience, setAudience } = useComparisonFilter();
  const noteId = useId();
  const options = [
    { value: "all", label: "All features" },
    { value: "shared", label: "Shared features" },
    { value: "readwise", label: "Readwise only features" },
    { value: "unearthed", label: "Unearthed only features" },
  ] as const;
  return (
    <div className={styles.audienceFilters}>
      <p className={styles.audienceHeading}>Show the differences</p>
      <p className={styles.audienceDescription}><EditionNames text="Compare Readwise with Unearthed Local, Unearthed Online and Unearthed Mobile together." /></p>
      <div className={styles.audienceButtons} role="group" aria-label="Filter features by product" aria-describedby={noteId}>
        {options.map(({ value, label }) => {
          const count = comparisonGroups.reduce((sum, group) => sum + group.features.filter((feature) => matchesComparisonAudience(feature, value)).length, 0);
          return <button key={value} type="button" aria-pressed={audience === value} onClick={() => setAudience(value)}>{label}<span aria-label={`${count} features`}>{count}</span></button>;
        })}
      </div>
      <p id={noteId} className={styles.audienceNote}>Shared features are supported by Readwise and at least one Unearthed edition. “Only” includes features not listed or verified for the other product. Check each row’s status and conditions. Coming soon features don’t count as available.</p>
    </div>
  );
}
