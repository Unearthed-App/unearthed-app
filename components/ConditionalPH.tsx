"use client";

import React, { useEffect } from "react";
import { PHProvider } from "@/app/providers";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { checkCookieConsent } from "./CookieConsent";

interface ConditionalPHProps {
  children: React.ReactNode;
}

const ConditionalPH: React.FC<ConditionalPHProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consentGiven = checkCookieConsent();

  useEffect(() => {
    if (consentGiven) {
      // Check if posthog is available (it should be initialized in PHProvider)
      if (posthog) {
        posthog.capture("$pageview");
      }
    }
  }, [pathname, searchParams, consentGiven]);

  if (consentGiven) {
    return <PHProvider>{children}</PHProvider>;
  }

  return <>{children}</>;
};

export default ConditionalPH;
