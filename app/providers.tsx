"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppearanceInit } from "@/components/shared/AppearanceInit";
import { PlayerCardProvider } from "@/lib/player-card/PlayerCardProvider";
import { RosterProvider } from "@/lib/roster/RosterProvider";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppearanceInit />
      <RosterProvider>
        <PlayerCardProvider>{children}</PlayerCardProvider>
      </RosterProvider>
    </AuthProvider>
  );
}