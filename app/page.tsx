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

import { auth } from "@clerk/nextjs/server";
import { HomePagePublic } from "@/components/HomePagePublic";
import AuthenticatedHome from "@/components/AuthenticatedHome";
import { JsonLd } from "@/components/marketing/JsonLd";
import { noIndex, pageMetadata } from "@/lib/seo";
import { siteStructuredData } from "@/lib/structured-data";

export async function generateMetadata() {
  const { userId } = await auth();
  return userId
    ? { title: "Your Unearthed Library", robots: noIndex }
    : pageMetadata("/");
}

export default async function Home() {
  const { userId } = await auth();
  if (userId) return <AuthenticatedHome />;
  return (
    <main>
      <JsonLd data={siteStructuredData} />
      <HomePagePublic />
    </main>
  );
}
