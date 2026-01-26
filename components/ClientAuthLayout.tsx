"use client";

import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Navbar as NavBarPremium } from "@/components/premium/Navbar";
import { ModeToggle } from "@/components/ModeToggle";
import { DropdownMenuNav } from "@/components/DropdownMenuNav";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
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
        <div className="z-50 fixed mt-2 ml-2 flex space-x-2">
          <ModeToggle />
          <DropdownMenuNav />
          <SignInButton>
            <Button size="icon">
              <LogIn />
            </Button>
          </SignInButton>
        </div>
      </SignedOut>
      {children}
    </>
  );
}

