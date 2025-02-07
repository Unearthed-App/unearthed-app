/**
 * Copyright (C) 2024 Unearthed App
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

import { PHProvider } from "@/app/providers";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { checkCookieConsent } from "./CookieConsent";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface ConditionalPHProps {
  children: React.ReactNode;
}

const ConditionalPH: React.FC<ConditionalPHProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consentGiven = checkCookieConsent();
  
  const { user } = useUser();

  useEffect(() => {
    if (consentGiven && posthog) {
      if (user) {
        posthog.identify(user.id);
        posthog.people.set({ 
          email: user.primaryEmailAddress?.emailAddress,
        });
      } else {
        posthog.reset();
      }

      if (pathname) {
        const url = `${window.origin}${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`;
        posthog.capture("$pageview", { $current_url: url });
      }
    }
  }, [user, pathname, searchParams, consentGiven]);

  return consentGiven ? <PHProvider>{children}</PHProvider> : <>{children}</>;
};

export default ConditionalPH;