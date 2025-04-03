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

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

const checkCookieConsent = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("cookieConsent") === "true";
  }
  return false;
};

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsent");
    if (consentGiven === null) {
      setShowConsent(true);
    }
  }, []);

  const giveConsent = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
    window.location.reload();
  };

  const denyConsent = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card p-4 border-t-2">
      <h4 className={crimsonPro.className + " font-bold text-xl"}>
        Cookie Consent -{" "}
        <span className="text-secondary font-extrabold text-3xl">OFF</span> by
        default
      </h4>
      <p className="text-sm">
        Would you like to opt in and allow cookies? They are only used to help
        improve the user experience.
      </p>
      <div className="mt-2">
        <Button
          variant="brutalprimary"
          onClick={giveConsent}
          className="mr-2 px-4 py-2 "
        >
          Accept
        </Button>
        <Button
          variant="destructivebrutal"
          onClick={denyConsent}
          className="px-4 py-2"
        >
          Deny
        </Button>
      </div>
    </div>
  );
};

export { CookieConsent as default, checkCookieConsent };
