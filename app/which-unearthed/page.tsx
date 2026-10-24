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

import { DiscoveryLinks } from "@/components/marketing/DiscoveryLinks";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { WhichUnearthedPage } from "@/components/WhichUnearthedPage";

export const metadata: Metadata = pageMetadata("/which-unearthed");

export default function WhichUnearthed() {
  return (
    <>
      <WhichUnearthedPage />
      <DiscoveryLinks />
    </>
  );
}
