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

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Navbar as NavBarPremium } from "@/components/premium/Navbar";
import { PublicNavbar } from "@/components/PublicNavbar";
import { NonPremiumNavigation } from "@/components/NonPremiumNavigation";
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
      <SignedIn>
        {isPremium ? <NavBarPremium /> : <NonPremiumNavigation />}
      </SignedIn>
      <SignedOut>
        <PublicNavbar />
      </SignedOut>
      {children}
    </>
  );
}

