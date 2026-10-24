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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CAPACITIES_COMING_SOON } from "@/lib/capacities-availability";

// Kept separate from the active settings: rendering this never loads credentials
// or invokes the connection actions, including during server rendering.
export function CapacitiesComingSoon() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Capacities</CardTitle>
          <span className="rounded-full border border-current/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">Coming soon</span>
        </div>
        <CardDescription>Daily reading reflections in your Capacities daily note.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p role="status" className="leading-7">{CAPACITIES_COMING_SOON}</p>
      </CardContent>
    </Card>
  );
}
