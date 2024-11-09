"use client";

import { Crown } from "lucide-react";
import { Button } from "./ui/button";

export function Checkout() {
  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/stripe-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { url } = await response.json();

      console.log("URL:", url);

      window.location.href = url;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Button variant="brutalprimary" onClick={handleCheckout}>
      <Crown className="mr-0 md:mr-2" />
      <span className="">Get Premium</span>
    </Button>
  );
}
