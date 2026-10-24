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

import { ImageResponse } from "next/og";
import { comparisonFeatureCount } from "@/lib/readwise-comparison";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "64px 72px", background: "#f8f3e9", color: "#202e29", borderTop: "12px solid #075f58" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 23, color: "#075f58", fontWeight: 700 }}><span>UNEARTHED</span><span>Unearthed vs Readwise</span></div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 48, fontSize: 83, lineHeight: 1.05, fontWeight: 700, letterSpacing: "-3px" }}><span>A Readwise</span><span style={{ color: "#075f58" }}>alternative.</span></div>
      <div style={{ display: "flex", marginTop: 30, fontSize: 29 }}>Kindle · KOReader · Obsidian · Craft · RSS</div>
      <div style={{ display: "flex", marginTop: "auto", paddingTop: 25, borderTop: "1px solid #b8c3b8", fontSize: 23, justifyContent: "space-between" }}><span>{comparisonFeatureCount} features compared</span><span>unearthed.app</span></div>
    </div>,
    { width: 1200, height: 630 },
  );
}
