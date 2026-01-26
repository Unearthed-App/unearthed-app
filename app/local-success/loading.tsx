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

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatedLoader } from "@/components/AnimatedLoader";

export default function Loading() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const didSendRef = useRef(false);

  useEffect(() => {
    const send = async () => {
      if (didSendRef.current) return;
      if (!sessionId) return;
      didSendRef.current = true;

      try {
        await fetch("/api/public/purchase-success-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch (e) {}
    };
    send();
  }, [sessionId]);

  return (
    <div className="pt-32 flex items-center justify-center">
      <AnimatedLoader />
    </div>
  );
}
