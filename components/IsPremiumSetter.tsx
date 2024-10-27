"use client";

import { useEffect } from "react";


export const IsPremiumSetter = ({ isPremium }: { isPremium: boolean }) => {
  useEffect(() => {
    localStorage.setItem("isPremium", isPremium ? "true" : "false");
  }, [isPremium]);

  return <></>;
};
