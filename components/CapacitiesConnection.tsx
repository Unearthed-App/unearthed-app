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

import { CAPACITIES_ENABLED } from "@/lib/capacities-availability";
import { CapacitiesComingSoon } from "./CapacitiesComingSoon";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { checkCapacities, disconnectCapacities, getCapacitiesStatus } from "@/server/actions-capacities";
import type { CapacitiesStatus } from "@/server/capacities";

export function CapacitiesConnection(props: { premium?: boolean }) {
  return CAPACITIES_ENABLED ? <ActiveCapacitiesConnection {...props} /> : <CapacitiesComingSoon />;
}

function ActiveCapacitiesConnection({ premium = false }: { premium?: boolean }) {
  const [connection, setConnection] = useState<CapacitiesStatus>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getCapacitiesStatus().then(status => { if (active) setConnection(status); }).catch(() => {
      if (active) { setMessage("Could not load the Capacities connection. Please reload settings."); setError(true); }
    });
    const url = new URL(window.location.href);
    const result = url.searchParams.get("capacities");
    if (result) {
      setMessage(result === "connected" ? "Capacities connected. Your daily reflections will be sent to the space you approved." : result === "cancelled" ? "Connection cancelled. You can connect again when you are ready." : "Could not connect Capacities. Please try connecting again.");
      setError(result === "error");
      url.searchParams.delete("capacities");
      window.history.replaceState(window.history.state, "", url);
    }
    return () => { active = false; };
  }, []);

  async function run(action: typeof checkCapacities) {
    setBusy(true);
    try {
      const result = await action();
      setMessage(result.message);
      setError(!result.ok);
      setConnection(await getCapacitiesStatus());
    } catch {
      setMessage("Could not complete the request. Please try again.");
      setError(true);
    } finally { setBusy(false); }
  }

  const returnTo = premium ? "/premium/settings" : "/";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capacities</CardTitle>
        <CardDescription>Send your daily reading reflection to a Capacities daily note.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connection && !error && <p role="status">Loading connection…</p>}
        {connection?.state === "connected" && <p>Connected to <strong>{connection.spaceTitle}</strong>.</p>}
        {connection?.state === "reconnect" && <p>Your previous connection needs to be renewed. Connect again and choose the space for your reflections.</p>}
        {connection?.state === "disconnected" && <p>Choose a space on Capacities’ approval screen. Your connection is saved automatically.</p>}
        {connection && !connection.configured && <p>Capacities is coming soon.</p>}
        {message && <p role={error ? "alert" : "status"}>{message}</p>}
        <div className="flex flex-wrap gap-3">
          {connection?.configured && <Button type="button" variant="brutalprimary" disabled={busy} onClick={() => { window.location.assign(`/api/integrations/capacities/connect?returnTo=${encodeURIComponent(returnTo)}`); }}>{connection.state === "disconnected" ? "Connect to Capacities" : "Reconnect to Capacities"}</Button>}
          {connection?.state === "connected" && <Button type="button" disabled={busy} onClick={() => run(checkCapacities)}>{busy ? "Working…" : "Check connection"}</Button>}
          {connection && connection.state !== "disconnected" && <Button type="button" variant="outline" disabled={busy} onClick={() => run(disconnectCapacities)}>Disconnect</Button>}
        </div>
        <p className="text-sm text-muted-foreground">One reflection is sent for each day. This connection does not export your full highlight library. You can also revoke access in Capacities → Settings → Capacities API → Connections.</p>
      </CardContent>
    </Card>
  );
}
