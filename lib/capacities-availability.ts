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

// Release switch shared by public copy, metadata, settings and server operations.
// Set true only after OAuth client approval, configuration and release checks.
// Credentials alone never enable the integration. Rebuild/redeploy after changing.
export const CAPACITIES_ENABLED: boolean = false;

export const CAPACITIES_COMING_SOON = "Capacities is coming soon.";
export const CAPACITIES_LABEL = CAPACITIES_ENABLED ? "Capacities" : "Capacities (coming soon)";
export const CAPACITIES_REFLECTION_FEATURE = CAPACITIES_ENABLED ? "Daily Reflection sent to Capacities" : "Capacities daily reflections · Coming soon";

export function capacitiesText(active: string, comingSoon: string): string {
  return CAPACITIES_ENABLED ? active : comingSoon;
}
