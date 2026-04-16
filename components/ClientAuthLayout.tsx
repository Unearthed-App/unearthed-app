"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Navbar as NavBarPremium } from "@/components/premium/Navbar";
import { PublicNavbar } from "@/components/PublicNavbar";
import { useEffect, useState } from "react";

export function ClientAuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const checkPremiumStatus = async () => {
        try {
          const response = await fetch('/api/auth/premium-status');
          const data = await response.json();
          setIsPremium(data.isPremium || false);
        } catch (error) {
          console.error('Error fetching premium status:', error);
          setIsPremium(false);
        }
      };

      checkPremiumStatus();
    } else if (isLoaded && !user) {
      setIsPremium(false);
    }
  }, [user, isLoaded]);

  return (
    <>
      <SignedIn>{isPremium && <NavBarPremium />}</SignedIn>
      <SignedOut>
        <PublicNavbar />
      </SignedOut>
      {children}
    </>
  );
}

