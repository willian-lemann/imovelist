"use client";

import { Instagram, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/queries/use-user";

export function InstagramConnectButton() {
  const { user } = useUser();
  const isConnected = !!user?.instagramUserId;

  async function handleConnect() {
    try {
      const res = await fetch("/api/instagram/connect", { method: "POST" });
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  }

  async function handleDisconnect() {
    try {
      await fetch("/api/instagram/disconnect", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-700 rounded-full text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Conectado
        </div>
        <Button variant="ghost" size="sm" onClick={handleDisconnect}>
          Desconectar
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} className="gap-2">
      <Instagram className="w-4 h-4" />
      Conectar Instagram
      <ExternalLink className="w-3 h-3" />
    </Button>
  );
}
