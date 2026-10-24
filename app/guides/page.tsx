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

import { capacitiesText } from "@/lib/capacities-availability";
import { DiscoveryLinks } from "@/components/marketing/DiscoveryLinks";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/guides", {
  title: "Reading Guides | Kindle, KOReader & Your Notes",
  description:
    capacitiesText("Set up Kindle and KOReader imports, connect your notes to Obsidian, Craft, Notion or Capacities, and compare Unearthed editions.", "Set up Kindle and KOReader imports, connect Obsidian, Craft or Notion, and compare Unearthed editions. Capacities integration coming soon."),
});
export default function GuidesPage() {
  return (
    <main className="pt-32">
      <header className="mx-auto max-w-6xl px-5 pb-10">
        <h1 className="font-serif text-5xl">Reading guides</h1>
        <p className="mt-5 max-w-2xl leading-7">
          Set up Kindle and KOReader, connect your notes app, or find out which
          Unearthed app to use. These guides walk you through the steps.
        </p>
      </header>
      <DiscoveryLinks isGuidePage />
    </main>
  );
}
