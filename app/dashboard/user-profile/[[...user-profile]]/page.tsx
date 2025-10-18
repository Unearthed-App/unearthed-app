/**
 * Copyright (C) 2025 Unearthed App
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

import { getIsPremium } from "@/lib/utils";
import { UserProfile } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { Crown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { NonPremiumNavigation } from "@/components/NonPremiumNavigation";

export default function UserProfilePage() {
  const [isPremium, setIsPremium] = useState(false);
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      const isPremium = await getIsPremium();
      setIsPremium(isPremium);
    };

    fetchPremiumStatus();
  }, []);

  const SubscriptionPage = () => {
    if (isPremium) {
      const stripePortalLink = process.env.NEXT_PUBLIC_STRIPE_PORTAL!;

      return (
        <div>
          <h2 className="font-bold text-lg">
            Manage Your Premium Subscription
          </h2>
          <p>
            Click the button below and follow the prompts to manage your
            subscription.
          </p>
          <div className="bg-background rounded-lg p-4 flex mt-2">
            <Info className="mr-2 w-8 h-8" />
            <p>
              When you cancel your subscription, you will lose access to premium
              features at the <span className="font-semibold">end</span> of the
              subscription period.
            </p>
          </div>

          <Link href={stripePortalLink!}>
            <Button variant="brutalprimary" className="mt-4">
              <span className="">Stripe Portal</span>
            </Button>
          </Link>
        </div>
      );
    } else {
      return (
        <div>
          <h2 className="font-bold text-xl">You do not have access yet</h2>
          <p>Follow the link below to find out more</p>
          <Link href="/dashboard/get-premium">
            <Button variant="brutalprimary" className="mt-4">
              <Crown className="mr-0 md:mr-2" />
              <span className="">Get Unearthed Online</span>
            </Button>
          </Link>
        </div>
      );
    }
  };

  if (!isLoaded || !userId) {
    return (
      <div className="pt-32 flex w-full items-center justify-center">
        {/* <h2>User Removed</h2> */}
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-24">
      {/* Navigation */}
      <NonPremiumNavigation currentPage="profile" />

      <div className="flex w-full items-center justify-center">
        <UserProfile
          path="/dashboard/user-profile"
          routing="path"
          appearance={{
            variables: {
              colorPrimary: "#000000",
            },
            elements: {
              cardBox: "bg-card rounded-lg text-foreground",

              rootBox: "bg-card rounded-lg text-foreground",

              navbar: "bg-card rounded-lg text-foreground",
              navbarButton: `border-2 rounded-md transition-all duration-200
              bg-card border-black 
              dark:hover:bg-accent dark:bg-[rgb(238,157,138)] dark:text-black`,

              profileSectionItem: "text-foreground",
              formFieldLabel: "text-foreground",

              scrollBox: "bg-card rounded-lg text-foreground",
              headerTitle: "text-foreground",
              headerSubtitle: "text-foreground",
              pageScrollBox: "text-foreground",
              header: "text-foreground",
              profileSectionTitle: "text-foreground",
              profileSectionContent: "text-foreground",
              profileSectionItemList: "text-foreground",
              profileSectionItem__emailAddresses:
                "rounded-md bg-white py-1 px-4",
              menuButton: `border-2 rounded-md transition-all duration-200
              bg-card border-black
              dark:bg-[rgb(238,157,138)] text-black hover:bg-background`,
              avatarImageActionsUpload: `border-2 rounded-md transition-all duration-200
              bg-card border-black
              dark:bg-[rgb(238,157,138)] text-black hover:bg-background`,
              profileSectionPrimaryButton: `border-2 rounded-md transition-all duration-200
              bg-card border-black
              dark:bg-[rgb(238,157,138)] text-black hover:bg-background`,
              actionCard: "bg-background rounded-lg text-foreground",
            },
          }}
        >
          <UserProfile.Page
            label="Subscription"
            labelIcon={<Crown className="w-4 h-4" />}
            url="custom-page"
          >
            <SubscriptionPage />
          </UserProfile.Page>
        </UserProfile>
      </div>
    </div>
  );
}
