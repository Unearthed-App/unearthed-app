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

import { useEffect } from 'react';

export function ScrollToMockup() {
  useEffect(() => {
    const shouldScroll =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('scroll') === 'mobile-mockup';

    if (!shouldScroll) return;

    // Small delay to ensure everything is rendered
    const timer = setTimeout(() => {
      const element = document.getElementById('mobile-mockup');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
}
