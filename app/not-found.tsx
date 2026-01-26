"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-xl mb-8">Could not find the requested resource</p>
      <Link href="/">
        <Button variant="brutalprimary">Return Home</Button>
      </Link>
    </div>
  );
}

