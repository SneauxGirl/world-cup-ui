"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

/** Signs out of Firebase and returns to the public landing page. */
export function useLogout() {
  const router = useRouter();
  const { signOut } = useAuth();

  return useCallback(async () => {
    await signOut();
    router.replace("/");
  }, [signOut, router]);
}
