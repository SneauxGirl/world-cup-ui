"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { RosterProvider } from "@/lib/roster/RosterProvider";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode}) {
    return (
      <AuthProvider>
        <RosterProvider>{children}</RosterProvider>
      </AuthProvider>
    );
}